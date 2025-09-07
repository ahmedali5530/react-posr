import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackspace, faCircle } from "@fortawesome/free-solid-svg-icons";
import {faCircle as circleRegular} from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { appPage } from "@/store/jotai.ts";
import { cn } from "@/lib/utils.ts";
import { useDB } from "@/api/db/db.ts";
import { User } from "@/api/model/user.ts";
import {useNavigate} from "react-router";
import {MENU} from "@/routes/posr.ts";

export const Login = () => {
  const db = useDB();

  const [code, setCode] = useState('');
  const [page, setPage] = useAtom(appPage);
  const [error, setError] = useState(false);

  const navigation = useNavigate();

  const onClear = () => {
    setCode('');
  }

  const onBack = () => {
    setCode(prev => prev.slice(0, prev.length - 1));
  }

  const onKey = (key: string) => {
    if(code.trim().length <= 3){
      setCode(code + key);
    }
  }

  const checkLogin = async (login: string) => {
    if(login.trim().length === 4){
      const record: any = await db.query(`SELECT * from user where login = $login and crypto::bcrypt::compare(password, $login) = true`, {
        login: login,
      });

      if(record[0].length > 0){
        if(page.locked && page.lockedBy?.login !== record[0][0].login){
          denyLogin();
          return false;
        }

        allowLogin(record[0][0]);
      }else{
        denyLogin();
      }
    }
  }

  const allowLogin = (user: User) => {
    setPage(prev => ({
      ...prev,
      page: 'Menu',
      locked: false,
      lockedBy: undefined,
      user: user
    }));

    setCode('');

    // redirect to menu
    navigation(MENU);
  }

  const denyLogin = () => {
    setCode('');
    setError(true);
  }

  useEffect(() => {
    checkLogin(code)
  }, [code, page]);

  useEffect(() => {
    if(error){
      setTimeout(() => setError(false), 400);
    }
  }, [error]);

  return (
    <div className="relative">
      <div className="bg-neutral-900 flex justify-center items-center h-screen flex-col gap-8">
        <h4 className="text-4xl text-neutral-100">Enter PIN to login</h4>
        {page.locked && (
          <div className="alert alert-warning">System locked by {page?.lockedBy?.first_name} {page?.lockedBy?.last_name}, only they can open now</div>
        )}
        <div className={
          cn(
            "flex gap-3 text-neutral-100",
            error && 'login-error'
          )
        }>
          <FontAwesomeIcon size="lg" icon={code.trim().length >= 1 ? faCircle : circleRegular} />
          <FontAwesomeIcon size="lg" icon={code.trim().length >= 2 ? faCircle : circleRegular} />
          <FontAwesomeIcon size="lg" icon={code.trim().length >= 3 ? faCircle : circleRegular} />
          <FontAwesomeIcon size="lg" icon={code.trim().length === 4 ? faCircle : circleRegular} />
        </div>
        <div className="wrapper w-[400px]">
          <div className="grid grid-cols-3 gap-2 sm:gap-5 place-items-center">
            <button type="button" onClick={() => onKey('1')} className="btn-login">1</button>
            <button type="button" onClick={() => onKey('2')} className="btn-login">2</button>
            <button type="button" onClick={() => onKey('3')} className="btn-login">3</button>
            <button type="button" onClick={() => onKey('4')} className="btn-login">4</button>
            <button type="button" onClick={() => onKey('5')} className="btn-login">5</button>
            <button type="button" onClick={() => onKey('6')} className="btn-login">6</button>
            <button type="button" onClick={() => onKey('7')} className="btn-login">7</button>
            <button type="button" onClick={() => onKey('8')} className="btn-login">8</button>
            <button type="button" onClick={() => onKey('9')} className="btn-login">9</button>
            <button type="button" onClick={onBack} className="btn-login danger"><FontAwesomeIcon icon={faBackspace}/>
            </button>
            <button type="button" onClick={() => onKey('0')} className="btn-login">0</button>
            <button type="button" onClick={onClear} className="btn-login danger">C</button>
          </div>
        </div>
      </div>
      <div className="size-[100px] bg-warning-500/10 absolute top-10 right-[30%] rounded-full pointer-events-none transition-all blur-lg"></div>
      <div className="size-[200px] bg-primary-500/10 animate-bounce absolute top-20 left-[20%] rounded-full pointer-events-none transition-all blur-2xl"></div>
      <div className="size-[200px] bg-white/20 absolute bottom-[100px] transition-all right-24 pointer-events-none rotate-45 blur-2xl"></div>
      <div className="size-[200px] bg-[tomato]/20 absolute bottom-[30%] transition-all left-[150px] pointer-events-none blur-2xl"></div>
    </div>
  );
}

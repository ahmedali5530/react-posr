import { DB_REST_DB, DB_REST_NS, DB_REST_PASS, DB_REST_USER, withApi } from "@/api/db/settings.ts";
import { ActionResult, Surreal } from "surrealdb";
import { Tables } from "@/api/db/tables.ts";
import { toast } from "sonner";

let db: Surreal | undefined;

export const connect = async () => {
  if (db) return db;
  db = new Surreal();
  try {
    await db.connect(withApi(''), {
      namespace: DB_REST_NS,
      database: DB_REST_DB,
      auth: {
        username: DB_REST_USER,
        password: DB_REST_PASS,
      }
    });

    await db.ready;

    // await db.use({
    //   namespace: DB_REST_NS,
    //   database: DB_REST_DB,
    // });
    //
    // await db.signin({
    //   username: DB_REST_USER,
    //   password: DB_REST_PASS,
    // });

    return db;
  }catch(err){
    console.error(err);
    throw err;
  }
}

export const getDB = async () => {
  return await connect();
}

export const useDB = () => {
  const query = async <T = any>(sql: string, parameters?: any): Promise<ActionResult<Record<string, T>>[]> => {
    // log sql in dev mode
    if(import.meta.env.DEV) {
      // console.group('DB Debug')
      // console.info(sql.trim(), parameters);
      // console.groupEnd()
    }

    try {
      // Perform a custom advanced query
      return (await getDB()).query(sql, parameters);
    } catch ( e ) {
      console.error('ERROR while query', e, sql);
      toast.error(e);
      throw e;
    }
  }

  const select = async <T>(thing: Tables): Promise<ActionResult<Record<string, T>>[]> => {
    try{
      return (await getDB()).select(thing);
    }catch(e){
      console.log('ERROR while select', e);
      toast.error(e);
      throw e;
    }
  }

  const del = async (thing: Tables|string) => {
    try{
      return (await getDB()).delete(thing);
    }catch(e){
      console.error('ERROR while delete', e);
      toast.error(e);
      throw e;
    }
  }

  async function insert(thing: Tables|string, data: any){
    try{
      return (await getDB()).insert(thing, data);
    }catch(e){
      console.error('ERROR while insert', e);
      toast.error(e);
      throw e;
    }
  }


  const update = async (thing: Tables|string, data: any) => {
    try{
      return (await getDB()).update(thing, data);
    }catch(e){
      console.error('ERROR while updating', e);
      toast.error(e);
      throw e;
    }
  }

  const patch = async (thing: Tables|string, data: any) => {
    try{
      return (await getDB()).patch(thing, data);
    }catch(e){
      console.error('ERROR while patching', e);
      toast.error(e);
      throw e;
    }
  }

  const merge = async (thing: Tables|string, data: any) => {
    try{
      return (await getDB()).merge(thing, data);
    }catch(e){
      console.error('ERROR while merging', e);
      toast.error(e);
      throw e;
    }
  }

  const live = async (thing: Tables|string, callback: (action: any, result: any) => void, diff?: boolean) => {
    try{
      return (await getDB()).live(thing, callback, diff)
    }catch(e){
      console.log('ERROR while live query', e);
      toast.error(e);
      throw e;
    }
  }

  return {
    query,
    db,
    select,
    delete: del,
    insert, create: insert,
    update,
    patch,
    merge,
    live
  }
}

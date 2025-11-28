import { Layout } from "@/screens/partials/layout.tsx";
import { Button } from "@/components/common/input/button.tsx";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { appPage } from "@/store/jotai.ts";
import { useDB } from "@/api/db/db.ts";
import { Tables } from "@/api/db/tables.ts";
import { DateTime } from "luxon";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { LOGIN } from "@/routes/posr.ts";
import { Countdown } from "@/components/floor/countdown.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { TimeEntry } from "@/api/model/time_entry.ts";
import {StringRecordId} from "surrealdb";

export const Clock = () => {
  const [page, setPage] = useAtom(appPage);
  const db = useDB();
  const navigation = useNavigate();
  const [timeEntry, setTimeEntry] = useState<TimeEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadTimeEntry = async () => {
    if (!page.user) {
      navigation(LOGIN);
      return;
    }

    try {
      const timeEntryCheck: any = await db.query(`SELECT * from ${Tables.time_entries} where user = $userId and clock_out = NONE`, {
        userId: new StringRecordId(page.user.id),
      });

      if (timeEntryCheck[0].length > 0) {
        setTimeEntry(timeEntryCheck[0][0]);
      } else {
        toast.error('No active time entry found');
        navigation(LOGIN);
      }
    } catch (error) {
      toast.error('Failed to load time entry');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTimeEntry();
  }, []);

  const handleClockOut = async () => {
    if (!timeEntry || !page.user) return;

    try {
      const clockOutTime = DateTime.now().toJSDate();
      const clockInTime = new Date(timeEntry.clock_in);
      const durationSeconds = Math.floor((clockOutTime.getTime() - clockInTime.getTime()) / 1000);

      // Update time entry with clock out time and duration
      await db.merge(timeEntry.id, {
        clock_out: clockOutTime,
        duration_seconds: durationSeconds,
      });

      toast.success('Clocked out successfully');

      // Log out user
      setPage(prev => ({
        ...prev,
        page: 'Login',
        user: undefined
      }));

      navigation(LOGIN);
    } catch (error) {
      toast.error('Failed to clock out');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <Layout containerClassName="p-5">
        <div className="bg-white shadow p-5 rounded-lg">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!timeEntry) {
    return null;
  }

  const clockInDate = new Date(timeEntry.clock_in);
  const formattedClockInTime = DateTime.fromJSDate(clockInDate).toFormat('hh:mm a');
  const formattedClockInDate = DateTime.fromJSDate(clockInDate).toFormat('MMMM dd, yyyy');

  return (
    <Layout containerClassName="p-5">
      <div className="bg-white shadow p-5 rounded-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-4 rounded-full bg-primary-100">
            <FontAwesomeIcon icon={faClock} size="2x" className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Time Clock</h1>
            <p className="text-sm text-neutral-500">Track your work hours</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-50 p-6 rounded-lg">
            <div className="mb-4">
              <p className="text-sm text-neutral-500 mb-1">Clock In Time</p>
              <p className="text-2xl font-bold">{formattedClockInTime}</p>
              <p className="text-sm text-neutral-400">{formattedClockInDate}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-lg text-center">
            <p className="text-sm text-neutral-600 mb-2">Time Elapsed</p>
            <div className="text-5xl font-bold text-primary-700 mb-2">
              <Countdown time={clockInDate} showAll={true} />
            </div>
            <p className="text-sm text-neutral-500">Since clock in</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="danger"
              onClick={handleClockOut}
              size="lg"
              icon={faClock}
            >
              Clock Out
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};


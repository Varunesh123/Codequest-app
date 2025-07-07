import { useState } from "react";
import { setReminder } from "../api/api";

const ReminderButton = ({ contestId, contestStartTime }) => {
  const [status, setStatus] = useState("");
  const token = localStorage.getItem("token");

  const handleSetReminder = async (minutesBefore) => {
    const start = new Date(contestStartTime);
    const reminderTime = new Date(start.getTime() - minutesBefore * 60000);

    try {
      await setReminder(contestId, reminderTime, token);
      setStatus("Reminder set!");
    } catch (err) {
      setStatus("Failed to set reminder");
    }
  };

  return (
    <div className="mt-2">
      <button onClick={() => handleSetReminder(10)} className="text-sm text-blue-500">
        🔔 Remind me 10 min before
      </button>
      {status && <div className="text-green-600 text-sm mt-1">{status}</div>}
    </div>
  );
};

export default ReminderButton;

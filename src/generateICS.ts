import fs from "node:fs";
import { createEvent, type DateTime } from "ics";

export function generateICS(summary: string, cycleDays: number) {
  const now = new Date();

  // DateTime型は [year, month, day, hour, minute] の配列形式
  const start: DateTime = [
    now.getFullYear(),
    now.getMonth() + 1, // getMonth()は0ベースなので+1
    now.getDate(),
  ];

  const { error, value } = createEvent({
    title: summary,
    description:
      "Nail Reminderで生成した爪切りリマインドです！\n爪を切って！🗡️",
    start: start,
    recurrenceRule: `FREQ=DAILY;INTERVAL=${cycleDays}`,
    duration: { days: 0 },
    alarms: [
      {
        action: "display",
        summary: "爪切りリマインド",
        description: `前回の爪切りから${cycleDays}日が経過したよ！\n爪を切って！🗡️`,
        trigger: {
          hours: 0,
          minutes: 0,
          seconds: 0,
          before: false,
        },
      },
    ],
  });

  if (error) {
    console.error("ICS生成エラー:", error);
    throw error;
  }

  if (value && value.length > 0) {
    fs.writeFileSync("nail_reminder.ics", value);
    console.log("✅ nail_reminder.ics を生成しました！");
  } else {
    console.log("❌ nail_reminder.ics の生成に失敗しました");
  }
}

#!/usr/bin/env bun

import inquirer from "inquirer";
import { NailReminder } from "../src/nailReminder.ts";
import { generateICS } from "../src/generateICS.ts";

async function main() {
  console.log("🪶 Nail Reminder CLI\n");

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "gender",
      message: "性別を選んでください:",
      choices: [
        { name: "男性", value: "male" },
        { name: "女性", value: "female" },
      ],
    },
    {
      type: "list",
      name: "lifestyle",
      message: "普段の生活を選んでください:",
      choices: [
        { name: "スポーツが多い", value: "sports" },
        { name: "パソコンなど細かい作業が多い", value: "precision" },
        { name: "特に無し", value: "none" },
      ],
    },
    {
      type: "list",
      name: "lengthPref",
      message: "好みの爪の長さを選んでください:",
      choices: [
        { name: "指先とほぼ同じ", value: "short" },
        { name: "白い部分が1〜2mmくらい", value: "medium" },
        { name: "少し長めにしたい", value: "long" },
      ],
    },
    {
      type: "list",
      name: "target",
      message: "どちらの爪について？",
      choices: [
        { name: "手の爪", value: "hand" },
        { name: "足の爪", value: "foot" },
      ],
    },
  ]);

  const reminder = new NailReminder(answers);
  const result = reminder.generate();

  console.log("\n結果:");
  console.log(`- 推奨周期: ${result.cycleDays}日ごと`);
  console.log(`- 理由: ${result.reason}`);
  console.log("- Tips:");
  result.tips.forEach((tip) => console.log(`   • ${tip}`));
  console.log("");

  // Export time
  const { exportICS } = await inquirer.prompt([
    {
      type: "confirm",
      name: "exportICS",
      message:
        "Google Calendarに読み込むICSファイルを生成しますか？（爪切りリマインダー用）",
    },
  ]);

  if (exportICS) {
    generateICS("爪を切る", result.cycleDays);
    console.log(
      "`./nail_reminder.ics` にICSファイルを作成しました。\n➡ Google Calendarで「インポート」から nail_reminder.ics を読み込んでください。",
    );
  }
}

main();

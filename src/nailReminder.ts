type LifeStyle = "sports" | "precision" | "none";
type LengthPref = "short" | "medium" | "long";
type NailTarget = "hand" | "foot";

interface UserAnswers {
  gender: "male" | "female";
  lifestyle: LifeStyle;
  lengthPref: LengthPref;
  target: NailTarget;
}

class NailReminderResult {
  constructor(
    public cycleDays: number,
    public reason: string,
    public tips: string[],
  ) {}
}

export class NailReminder {
  private answers: UserAnswers;

  constructor(answers: UserAnswers) {
    this.answers = answers;
  }

  public generate(): NailReminderResult {
    const { gender, lifestyle, lengthPref, target } = this.answers;

    // 周期計算
    let baseDays = target === "hand" ? 7 : 20; // 足は手より伸びるのが遅い
    if (lengthPref === "medium") baseDays += 3;
    if (lengthPref === "long") baseDays += 5;

    // ライフスタイル補正
    if (lifestyle === "sports") baseDays -= 2;
    if (lifestyle === "precision") baseDays -= 1;

    // 性別による微調整（男性は伸びが少し早い傾向）
    if (gender === "male") baseDays -= 1;

    // 理由生成用の文テンプレート
    const baseReason: Record<NailTarget, string> = {
      hand: "手の爪は1日に約0.1mm伸び、1か月でおよそ3mmほど伸びます。",
      foot: "足の爪は手より伸びるのが遅く、1か月でおよそ1〜2mmしか伸びません。",
    };

    const lifestyleReason: Record<LifeStyle, string> = {
      sports:
        "スポーツをよくするため、短めに整えるとケガや割れを防ぎやすいです。",
      precision:
        "パソコンなど細かい作業が多いので、長すぎると邪魔になったり欠けやすくなります。",
      none: "特に大きなリスクはありませんが、清潔を保つために整えることが望ましいです。",
    };

    // 理由組み立て
    const tabspace = "        "; // 8 space
    const reason = `${baseReason[target]}\n${tabspace}あなたの場合は ${baseDays} 日ごとに切ると、指先とほぼ同じ長さをキープできます。\n${tabspace}${lifestyleReason[lifestyle]} ${
      target === "foot"
        ? `\n${tabspace}特に靴を履く時間が長いと、爪が長いと圧迫されて巻き爪や炎症の原因になるため、定期的に切りましょう。`
        : `\n${tabspace}白い部分が2〜3mm程度に保たれ、清潔で安全です。`
    }`;

    // Tips生成
    const tips: string[] = [
      "深爪は避けて、指先と同じくらいの長さを意識しましょう。",
      "入浴後に切ると柔らかく、割れにくいです。",
    ];
    if (target === "foot") {
      tips.push(
        "爪はまっすぐ切り、角を深く削らないようにしましょう（巻き爪予防）。",
      );
    }

    return new NailReminderResult(baseDays, reason, tips);
  }
}

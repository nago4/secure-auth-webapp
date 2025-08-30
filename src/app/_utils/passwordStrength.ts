export interface PasswordStrengthResult {
  score: number; // 1-10
  criteria: {
    length: boolean; // 10文字以上
    hasNumber: boolean; // 数字を含む
    hasUppercase: boolean; // 大文字を含む
    hasLowercase: boolean; // 小文字を含む
    hasSpecialChar: boolean; // 特殊文字を含む
  };
  feedback: string[];
}

export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  const criteria = {
    length: password.length >= 10,
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password),
  };

  // スコア計算（各条件で2点、合計10点満点）
  let score = 0;
  
  // 長さの評価（最大2点）
  if (criteria.length) {
    score += 2;
  } else if (password.length >= 8) {
    score += 1;
  }

  // 各条件で2点ずつ
  if (criteria.hasNumber) score += 2;
  if (criteria.hasUppercase) score += 2;
  if (criteria.hasLowercase) score += 2;
  if (criteria.hasSpecialChar) score += 2;

  // 最低1点、最高10点に調整
  score = Math.max(1, Math.min(10, score));

  // フィードバックメッセージ
  const feedback: string[] = [];
  if (!criteria.length && password.length < 8) {
    feedback.push("8文字以上にしてください");
  } else if (!criteria.length) {
    feedback.push("10文字以上にするとより安全です");
  }
  if (!criteria.hasNumber) {
    feedback.push("数字を含めてください");
  }
  if (!criteria.hasUppercase) {
    feedback.push("大文字を含めてください");
  }
  if (!criteria.hasLowercase) {
    feedback.push("小文字を含めてください");
  }
  if (!criteria.hasSpecialChar) {
    feedback.push("特殊文字(!@#$%など)を含めてください");
  }

  return {
    score,
    criteria,
    feedback,
  };
}

export function getStrengthLevel(score: number): {
  level: string;
  color: string;
  bgColor: string;
} {
  if (score <= 3) {
    return {
      level: "弱い",
      color: "text-red-600",
      bgColor: "bg-red-100",
    };
  } else if (score <= 6) {
    return {
      level: "普通",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    };
  } else if (score <= 8) {
    return {
      level: "強い",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    };
  } else {
    return {
      level: "とても強い",
      color: "text-green-600",
      bgColor: "bg-green-100",
    };
  }
}

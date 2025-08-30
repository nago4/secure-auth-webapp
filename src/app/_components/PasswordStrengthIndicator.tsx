import React from "react";
import {
  calculatePasswordStrength,
  getStrengthLevel,
  PasswordStrengthResult,
} from "@/app/_utils/passwordStrength";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  className = "",
}) => {
  // パスワードが空の場合は表示しない
  if (!password) {
    return null;
  }

  const strengthResult: PasswordStrengthResult = calculatePasswordStrength(password);
  const { level, color, bgColor } = getStrengthLevel(strengthResult.score);

  return (
    <div className={`mt-2 ${className}`}>
      {/* 強度バー */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium">強度:</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              strengthResult.score <= 3
                ? "bg-red-500"
                : strengthResult.score <= 6
                ? "bg-yellow-500"
                : strengthResult.score <= 8
                ? "bg-blue-500"
                : "bg-green-500"
            }`}
            style={{ width: `${(strengthResult.score / 10) * 100}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${color}`}>
          {strengthResult.score}/10 ({level})
        </span>
      </div>

      {/* 条件チェックリスト */}
      <div className="space-y-1">
        <div className="text-xs text-gray-600 mb-1">パスワード要件:</div>
        <div className="grid grid-cols-1 gap-1 text-xs">
          <div className="flex items-center gap-1">
            <span
              className={`w-3 h-3 rounded-full text-white text-center leading-3 text-[10px] ${
                strengthResult.criteria.length ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {strengthResult.criteria.length ? "✓" : ""}
            </span>
            <span className={strengthResult.criteria.length ? "text-green-600" : "text-gray-500"}>
              10文字以上
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`w-3 h-3 rounded-full text-white text-center leading-3 text-[10px] ${
                strengthResult.criteria.hasNumber ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {strengthResult.criteria.hasNumber ? "✓" : ""}
            </span>
            <span className={strengthResult.criteria.hasNumber ? "text-green-600" : "text-gray-500"}>
              数字を含む
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`w-3 h-3 rounded-full text-white text-center leading-3 text-[10px] ${
                strengthResult.criteria.hasUppercase ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {strengthResult.criteria.hasUppercase ? "✓" : ""}
            </span>
            <span className={strengthResult.criteria.hasUppercase ? "text-green-600" : "text-gray-500"}>
              大文字を含む
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`w-3 h-3 rounded-full text-white text-center leading-3 text-[10px] ${
                strengthResult.criteria.hasLowercase ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {strengthResult.criteria.hasLowercase ? "✓" : ""}
            </span>
            <span className={strengthResult.criteria.hasLowercase ? "text-green-600" : "text-gray-500"}>
              小文字を含む
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`w-3 h-3 rounded-full text-white text-center leading-3 text-[10px] ${
                strengthResult.criteria.hasSpecialChar ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {strengthResult.criteria.hasSpecialChar ? "✓" : ""}
            </span>
            <span className={strengthResult.criteria.hasSpecialChar ? "text-green-600" : "text-gray-500"}>
              特殊文字を含む (!@#$%など)
            </span>
          </div>
        </div>
      </div>

      {/* フィードバックメッセージ */}
      {strengthResult.feedback.length > 0 && (
        <div className="mt-2">
          <div className="text-xs text-gray-600 mb-1">改善提案:</div>
          <ul className="text-xs text-orange-600 space-y-0.5">
            {strengthResult.feedback.map((message, index) => (
              <li key={index} className="flex items-center gap-1">
                <span>•</span>
                <span>{message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

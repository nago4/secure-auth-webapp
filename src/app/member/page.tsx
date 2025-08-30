"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/_hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faSignOutAlt, 
  faPlus, 
  faMinus, 
  faSpinner,
  faKey
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/app/_components/Button";
import { useRouter } from "next/navigation";
import type { ApiResponse } from "@/app/_types/ApiResponse";
import NextLink from "next/link";

const Page: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const router = useRouter();
  const [count, setCount] = useState<number>(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // ユーザープロファイルからカウンタ値を初期化
  useEffect(() => {
    if (userProfile?.counterValue !== undefined) {
      setCount(userProfile.counterValue);
    }
  }, [userProfile]);

  // ログアウト処理
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("ログアウトエラー:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // カウンタ値をサーバーに保存
  const updateCounterOnServer = async (newValue: number) => {
    setIsUpdating(true);
    try {
      const response = await fetch("/api/counter", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ counterValue: newValue }),
      });

      const result: ApiResponse<null> = await response.json();

      if (!result.success) {
        console.error("カウンタ更新エラー:", result.message);
        setCount(userProfile?.counterValue || 0);
      }
    } catch (error) {
      console.error("カウンタ更新エラー:", error);
      setCount(userProfile?.counterValue || 0);
    } finally {
      setIsUpdating(false);
    }
  };

  // カウンタを増やす
  const handleIncrement = () => {
    const newValue = count + 1;
    setCount(newValue);
    updateCounterOnServer(newValue);
  };

  // カウンタを減らす
  const handleDecrement = () => {
    const newValue = count - 1;
    setCount(newValue);
    updateCounterOnServer(newValue);
  };

  // ローディング中はスピナーを表示
  if (!userProfile) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-blue-600" />
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-gray-800">
          <FontAwesomeIcon icon={faUser} className="mr-1.5" />
          メンバーダッシュボード
        </div>
        <div className="flex items-center gap-2">
          {/* ヘッダー用パスワード変更ボタン（最大3個） */}
          {Array.from({ length: Math.min(Math.max(1, count), 3) }, (_, index) => (
            <NextLink
              key={`header-${index}`}
              href="/member/change-password"
              className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs"
            >
              <FontAwesomeIcon icon={faKey} className="text-xs" />
              #{index + 1}
            </NextLink>
          ))}
          {count > 3 && (
            <span className="text-xs text-gray-500 mx-1">+{count - 3}個</span>
          )}
          <Button
            variant="indigo"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 ml-2"
          >
            {isLoggingOut ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <FontAwesomeIcon icon={faSignOutAlt} />
            )}
            {isLoggingOut ? "ログアウト中..." : "ログアウト"}
          </Button>
        </div>
      </div>

      {/* ユーザー情報 */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">
          ようこそ、{userProfile?.name}さん
        </h2>
        <div className="text-blue-600 text-sm">
          <div>メールアドレス: {userProfile?.email}</div>
          <div>ロール: {userProfile?.role}</div>
        </div>
      </div>

      {/* カウンタ */}
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <div className="text-lg font-bold text-gray-700 mb-2">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          カウンタ
        </div>
        <div className="flex items-center justify-center gap-4 mb-2">
          <Button
            variant="indigo"
            onClick={handleDecrement}
            className="px-3 py-2"
            aria-label="減らす"
            disabled={isUpdating}
          >
            <FontAwesomeIcon icon={faMinus} />
          </Button>
          <span className="text-3xl font-mono font-bold text-gray-800 w-16 inline-block">
            {count}
          </span>
          <Button
            variant="indigo"
            onClick={handleIncrement}
            className="px-3 py-2"
            aria-label="増やす"
            disabled={isUpdating}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>
        {isUpdating && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <FontAwesomeIcon icon={faSpinner} spin />
            <span>保存中...</span>
          </div>
        )}
      </div>

      {/* 追加情報 */}
      <div className="mt-6 bg-green-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          ログイン成功
        </h3>
        <p className="text-green-700 text-sm">
          認証に成功しました。このページはログインが必要なコンテンツです。
        </p>
      </div>

      {/* セキュリティ設定 */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          セキュリティ設定
        </h3>
        <div className="mb-3">
          <span className="text-blue-600 text-sm">
            カウンタの数: {count} → パスワード変更ボタン: {Math.min(Math.max(1, count), 20)}個
            {count > 20 && <span className="text-orange-600 ml-2">(最大20個まで表示)</span>}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* カウンタの数だけパスワード変更ボタンを表示（最低1個、最大20個） */}
          {Array.from({ length: Math.min(Math.max(1, count), 20) }, (_, index) => (
            <NextLink
              key={index}
              href="/member/change-password"
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm justify-center"
            >
              <FontAwesomeIcon icon={faKey} />
              <span className="text-xs">#{index + 1}</span>
            </NextLink>
          ))}
        </div>
        <div className="mt-3">
          <span className="text-blue-600 text-sm">
            定期的なパスワード変更でセキュリティを向上させましょう
            {count > 20 && (
              <span className="block text-orange-600 text-xs mt-1">
                ※ セキュリティ上の理由により、ボタン表示は最大20個に制限されています
              </span>
            )}
          </span>
        </div>
      </div>
    </main>
  );
};

export default Page;

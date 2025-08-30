"use client";

import React, { useState, useEffect, createContext } from "react";
import type { UserProfile } from "@/app/_types/UserProfile";
import useSWR, { mutate } from "swr";
import type { ApiResponse } from "../_types/ApiResponse";
import { sessionFetcher } from "./sessionFetcher";

interface AuthContextProps {
  userProfile: UserProfile | null;
  logout: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { data: auth } = useSWR<ApiResponse<UserProfile | null>>(
    "/api/auth",
    sessionFetcher,
  );

  useEffect(() => {
    if (auth && auth.success) {
      setUserProfile(auth.payload);
      return;
    }
    setUserProfile(null);
  }, [auth]);

  const logout = async () => {
    try {
      // ■■ セッションベース認証 ■■
      // サーバーサイドでセッションを削除
      await fetch("/api/logout", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
      });
    } catch (error) {
      console.error("ログアウトAPIエラー:", error);
    }
    
    // SWR キャッシュを無効化
    mutate(() => true, undefined, { revalidate: false });
    setUserProfile(null);
    return true;
  };

  return (
    <AuthContext.Provider value={{ userProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

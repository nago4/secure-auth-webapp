import { cookies } from "next/headers";
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import type { ApiResponse } from "@/app/_types/ApiResponse";

// キャッシュを無効化して常に最新情報を取得
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const POST = async () => {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (sessionId) {
      // セッションをデータベースから削除
      await prisma.session.deleteMany({ where: { id: sessionId } });
    }

    // Cookieを削除
    cookieStore.set("session_id", "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 0,
      secure: false, // 開発用設定
    });

    const res: ApiResponse<null> = {
      success: true,
      payload: null,
      message: "ログアウトしました。",
    };
    return NextResponse.json(res);
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Internal Server Error";
    console.error(errorMsg);
    const res: ApiResponse<null> = {
      success: false,
      payload: null,
      message: "ログアウト処理に失敗しました。",
    };
    return NextResponse.json(res);
  }
};

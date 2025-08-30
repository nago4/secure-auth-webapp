import { prisma } from "@/libs/prisma";
import { changePasswordRequestSchema } from "@/app/_types/ChangePasswordRequest";
import type { ApiResponse } from "@/app/_types/ApiResponse";
import { NextResponse, NextRequest } from "next/server";
import { verifySession } from "@/app/api/_helper/verifySession";

// キャッシュを無効化して常に最新情報を取得
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const POST = async (req: NextRequest) => {
  try {
    const userId = await verifySession();
    if (!userId) {
      const res: ApiResponse<null> = {
        success: false,
        payload: null,
        message: "認証情報が無効です。再度ログインしてください。",
      };
      return NextResponse.json(res);
    }

    // リクエストボディを取得・バリデーション
    const result = changePasswordRequestSchema.safeParse(await req.json());
    if (!result.success) {
      const res: ApiResponse<null> = {
        success: false,
        payload: null,
        message: "リクエストボディの形式が不正です。",
      };
      return NextResponse.json(res);
    }
    const { currentPassword, newPassword } = result.data;

    // 現在のユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const res: ApiResponse<null> = {
        success: false,
        payload: null,
        message: "ユーザー情報が見つかりません。",
      };
      return NextResponse.json(res);
    }

    // 現在のパスワードを検証
    // 注意: 実際のプロダクションではbcryptを使用してハッシュ化されたパスワードを比較すべき
    const isValidCurrentPassword = user.password === currentPassword;
    if (!isValidCurrentPassword) {
      const res: ApiResponse<null> = {
        success: false,
        payload: null,
        message: "現在のパスワードが正しくありません。",
      };
      return NextResponse.json(res);
    }

    // パスワードを更新
    // 注意: 実際のプロダクションではbcryptを使用してパスワードをハッシュ化すべき
    await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });

    const res: ApiResponse<null> = {
      success: true,
      payload: null,
      message: "パスワードが正常に変更されました。",
    };
    return NextResponse.json(res);
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Internal Server Error";
    console.error(errorMsg);
    const res: ApiResponse<null> = {
      success: false,
      payload: null,
      message: "パスワード変更に関するバックエンド処理に失敗しました。",
    };
    return NextResponse.json(res);
  }
};

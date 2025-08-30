import { prisma } from "@/libs/prisma";
import type { ApiResponse } from "@/app/_types/ApiResponse";
import { NextResponse, NextRequest } from "next/server";
import { verifySession } from "@/app/api/_helper/verifySession";
import { z } from "zod";

// キャッシュを無効化して常に最新情報を取得
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const updateCounterSchema = z.object({
  counterValue: z.number(),
});

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

    // リクエストボディを取得
    const result = updateCounterSchema.safeParse(await req.json());
    if (!result.success) {
      const res: ApiResponse<null> = {
        success: false,
        payload: null,
        message: "リクエストボディの形式が不正です。",
      };
      return NextResponse.json(res);
    }
    const { counterValue } = result.data;

    // カウンタ値を更新
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { counterValue },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        counterValue: true,
      },
    });

    const res: ApiResponse<typeof updatedUser> = {
      success: true,
      payload: updatedUser,
      message: "カウンタ値が更新されました。",
    };
    return NextResponse.json(res);
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Internal Server Error";
    console.error(errorMsg);
    const res: ApiResponse<null> = {
      success: false,
      payload: null,
      message: "カウンタ更新に関するバックエンド処理に失敗しました。",
    };
    return NextResponse.json(res);
  }
};

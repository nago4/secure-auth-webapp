"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  changePasswordRequestSchema, 
  ChangePasswordRequest 
} from "@/app/_types/ChangePasswordRequest";
import { TextInputField } from "@/app/_components/TextInputField";
import { ErrorMsgField } from "@/app/_components/ErrorMsgField";
import { Button } from "@/app/_components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faSpinner, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { PasswordStrengthIndicator } from "@/app/_components/PasswordStrengthIndicator";
import type { ApiResponse } from "@/app/_types/ApiResponse";

const Page: React.FC = () => {
  const c_CurrentPassword = "currentPassword";
  const c_NewPassword = "newPassword";
  const c_ConfirmNewPassword = "confirmNewPassword";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // フォーム処理関連の準備と設定
  const formMethods = useForm<ChangePasswordRequest>({
    mode: "onChange",
    resolver: zodResolver(changePasswordRequestSchema),
  });
  const fieldErrors = formMethods.formState.errors;

  // 新しいパスワードの監視
  const watchedNewPassword = formMethods.watch(c_NewPassword);
  React.useEffect(() => {
    setNewPassword(watchedNewPassword || "");
  }, [watchedNewPassword]);

  // ルートエラーの設定
  const setRootError = (errorMsg: string) => {
    formMethods.setError("root", {
      type: "manual",
      message: errorMsg,
    });
  };

  // フォームの送信処理
  const onSubmit = async (formValues: ChangePasswordRequest) => {
    setIsSubmitting(true);
    setRootError("");

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
        credentials: "same-origin",
        cache: "no-store",
      });

      const body: ApiResponse<null> = await res.json();

      if (!body.success) {
        setRootError(body.message);
        return;
      }

      // 成功時の処理
      setIsSuccess(true);
      formMethods.reset();
      setNewPassword("");
    } catch (e) {
      const errorMsg =
        e instanceof Error ? e.message : "予期せぬエラーが発生しました。";
      setRootError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main>
        <div className="text-2xl font-bold text-green-600">
          <FontAwesomeIcon icon={faCheckCircle} className="mr-1.5" />
          パスワード変更完了
        </div>
        <div className="mt-4 bg-green-50 rounded-lg p-4">
          <p className="text-green-800">
            パスワードが正常に変更されました。新しいパスワードでログインしてください。
          </p>
        </div>
        <div className="mt-4">
          <Button
            variant="indigo"
            onClick={() => setIsSuccess(false)}
            className="mr-2"
          >
            再度変更する
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="text-2xl font-bold">
        <FontAwesomeIcon icon={faKey} className="mr-1.5" />
        パスワード変更
      </div>
      
      <div className="mt-2 text-gray-600">
        セキュリティ向上のため、定期的なパスワード変更をお勧めします。
      </div>

      <form
        noValidate
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-y-4 max-w-md"
      >
        {/* 現在のパスワード */}
        <div>
          <label htmlFor={c_CurrentPassword} className="mb-2 block font-bold">
            現在のパスワード
          </label>
          <TextInputField
            {...formMethods.register(c_CurrentPassword)}
            id={c_CurrentPassword}
            placeholder="現在のパスワードを入力"
            type="password"
            disabled={isSubmitting}
            error={!!fieldErrors.currentPassword}
            autoComplete="current-password"
          />
          <ErrorMsgField msg={fieldErrors.currentPassword?.message} />
        </div>

        {/* 新しいパスワード */}
        <div>
          <label htmlFor={c_NewPassword} className="mb-2 block font-bold">
            新しいパスワード
          </label>
          <TextInputField
            {...formMethods.register(c_NewPassword)}
            id={c_NewPassword}
            placeholder="新しいパスワードを入力"
            type="password"
            disabled={isSubmitting}
            error={!!fieldErrors.newPassword}
            autoComplete="new-password"
          />
          <ErrorMsgField msg={fieldErrors.newPassword?.message} />
          <PasswordStrengthIndicator password={newPassword} />
        </div>

        {/* 新しいパスワード（確認） */}
        <div>
          <label htmlFor={c_ConfirmNewPassword} className="mb-2 block font-bold">
            新しいパスワード（確認）
          </label>
          <TextInputField
            {...formMethods.register(c_ConfirmNewPassword)}
            id={c_ConfirmNewPassword}
            placeholder="新しいパスワードを再入力"
            type="password"
            disabled={isSubmitting}
            error={!!fieldErrors.confirmNewPassword}
            autoComplete="new-password"
          />
          <ErrorMsgField msg={fieldErrors.confirmNewPassword?.message} />
          <ErrorMsgField msg={fieldErrors.root?.message} />
        </div>

        <Button
          variant="indigo"
          width="stretch"
          className="tracking-widest mt-2"
          disabled={!formMethods.formState.isValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              変更中...
            </>
          ) : (
            "パスワードを変更"
          )}
        </Button>
      </form>

      {/* 注意事項 */}
      <div className="mt-6 bg-yellow-50 rounded-lg p-4 max-w-md">
        <h3 className="font-bold text-yellow-800 mb-2">注意事項</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 強力なパスワードを設定してください</li>
          <li>• 他のサービスと同じパスワードは使用しないでください</li>
          <li>• パスワード変更後は全ての端末で再ログインが必要になります</li>
        </ul>
      </div>
    </main>
  );
};

export default Page;

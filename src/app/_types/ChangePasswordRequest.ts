import { z } from "zod";
import { passwordSchema } from "@/app/_types/CommonSchemas";

export const changePasswordRequestSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmNewPassword: passwordSchema,
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "新しいパスワードが一致しません",
  path: ["confirmNewPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "新しいパスワードは現在のパスワードと異なる必要があります",
  path: ["newPassword"],
});

export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>;

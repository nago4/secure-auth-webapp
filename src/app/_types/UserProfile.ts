import { z } from "zod";
import {
  userNameSchema,
  emailSchema,
  roleSchema,
  uuidSchema,
} from "./CommonSchemas";

export const userProfileSchema = z.object({
  id: uuidSchema,
  name: userNameSchema,
  email: emailSchema,
  role: roleSchema,
  counterValue: z.number().default(0),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

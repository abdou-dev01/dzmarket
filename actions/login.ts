import { LoginSchema } from "@/schema";
import { z } from "zod";

export const Login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields) {
    return { error: "Invalid credential!" };
  }

  return { success: "Email sent" };
};

import { z } from "zod";
import { RegisterSchema } from "@/schema/index";

export const Register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields) {
    return { error: "Invalid credential!" };
  }

  return { success: "Email sent" };
};

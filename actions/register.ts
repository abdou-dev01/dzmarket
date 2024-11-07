"use server";

import { z } from "zod";
import { RegisterSchema } from "@/schema/index";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/helpers/user";

export const Register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields) {
    return { error: "Invalid credential!" };
  }

  if (validatedFields.data?.email) {
    const { email, name, password } = validatedFields?.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) return { error: "Email already in use" };

    await db.user.create({ data: { email, name, password: hashedPassword } });

    return { success: "User Created" };
  }
};

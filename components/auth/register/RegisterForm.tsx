"use client";

import { CardWrapper } from "@/components/auth/CardWrapper";
import RegisterFormUi from "@/components/auth/register/RegisterFormUi";

export default function RegisterForm() {
  return (
    <div className="w-96 md:w-[450px]">
      <CardWrapper
        headerLabel="Create an account"
        backButtonHref="/login"
        backButtonLabel="login to your account?"
        showSocial
      >
        <RegisterFormUi />
      </CardWrapper>
    </div>
  );
}

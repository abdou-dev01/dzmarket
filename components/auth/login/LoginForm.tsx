"use client";

import { CardWrapper } from "@/components/auth/CardWrapper";
import LoginFormUi from "./LoginFormUi";

export default function LoginForm() {
  return (
    <div className="w-96 md:w-[450px]">
      <CardWrapper
        headerLabel="Welecome Back"
        backButtonHref="/register"
        backButtonLabel="Don't have an account?"
        showSocial
      >
        <LoginFormUi />
      </CardWrapper>
    </div>
  );
}

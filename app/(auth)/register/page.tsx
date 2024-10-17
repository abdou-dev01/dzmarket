import RegisterForm from "@/components/auth/register/RegisterForm";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />;
    </Suspense>
  );
};

export default LoginPage;

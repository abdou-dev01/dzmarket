import Container from "@/components/Container";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container className="flex justify-center items-center h-full">
      {children}
    </Container>
  );
};

export default AuthLayout;

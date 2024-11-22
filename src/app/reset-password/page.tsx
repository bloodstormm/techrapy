"use client";
import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm"; // Você precisará criar este componente

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

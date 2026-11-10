import AuthForm from "@/components/AuthForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const instant = false;

export const metadata = {
  title: "Daftar Akun | Web Toko",
};

export default async function RegisterPage({ searchParams }) {
  const session = await auth();

  if (session) {
    redirect("/profil");
  }

  const params = await searchParams;
  const callbackUrl = Array.isArray(params?.callbackUrl)
    ? params.callbackUrl[0]
    : params?.callbackUrl;

  return (
    <AuthForm
      mode="register"
      callbackUrl={callbackUrl}
      hasError={Boolean(params?.error)}
    />
  );
}

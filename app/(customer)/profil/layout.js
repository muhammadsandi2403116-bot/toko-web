import { auth } from "@/auth";
import ProfileSidebar from "@/components/layout/ProfileSidebar";
import { redirect } from "next/navigation";

export const instant = false;

export default async function ProfileLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/masuk?callbackUrl=/profil");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[260px_1fr]">
        <ProfileSidebar user={session.user} />
        <section className="min-w-0 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          {children}
        </section>
      </div>
    </main>
  );
}

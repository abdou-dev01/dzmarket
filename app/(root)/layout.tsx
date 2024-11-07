import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    redirect("/login");
  }

  const store = await db.store.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (store) redirect(`/${store.id}`);

  return <>{children}</>;
}

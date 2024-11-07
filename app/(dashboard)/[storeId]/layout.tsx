import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    redirect("/login");
  }

  const stores = await db.store.findMany({
    where: {
      userId: user.id,
    },
  });

  const store = stores.find((store) => store.id === params.storeId);

  if (!store) redirect("/");

  return (
    <>
      <Navbar stores={stores} />
      {children}
    </>
  );
}

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) redirect("/login");

  const store = await db.store.findFirst({
    where: { id: params.storeId, userId: user.id },
  });

  if (!store) redirect("/");

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm store={store} />
      </div>
    </div>
  );
};

export default SettingsPage;

import { db } from "@/lib/db";
import { format } from "date-fns";
import BillboardClient from "./BillboardClient";
import { BillboardColumns } from "./Columns";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumns[] = billboards.map(
    (billboard) => ({
      id: billboard.id,
      label: billboard.label,
      createdAt: format(billboard.createAt, "MMMM do, yyyy"),
    })
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;

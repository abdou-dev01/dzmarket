"use client";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { OrdersColumns, columns } from "./Columns";
import { DataTable } from "@/components/ui/dataTable";
import ApiList from "@/components/ApiList";

interface OrderClientProps {
  data: OrdersColumns[];
}

const OrderClient: React.FC<OrderClientProps> = ({ data = [] }) => {
  return (
    <>
      <Heading
        title={`Orders ${data.length}`}
        description="Manage order for your store"
      />
      <hr />
      <DataTable columns={columns} data={data} serachKey="products" />
    </>
  );
};

export default OrderClient;

"use client";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SizeColumns, columns } from "./Columns";
import { DataTable } from "@/components/ui/dataTable";
import ApiList from "@/components/ApiList";

interface SizeClientProps {
  data: SizeColumns[];
}

const SizeClient: React.FC<SizeClientProps> = ({ data = [] }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes ${data.length}`}
          description="Manage size for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className="h-4 w-4" />
          Add new
        </Button>
      </div>
      <hr />
      <DataTable columns={columns} data={data} serachKey="name" />
      <Heading title="Api" description="Api calls for Sizes" />
      <hr />
      <ApiList entityName="size" entityIdName="sizeId" />
    </>
  );
};

export default SizeClient;

"use client";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ProductColumns, columns } from "./Columns";
import { DataTable } from "@/components/ui/dataTable";
import ApiList from "@/components/ApiList";

interface ProductClientProps {
  data: ProductColumns[];
}

const ProductClient: React.FC<ProductClientProps> = ({ data = [] }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products ${data.length}`}
          description="Manage product for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="h-4 w-4" />
          Add new
        </Button>
      </div>
      <hr />
      <DataTable columns={columns} data={data} serachKey="name" />
      <Heading title="Api" description="Api calls for Products" />
      <hr />
      <ApiList entityName="product" entityIdName="productId" />
    </>
  );
};

export default ProductClient;

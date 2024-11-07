"use client";

import Heading from "@/components/Heading";
import ImageUpload from "@/components/ImageUpload";
import AlertModal from "@/components/modals/AlertModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategorySchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CategoryFormProps {
  category: Category | null;
  billboards: Billboard[];
}

type CategoryFormValues = z.infer<typeof CategorySchema>;

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  billboards,
}) => {
  const params = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = category ? "Edit category" : "Create category";
  const description = category ? "Edit a category" : "Add a new category";
  const toastMessage = category ? "category updated" : "category created";
  const action = category ? "Save changes" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: category || { name: "", billboardId: "" },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setIsLoading(true);
      if (category) {
        await axios.patch(
          `/api/${params.storeId}/category/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/category`, data);
      }
      router.push(`/${params.storeId}/categories`);
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(
        `/api/${params.storeId}/category/${params.categoryId}`
      );
      router.push(`/${params.storeId}/category`);
      router.refresh();
      toast.success("Category deleted");
    } catch (error) {
      toast.error(
        "Make sure you removed all products using this category first"
      );
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => onDelete()}
        isLoading={isLoading}
      />
      <div className="flex justify-between items-center">
        <Heading title={title} description={description} />
        {category && (
          <Button
            disabled={isLoading}
            variant="destructive"
            size="icon"
            onClick={() => setIsOpen(true)}
          >
            {" "}
            <Trash className="h-5 w-5" />{" "}
          </Button>
        )}
      </div>
      <hr />
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="category label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CategoryForm;

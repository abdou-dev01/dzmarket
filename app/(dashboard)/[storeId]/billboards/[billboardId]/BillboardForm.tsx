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
import { BillboardSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface BillboardFormProps {
  billboard: Billboard | null;
}

type BillboardFormValues = z.infer<typeof BillboardSchema>;

const BillboardForm: React.FC<BillboardFormProps> = ({ billboard }) => {
  const params = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = billboard ? "Edit billboard" : "Create billboard";
  const description = billboard ? "Edit a billboard" : "Add a new billboard";
  const toastMessage = billboard ? "Billboard updated" : "Billboard created";
  const action = billboard ? "Save changes" : "Create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(BillboardSchema),
    defaultValues: billboard || { label: "", imageUrl: "" },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setIsLoading(true);
      if (billboard) {
        await axios.patch(
          `/api/${params.storeId}/billboard/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboard`, data);
      }
      router.push(`/${params.storeId}/billboards`);
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
        `/api/${params.storeId}/billboard/${params.billboardId}`
      );
      router.push(`/${params.storeId}/billboards`);
      router.refresh();
      toast.success("billboard deleted");
    } catch (error) {
      toast.error("Make sure you removed all categories first");
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
        {billboard && (
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={isLoading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="billboard label"
                      {...field}
                    />
                  </FormControl>
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

export default BillboardForm;

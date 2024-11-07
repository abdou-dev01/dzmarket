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
import { SizeSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface SizeFormProps {
  size: Size | null;
}

type SizeFormValues = z.infer<typeof SizeSchema>;

const SizeForm: React.FC<SizeFormProps> = ({ size }) => {
  const params = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = size ? "Edit size" : "Create size";
  const description = size ? "Edit a size" : "Add a new size";
  const toastMessage = size ? "Size updated" : "Size created";
  const action = size ? "Save changes" : "Create";

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(SizeSchema),
    defaultValues: size || { name: "", value: "" },
  });

  const onSubmit = async (data: SizeFormValues) => {
    try {
      setIsLoading(true);
      if (size) {
        await axios.patch(`/api/${params.storeId}/size/${params.sizeId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/size`, data);
      }
      router.push(`/${params.storeId}/sizes`);
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
      await axios.delete(`/api/${params.storeId}/size/${params.sizeId}`);
      router.push(`/${params.storeId}/sizes`);
      router.refresh();
      toast.success("size deleted");
    } catch (error) {
      toast.error("Make sure you removed all products using this size first");
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
        {size && (
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
                      placeholder="size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="size value"
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

export default SizeForm;

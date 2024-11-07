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
import { ColorSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ColorFormProps {
  color: Color | null;
}

type ColorFormValues = z.infer<typeof ColorSchema>;

const ColorForm: React.FC<ColorFormProps> = ({ color }) => {
  const params = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = color ? "Edit color" : "Create color";
  const description = color ? "Edit a color" : "Add a new color";
  const toastMessage = color ? "Color updated" : "Color created";
  const action = color ? "Save changes" : "Create";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(ColorSchema),
    defaultValues: color || { name: "", value: "" },
  });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setIsLoading(true);
      if (color) {
        await axios.patch(
          `/api/${params.storeId}/color/${params.colorId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/color`, data);
      }
      router.push(`/${params.storeId}/colors`);
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
      await axios.delete(`/api/${params.storeId}/color/${params.colorId}`);
      router.push(`/${params.storeId}/colors`);
      router.refresh();
      toast.success("Color deleted");
    } catch (error) {
      toast.error("Make sure you removed all products using this color first");
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
        {color && (
          <Button
            disabled={isLoading}
            variant="destructive"
            color="icon"
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
                      placeholder="color name"
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
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={isLoading}
                        placeholder="color value"
                        {...field}
                      />
                      <div
                        className="rounded-full border p-4"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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

export default ColorForm;

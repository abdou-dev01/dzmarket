"use client";

import ApiAlert from "@/components/ApiAlert";
import Heading from "@/components/Heading";
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
import { useOrigin } from "@/hooks/useOrigin";
import { StoreSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface SettingsFormProps {
  store: Store;
}

type SettingsFormValues = z.infer<typeof StoreSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({ store }) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(StoreSchema),
    defaultValues: store,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success("Store updated");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      toast.success("Store deleted");
    } catch (error) {
      toast.error("Make sure you removed all products and categories first");
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
        <Heading title="Settings" description="Manage store preferences" />
        <Button
          disabled={isLoading}
          variant="destructive"
          size="icon"
          onClick={() => setIsOpen(true)}
        >
          {" "}
          <Trash className="h-5 w-5" />{" "}
        </Button>
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
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} type="submit">
            Save changes
          </Button>
        </form>
      </Form>
      <hr />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${store.id}`}
        variant="public"
      />
    </>
  );
};

export default SettingsForm;

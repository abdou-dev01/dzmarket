"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useStoreModal } from "@/hooks/useStoreModal";
import { StoreSchema } from "@/schema";
import Modal from "@/components/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

const StoreModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const storeModal = useStoreModal();
  const form = useForm<z.infer<typeof StoreSchema>>({
    resolver: zodResolver(StoreSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof StoreSchema>) => {
    try {
      setIsLoading(true);

      const response = await axios.post("/api/stores", values);

      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      console.log("STORE_MODAL", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Create your store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="computer store"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex justify-end items-center">
              <Button
                disabled={isLoading}
                variant="outline"
                onClick={storeModal.onClose}
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default StoreModal;

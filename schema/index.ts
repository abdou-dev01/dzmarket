import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  name: z.string({
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(8, {
    message: "Minimum 8 characters is required",
  }),
});

export const StoreSchema = z.object({
  name: z.string().min(3, {
    message: "Name store need to be at least 3 charachter",
  }),
});

export const BillboardSchema = z.object({
  label: z.string().min(3, {
    message: "Billboard Label need to be at least 3 charachter",
  }),
  imageUrl: z.string().min(1),
});

export const CategorySchema = z.object({
  name: z.string().min(1, {
    message: "category name need to be at least 3 charachter",
  }),
  billboardId: z.string().min(1, {
    message: "You must add category",
  }),
});

export const SizeSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

export const ColorSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: "String must a valid hex code",
  }),
});

export const ProductSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 charachter",
  }),
  price: z.coerce.number().min(1),
  images: z
    .object({
      url: z.string().min(1, { message: "Image URL cannot be empty." }),
    })
    .array()
    .min(1, "Please upload at least one image."),
  categoryId: z.string().min(1, {
    message: "You must add category",
  }),
  colorId: z.string().min(1, {
    message: "You must add color",
  }),
  sizeId: z.string().min(1, {
    message: "You must add size",
  }),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

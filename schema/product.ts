import { ProductServiceStatus, ProductServiceStockStatus } from "@prisma/client"
import * as z from "zod"

export const productCreateSchema = z.object({
  name: z
    .string({ message: "Name is required." })
    .min(1, { message: "Name is required." }),
  sku: z
    .string({ message: "SKU is required." })
    .min(1, { message: "SKU is required." }),

  status: z.nativeEnum(ProductServiceStatus).default("ACTIVE"),
  stockStatus: z.nativeEnum(ProductServiceStockStatus).default("IN_STOCK"),

  categoryId: z.string().optional(),

  image: z.string().url({ message: "Invalid image URL." }).optional(),

  unitId: z.string().optional(),

  description: z.string().optional(),

  salesPriceOrRate: z.number().optional(),

  inventoryAssetAccountId: z.string().optional(),
  incomeAccountId: z.string().optional(),
  expenseAccountId: z.string().optional(),

  purchasingDescription: z.string().optional(),

  cost: z.number().optional(),

  isSelling: z.boolean().optional(),
  isPurchasing: z.boolean().optional(),

  supplierId: z.string().optional(),
})

export const inventoryCreateSchema = productCreateSchema.extend({
  initialQuantity: z
    .number()
    .int({ message: "Must be a whole number." })
    .positive({ message: "Must be greater than 0" })
    .optional(),

  asOfDate: z.string().optional(),

  reorderPoint: z
    .number()
    .int({ message: "Must be a whole number." })
    .positive({ message: "Must be greater than 0" })
    .optional(),
})

export type ProductCreateInput = z.infer<typeof productCreateSchema>

export type InventoryCreateInput = z.infer<typeof inventoryCreateSchema>

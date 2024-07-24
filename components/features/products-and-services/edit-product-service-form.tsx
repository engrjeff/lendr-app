"use client"

import { ProductItem } from "@/actions/products"
import { ProductServiceType } from "@prisma/client"

import { InventoryTypeEditForm } from "./inventory-type-edit-form"
import { NonInventoryTypeEditForm } from "./non-inventory-type-edit-form"

interface Props {
  product: ProductItem
  closeCallback?: () => void
}

export function EditProductServiceForm({ product, closeCallback }: Props) {
  if (product.type === ProductServiceType.INVENTORY)
    return (
      <InventoryTypeEditForm product={product} closeCallback={closeCallback} />
    )

  if (product.type === ProductServiceType.NON_INVENTORY)
    return (
      <NonInventoryTypeEditForm
        product={product}
        closeCallback={closeCallback}
      />
    )

  return (
    <div className="p-6">
      <p>TO DO. Not yet implemented.</p>
      <pre>{product.id}</pre>
    </div>
  )
}
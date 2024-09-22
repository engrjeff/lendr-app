import * as z from "zod"

export const withEntityId = z.object({
  id: z.string({ required_error: "ID is required." }),
})

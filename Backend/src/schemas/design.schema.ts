import { z } from "zod";

export const DesignSchema = z.object({
  entities: z.array(z.string()),
  flows: z.array(z.string()),
  permissions: z.record(
    z.string(),
    z.array(z.string())
  )
});
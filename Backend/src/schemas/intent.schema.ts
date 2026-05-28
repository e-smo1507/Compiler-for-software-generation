import { z } from "zod";

export const IntentSchema = z.object({
  app_type: z.string(),
  modules: z.array(z.string()),
  roles: z.array(z.string()),
  requirements: z.record(
    z.string(),
    z.any()
  )
});

export type IntentType = z.infer<typeof IntentSchema>;
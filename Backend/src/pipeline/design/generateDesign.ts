import { openai } from "../../utils/openai";
import { DesignSchema } from "../../schemas/design.schema";

export async function generateDesign(intent: any) {

  const response = await openai.chat.completions.create({

    model: "gpt-4.1-mini",

    temperature: 0.1,

    messages: [
      {
        role: "system",

        content: `
You are a senior software architect.

Convert application intent into:

- entities
- user flows
- permissions

Return ONLY valid JSON.
`
      },

      {
        role: "user",
        content: JSON.stringify(intent)
      }
    ]
  });

  const text = response.choices?.[0]?.message?.content || "{}";

  const parsed = JSON.parse(text);

  return DesignSchema.parse(parsed);
}
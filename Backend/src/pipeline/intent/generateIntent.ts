import { openai } from "../../utils/openai";
import { IntentSchema } from "../../schemas/intent.schema";

export async function generateIntent(prompt: string) {

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",

    temperature: 0.1,

    messages: [
      {
        role: "system",

        content: `
You are an intent extraction engine.

Return ONLY valid JSON.
`
      },

      {
        role: "user",
        content: prompt
      }
    ]
  });

  const text = response.choices?.[0]?.message?.content || "{}";

  const parsed = JSON.parse(text);

  return IntentSchema.parse(parsed);
}
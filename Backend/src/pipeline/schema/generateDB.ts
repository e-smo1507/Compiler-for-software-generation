import { openai } from "../../utils/openai";

export async function generateDB(design: any) {

  const response = await openai.chat.completions.create({

    model: "gpt-4.1-mini",

    temperature: 0.1,

    messages: [
      {
        role: "system",

        content: `
Generate database schema.

Return ONLY valid JSON.

Example format:

{
  "tables": [
    {
      "name": "users",

      "fields": [
        {
          "name": "email",
          "type": "string"
        }
      ]
    }
  ]
}
`
      },

      {
        role: "user",
        content: JSON.stringify(design)
      }
    ]
  });

  const text = response.choices?.[0]?.message?.content || "{}";

  return JSON.parse(text);
}
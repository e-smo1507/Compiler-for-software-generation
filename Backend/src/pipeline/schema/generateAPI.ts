import { openai } from "../../utils/openai";

export async function generateAPI(design: any) {

  const response = await openai.chat.completions.create({

    model: "gpt-4.1-mini",

    temperature: 0.1,

    messages: [
      {
        role: "system",

       content: `
Generate API schema.

Return ONLY valid JSON.

Example:

{
  "routes": [
    {
      "path": "/users",

      "method": "POST",

      "request": {
        "email": "string",
        "phone": "string"
      }
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
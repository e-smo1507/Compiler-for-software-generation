import { openai } from "../../utils/openai";

export async function repairDB(
  design: any,
  validationErrors: string[]
) {

  const response = await openai.chat.completions.create({

    model: "gpt-4.1-mini",

    temperature: 0.1,

    messages: [

      {
        role: "system",

        content: `
You are a database schema repair engine.

Your task:
Fix database schema inconsistencies.

Return ONLY valid JSON.

Example:

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

        content: `
Design:

${JSON.stringify(design, null, 2)}

Validation Errors:

${JSON.stringify(validationErrors, null, 2)}

Repair the DB schema.
`
      }

    ]

  });

  const text =
    response.choices?.[0]?.message?.content || "{}";

  return JSON.parse(text);

}
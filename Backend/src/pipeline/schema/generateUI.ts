import { openai } from "../../utils/openai";

export async function generateUI(
  design: any
) {

  const response =
    await openai.chat.completions.create({

      model: "gpt-4.1-mini",

      temperature: 0.1,

      messages: [

        {
          role: "system",

          content: `
Generate UI schema.

Return ONLY valid JSON.

Example:

{
  "pages": [
    {
      "name": "Dashboard",

      "components": [
        {
          "type": "StatsCard",

          "props": {
            "title": "Revenue"
          }
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

  const text =
    response.choices?.[0]?.message?.content || "{}";

  return JSON.parse(text);

}
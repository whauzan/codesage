import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { question } = await req.json();

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a knowledgable assistant that provides quality information.",
          },
          {
            role: "user",
            content: `Tell me ${question}`,
          },
        ],
      }),
    });

    const responseData = await resp.json();

    const reply = responseData.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};

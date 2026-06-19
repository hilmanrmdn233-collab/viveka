import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const {
  text,
  mode,
  phase = "initial",
  answers = [],
} = await req.json();
const isAmbiguous =
  phase === "initial" &&
  (
    text.trim().length < 80 ||
    text.split(" ").length < 15 ||
    [
      "galau",
      "bingung",
      "gimana ya",
      "entahlah",
      "mau ngapain",
      "bantu",
    ].some((word) =>
      text.toLowerCase().includes(word)
    )
  );

  if (isAmbiguous) {
  const questionResponse =
    await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: `
Anda adalah Viveka.

Pengguna memberikan informasi yang belum cukup jelas.

Buat TEPAT 3 pertanyaan klarifikasi paling penting.

Kembalikan HANYA JSON valid:

{
  "questions": [
    "...",
    "...",
    "..."
  ]
}

Input:
${text}
`,
    });

  try {
    const parsed =
      JSON.parse(
        questionResponse.text || ""
      );

    return Response.json(parsed);
  } catch {
    return Response.json({
      questions: [
  "Kalau disederhanain, sebenarnya apa yang lagi bikin kepikiran banget?",
  "Apa yang udah lo coba atau pertimbangin sejauh ini?",
  "Kalau masalah ini beres, hasil ideal yang lo harapkan kayak gimana?",
],
    });
  }
}
   let modePrompt = "";

if (mode === "reality") {
  modePrompt = `
MODE: Reality Check

Fokus:
- Bedakan fakta vs asumsi.
- Cari blind spot.
- Identifikasi risiko utama.

Format:

APA YANG SEBENARNYA TERJADI?:
...

REALITANYA:
...

YANG PERLU DIPIKIRIN:
• ...
• ...

COBA MULAI DARI SINI:
...
`;
}

else if (mode === "decision") {
  modePrompt = `
MODE: What Am I Missing?

Fokus:
- Cari sudut pandang yang terlewat.
- Hal yang belum dipertimbangkan.

Format:

YANG MUNGKIN KELEWAT:
...

SUDUT PANDANG LAIN:
...

HAL YANG PERLU DICARI TAHU:
...

LANGKAH SELANJUTNYA:
...
`;
}

else if (mode === "idea") {
  modePrompt = `
MODE: Pressure Test

Fokus:
- Cari alasan ide bisa gagal.
- Uji asumsi.

Format:

ASUMSI UTAMA:
...

KENAPA INI BISA GAGAL:
...

SKENARIO TERBURUK:
...

CARA VALIDASI CEPAT:
...
`;
}

const prompt = `
Kamu adalah Viveka.

Kepribadian:
- Teman pintar yang jujur.
- Santai seperti Gen Z Indonesia.
- Tidak menghakimi.
- Tidak terlalu formal.
- Berani menunjukkan blind spot.
- Jangan terlalu mendukung atau terlalu negatif.

${modePrompt}

${
  phase === "final"
    ? `
Pengguna telah menjawab pertanyaan klarifikasi.

Jawaban:
${answers.join("\n")}
`
    : ""
}

Aturan:
- Maksimal 180 kata.
- Bahasa Indonesia santai.
- Jangan bertanya lagi.
`;


    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${prompt}\n\nInput pengguna:\n${text}`,
    });
console.log("Gemini Response:", response.text);
    try {
  const parsed = JSON.parse(response.text || "");

  return Response.json(parsed);
} catch {
  return Response.json({
    result: response.text,
  });
}
 } catch (error) {
  console.error("API ERROR:", error);

  const message = String(error);

if (message.includes("429")) {
  return Response.json(
    {
      error:
        "Viveka sedang mencapai batas penggunaan. Silakan coba lagi beberapa saat atau besok.",
    },
    { status: 429 }
  );
}

return Response.json(
  {
    error: "Viveka lagi rame dipakai. Coba lagi beberapa menit lagi ya",
  },
  { status: 500 }
);
}
}
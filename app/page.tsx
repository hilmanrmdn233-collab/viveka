"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [mode, setMode] = useState("reality");

  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>((["", "", ""]));

  const [step, setStep] = useState<
    "input" | "questions" | "result"
  >("input");

  const [thinkingText, setThinkingText] = useState(
  "🧠 Lagi mikir..."
);

const modeConfig = {
  reality: {
    example:
      "Gue pengen resign tapi masih takut keputusan ini salah.",

    placeholder:
      "Apa yang sebenarnya terjadi? Apa yang mungkin cuma asumsi gue?",
  },

  decision: {
    example:
      "Gue pengen pindah kerja. Apa yang mungkin belum gue pertimbangin?",

    placeholder:
      "Keputusan apa yang sedang lo ambil dan apa yang takut kelewat?",
  },

  idea: {
    example:
      "Gue mau bikin platform edukasi AI buat Gen Z. Seberapa realistis?",

    placeholder:
      "Tulis ide yang ingin diuji sebelum menghabiskan waktu atau uang.",
  },
};

const thinkingMessages = [
  "🧠 Lagi ngurai inti masalah...",
  "🔍 Nyari blind spot...",
  "⚖️ Lagi nimbang kemungkinan...",
  "💭 Mencoba melihat dari sudut lain...",
];
const modeLabels = {
  reality: "Reality Check",
  decision: "Missing Check",
  idea: "Pressure Test",
};

const buttonLabels = {
  reality: "Kasih Gue Reality Check",
  decision: "Apa yang Gue Lewatin?",
  idea: "Tes Ide Gue",
};

const clarificationTitles = {
  reality:
    "Biar gue ngerti situasinya lebih jelas.",

  decision:
    "Biar kita tahu apa yang mungkin kelewat.",

  idea:
    "Sebelum idenya diuji, gue perlu sedikit konteks.",
};
 const handleAnalyze = async () => {
  if (!text.trim()) return;

  setThinkingText(
    thinkingMessages[
      Math.floor(
        Math.random() *
        thinkingMessages.length
      )
    ]
  );
  const handleCopy = async () => {
  await navigator.clipboard.writeText(result);

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
};
<button
  onClick={handleCopy}
  className="border px-5 py-2 rounded-xl"
>
  {copied ? "✓ Tersalin" : "Copy Insight"}
</button>

const buttonLabel = {
  reality: "Kasih Gue Reality Check",
  decision: "Apa Yang Gue Lewatin?",
  idea: "Tes Ide Ini",
};
{loading
  ? thinkingText
  : buttonLabel[
      mode as keyof typeof buttonLabel
    ]}

  setLoading(true);
  setResult("");
  setQuestions([]);
    
    try {
      const response = await fetch("/api/clarify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          mode,
        }),
      });

      const data = await response.json();

      if (data.questions) {
        setQuestions(data.questions);
        setAnswers(
          Array(data.questions.length).fill("")
        );
        setStep("questions");
      } else {
        setResult(
          data.result ||
          data.error ||
          "Tidak ada hasil."
        );

        setStep("result");
      }
    } catch {
      setResult(
        "Terjadi kesalahan. Silakan coba lagi."
      );

      setStep("result");
    }

    setLoading(false);
  };

  const handleFinalInsight = async () => {
    setThinkingText(
  thinkingMessages[
    Math.floor(
      Math.random() *
      thinkingMessages.length
    )
  ]
);
setLoading(true);

    try {
      const response = await fetch(
        "/api/clarify",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            text,
            mode,
            phase: "final",
            answers,
          }),
        }
      );

      const data = await response.json();

      setResult(
        data.result ||
        data.error ||
        "Tidak ada hasil."
      );

      setStep("result");
    } catch {
      setResult(
        "Terjadi kesalahan."
      );

      setStep("result");
    }

    setLoading(false);
  };

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(
        result
      );

      alert("Hasil berhasil disalin!");
    } catch {
      alert("Gagal menyalin.");
    }
  };

  const handleReset = () => {
    setText("");
    setResult("");
    setQuestions([]);
    setAnswers(["", "", ""]);
    setStep("input");
  };

  return (
    <main className="min-h-screen px-6 py-12 flex items-center justify-center">
     <div className="fixed inset-0 -z-10 overflow-hidden">

  <div className="absolute top-10 left-10 w-72 h-72 bg-violet-300/20 rounded-full blur-3xl animate-pulse" />

  <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" />

  <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl animate-pulse" />

</div>
      <div className="w-full max-w-4xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">

        
          {step === "input" && (

  <div className="mb-10">

    <h1 className="text-4xl md:text-6xl font-bold mb-3">
      Viveka
    </h1>

    <p className="text-xl text-slate-600 dark:text-slate-300">
      Turn ideas into decisions.
      Reduce uncertainty.
    </p>

  </div>

)}

        {step === "input" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

              {[
                { key: "reality",
                 label: "Reality Check",
                  desc: "Lihat fakta, asumsi, dan blind spot.",
},
              {
    key: "decision",
    label: "What Am I Missing?",
    desc: "Cari sudut pandang yang mungkin kelewat.",
  },

  {
    key: "idea",
    label: "Pressure Test",
    desc: "Uji ide dengan mencari titik lemahnya.",
  },
              ].map((item) => (
                <button
  key={item.key}
  onClick={() => setMode(item.key)}
  className={`
  text-left
  rounded-2xl
  p-5
  min-h-[130px]
  flex
  flex-col
  justify-center
  transition-all
  border
    ${
      mode === item.key
        ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-lg"
        : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
    }
  `}
>

<div className="font-bold text-lg">
  {item.label}
</div>

<div
  className={`text-sm mt-3 leading-relaxed ${
    mode === item.key
      ? "text-white/80"
      : "text-slate-500"
  }`}
>
  {item.desc}
</div>

</button>
              ))}

            </div>

    {step === "input" && !text && (
  <div className="mb-6">

    <p className="text-sm text-slate-500 mb-2">
      Contoh:
    </p>

    <button
      onClick={() =>
        setText(
          modeConfig[
            mode as keyof typeof modeConfig
          ].example
        )
      }
      className="
        w-full
        text-left
        border
        rounded-xl
        p-4
        hover:bg-slate-50
        dark:hover:bg-slate-800
        transition
      "
    >
      {
        modeConfig[
          mode as keyof typeof modeConfig
        ].example
      }
    </button>

  </div>
)}

            <textarea
              rows={7}
              value={text}
              onChange={(e) =>
                setText(e.target.value)
              }
              placeholder={
  modeConfig[
    mode as keyof typeof modeConfig
  ].placeholder
}
              className="
                w-full
                bg-white/70
                dark:bg-slate-800/60
                border
                border-slate-200
                dark:border-slate-700
                rounded-2xl
                p-5
                mb-6
                outline-none
                focus:ring-4
                focus:ring-indigo-200
                transition
              "
            />

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="
                bg-gradient-to-r
                from-indigo-500
                to-violet-600
                text-white
                px-8
                py-3
                rounded-2xl
                shadow-lg
                hover:scale-105
                transition
                disabled:opacity-50
              "
            >
              {loading
                ? thinkingText
                : "Let's Think"}
            </button>
          </>
        )}
        
<div className="flex items-center justify-center gap-3 mb-6 text-sm">

  <div className={`flex items-center gap-2 ${
    step === "input"
      ? "text-indigo-600 font-semibold"
      : "text-slate-400"
  }`}>
    <div className="w-7 h-7 rounded-full border flex items-center justify-center">
      1
    </div>
    Cerita
  </div>

  <div className="w-10 h-px bg-slate-300" />

  <div className={`flex items-center gap-2 ${
    step === "questions"
      ? "text-indigo-600 font-semibold"
      : "text-slate-400"
  }`}>
    <div className="w-8 h-8 rounded-full border flex items-center justify-center">
      2
    </div>
    Klarifikasi
  </div>

  <div className="w-10 h-px bg-slate-300" />

  <div className={`flex items-center gap-2 ${
  step === "result"
    ? "text-indigo-600 font-semibold"
    : "text-slate-400"
}`}>
  <div className="w-8 h-8 rounded-full border flex items-center justify-center">
    3
  </div>

  {
    modeLabels[
      mode as keyof typeof modeLabels
    ]
  }
</div>

</div>
        {step === "questions" && (
          <div className="space-y-6">

            <h2 className="text-2xl font-semibold">
  {
    clarificationTitles[
      mode as keyof typeof clarificationTitles
    ]
  }
</h2>

            <p className="text-slate-500">
              Jawab singkat aja. Semakin jelas konteksnya, semakin berguna insight-nya.
            </p>

            {questions.map(
              (question, index) => (
                <div key={index}>
                  <div className="flex gap-3 mb-2">
  <div className="
    w-8 h-8
    rounded-full
    bg-indigo-500
    text-white
    flex items-center justify-center
    text-sm font-bold
  ">
    {index + 1}
  </div>

  <p className="font-medium flex-1">
    {question}
  </p>
</div>

{loading && (
  <div className="
    mt-6
    flex items-center gap-3
    bg-indigo-50
    dark:bg-slate-800
    p-4 rounded-xl
  ">
    <div className="
      w-3 h-3
      bg-indigo-500
      rounded-full
      animate-pulse
    " />

    <p>
      {thinkingText}
    </p>
  </div>
)}

                  <textarea
                    rows={3}
                    value={answers[index]}
                    onChange={(e) => {
                      const updated = [
                        ...answers,
                      ];

                      updated[index] =
                        e.target.value;

                      setAnswers(
                        updated
                      );
                    }}
                    className="
                      w-full
                      border
                      border-slate-200
                      rounded-xl
                      p-4
                      outline-none
                      focus:ring-4
                      focus:ring-indigo-200
                    "
                  />
                </div>
              )
            )}

            <div className="flex gap-3">

              <button
                onClick={
                  handleFinalInsight
                }
                disabled={
                  loading ||
                  answers.some(
                    (answer) =>
                      !answer.trim()
                  )
                }
                className="
                  bg-gradient-to-r
                  from-indigo-500
                  to-violet-600
                  text-white
                  px-6
                  py-3
                  rounded-xl
                  disabled:opacity-50
                "
              >
                {loading
  ? thinkingText
  : buttonLabels[
      mode as keyof typeof buttonLabels
    ]}
              </button>

              <button
                onClick={handleReset}
                className="
                  border
                  px-6
                  py-3
                  rounded-xl
                "
              >
                Start Over
              </button>

            </div>

          </div>
        )}

        {step === "result" &&
          result && (
            <div
              className="
                mt-8
                bg-white/70
                dark:bg-slate-800/60
                backdrop-blur-lg
                border
                border-slate-200
                dark:border-slate-700
                rounded-2xl
                p-6
                shadow-lg
              "
            >
              <h2 className="text-3xl font-bold text-center mb-8">
  {
    mode === "reality"
      ? "Reality Check"
      : mode === "decision"
      ? "What Am I Missing?"
      : "Pressure Test"
  }
</h2>

<div className="space-y-5">

  {result
    .replace(/\*\*/g, "")
    .split("\n\n")
    .map((block, index) => {

      const lines = block.split("\n");

      const title = lines[0];
      const content = lines.slice(1).join(" ");

      let colorClass =
        "border-slate-500 bg-slate-800/40";

      if (
        title.includes(
          "APA YANG SEBENARNYA TERJADI"
        )
      ) {
        colorClass =
          "border-blue-500 bg-blue-500/10";
      }

      if (
        title.includes(
          "REALITANYA"
        )
      ) {
        colorClass =
          "border-yellow-500 bg-yellow-500/10";
      }

      if (
        title.includes(
          "YANG PERLU DIPIKIRIN"
        )
      ) {
        colorClass =
          "border-red-500 bg-red-500/10";
      }

      if (
        title.includes(
          "COBA MULAI DARI SINI"
        )
      ) {
        colorClass =
          "border-green-500 bg-green-500/10";
      }

      if (
        title.includes(
          "YANG MUNGKIN KELEWAT"
        )
      ) {
        colorClass =
          "border-blue-500 bg-blue-500/10";
      }

      if (
        title.includes(
          "SUDUT PANDANG LAIN"
        )
      ) {
        colorClass =
          "border-yellow-500 bg-yellow-500/10";
      }

      if (
        title.includes(
          "HAL YANG PERLU DICARI TAHU"
        )
      ) {
        colorClass =
          "border-red-500 bg-red-500/10";
      }

      if (
        title.includes(
          "LANGKAH SELANJUTNYA"
        )
      ) {
        colorClass =
          "border-green-500 bg-green-500/10";
      }

      if (
        title.includes(
          "ASUMSI UTAMA"
        )
      ) {
        colorClass =
          "border-blue-500 bg-blue-500/10";
      }

      if (
        title.includes(
          "KENAPA INI BISA GAGAL"
        )
      ) {
        colorClass =
          "border-yellow-500 bg-yellow-500/10";
      }

      if (
        title.includes(
          "SKENARIO TERBURUK"
        )
      ) {
        colorClass =
          "border-red-500 bg-red-500/10";
      }

      if (
        title.includes(
          "CARA VALIDASI CEPAT"
        )
      ) {
        colorClass =
          "border-green-500 bg-green-500/10";
      }

      return (
        <div
          key={index}
          className={`
            border-l-4
            rounded-2xl
            p-5
            ${colorClass}
          `}
        >
          <h3 className="font-bold mb-2">
            {title}
          </h3>

          <p className="leading-relaxed">
            {content}
          </p>
        </div>
      );
    })}
</div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">

                <button
                  onClick={handleCopy}
                  className="
                    border
                    px-5
                    py-2
                    rounded-xl
                  "
                >
                  Copy Result
                </button>

                <button
                  onClick={handleReset}
                  className="
                    border
                    px-5
                    py-2
                    rounded-xl
                  "
                >
Pikirin Hal Lain                </button>

              </div>
            </div>
          )}

      </div>
    </main>
  );
}
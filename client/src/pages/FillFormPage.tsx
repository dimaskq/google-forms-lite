import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetFormQuery,
  useSubmitResponseMutation,
} from "../services/formsApi";

function FillFormPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetFormQuery({ id: id! });
  const [submitResponse] = useSubmitResponseMutation();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    score: number;
    maxScore: number;
  } | null>(null);
  const [unanswered, setUnanswered] = useState<string[]>([]);
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  if (isLoading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const current = prev[questionId]?.split(",") || [];
      if (current.includes(value)) {
        return {
          ...prev,
          [questionId]: current.filter((v) => v !== value).join(","),
        };
      } else {
        return {
          ...prev,
          [questionId]: [...current, value].join(","),
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missing =
      data?.form?.questions
        ?.filter((q: any) => !answers[q.id] || answers[q.id].trim() === "")
        .map((q: any) => q.id) || [];

    if (missing.length > 0) {
      setUnanswered(missing);

      // scroll
      const firstId = missing[0];
      const el = questionRefs.current[firstId];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    try {
      const res = await submitResponse({
        formId: id!,
        answers: Object.entries(answers).map(([questionId, value]) => ({
          questionId,
          value,
        })),
      }).unwrap();

      if (data?.form?.showScore) {
        setResult({ score: res.score, maxScore: res.maxScore });
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Failed to submit response:", err);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Test Completed 🎉
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Your score:{" "}
            <span className="font-bold text-purple-600 text-xl">
              {result.score} / {result.maxScore}
            </span>
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          {data?.form?.title}
        </h1>
        <p className="text-gray-600 mb-6">{data?.form?.description}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {data?.form?.questions?.map((q: any) => (
            <div
              key={q.id}
              ref={(el) => {
                questionRefs.current[q.id] = el;
              }}
              className={`bg-white border rounded-xl shadow-sm p-5 ${
                unanswered.includes(q.id) ? "border-red-500" : "border-gray-200"
              }`}
            >
              <label className="block text-lg font-medium text-gray-800 mb-3">
                {q.text}
              </label>

              {q.type === "TEXT" && (
                <input
                  type="text"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  className="w-full border-b border-gray-300 focus:border-purple-600 outline-none py-2 text-gray-700"
                />
              )}

              {q.type === "DATE" && (
                <input
                  type="date"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  className="border rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              )}

              {q.type === "RADIO" && (
                <div className="space-y-2">
                  {q.options?.map((opt: string, idx: number) => (
                    <label
                      key={idx}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {q.type === "CHECKBOX" && (
                <div className="space-y-2">
                  {q.options?.map((opt: string, idx: number) => (
                    <label
                      key={idx}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <input
                        type="checkbox"
                        value={opt}
                        checked={
                          answers[q.id]?.split(",").includes(opt) || false
                        }
                        onChange={() => handleCheckboxChange(q.id, opt)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FillFormPage;

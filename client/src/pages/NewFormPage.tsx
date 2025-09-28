import { useState } from "react";
import { useCreateFormMutation } from "../services/formsApi";
import { useNavigate } from "react-router-dom";

function NewFormPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [createForm] = useCreateFormMutation();
  const navigate = useNavigate();

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", type: "TEXT", options: [], correctAnswer: "", points: 0 },
    ]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const addOption = (index: number) => {
    const updated = [...questions];
    updated[index].options.push("");
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createForm({ title, description, questions }).unwrap();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-8"
      >
        {/* Заголовок */}
        <div className="border-b pb-4">
          <input
            type="text"
            placeholder="Form title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-semibold text-gray-800 placeholder-gray-400 focus:outline-none"
          />
          <textarea
            placeholder="Form description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-2 text-gray-600 placeholder-gray-400 focus:outline-none resize-none"
          />
        </div>

        {/* Питання */}
        <div className="space-y-6">
          {questions.map((q, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 relative"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-purple-600 rounded-l-xl"></div>

              <input
                type="text"
                placeholder="Question"
                value={q.text}
                onChange={(e) => updateQuestion(i, "text", e.target.value)}
                className="w-full text-lg font-medium text-gray-800 placeholder-gray-400 border-b border-gray-200 focus:border-purple-600 outline-none"
              />

              <select
                value={q.type}
                onChange={(e) => updateQuestion(i, "type", e.target.value)}
                className="mt-3 border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="TEXT">Text</option>
                <option value="RADIO">Radio</option>
                <option value="CHECKBOX">Checkbox</option>
                <option value="DATE">Date</option>
              </select>

              {(q.type === "RADIO" || q.type === "CHECKBOX") && (
                <div className="mt-4 space-y-2">
                  {q.options.map((opt: string, j: number) => (
                    <input
                      key={j}
                      type="text"
                      placeholder={`Option ${j + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[i].options[j] = e.target.value;
                        setQuestions(updated);
                      }}
                      className="w-full text-sm border-b border-gray-200 focus:border-purple-600 outline-none py-1"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(i)}
                    className="text-sm text-purple-600 hover:underline"
                  >
                    ➕ Add option
                  </button>
                </div>
              )}

              {/* Optional */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Correct answer (optional)"
                  value={q.correctAnswer || ""}
                  onChange={(e) =>
                    updateQuestion(i, "correctAnswer", e.target.value)
                  }
                  className="border-b border-gray-200 focus:border-purple-600 outline-none text-sm py-1"
                />
                <input
                  type="number"
                  placeholder="Points (optional)"
                  value={q.points || ""}
                  onChange={(e) =>
                    updateQuestion(i, "points", parseInt(e.target.value) || 0)
                  }
                  className="border-b border-gray-200 focus:border-purple-600 outline-none text-sm py-1"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Кнопки */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={addQuestion}
            className="px-5 py-2 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50 transition font-medium"
          >
            Add question
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition font-medium"
          >
            Save form
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewFormPage;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetFormQuery, useUpdateFormMutation } from "../services/formsApi";

type Question = {
  id: string;
  text: string;
  type: "TEXT" | "RADIO" | "CHECKBOX" | "DATE";
  options?: string[];
  correctAnswer?: string;
  points?: number;
};

function EditFormPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetFormQuery({ id: id! });
  const [updateForm] = useUpdateFormMutation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (data?.form) {
      setTitle(data.form.title);
      setDescription(data.form.description || "");
      setQuestions(data.form.questions || []);
    }
  }, [data]);

  const updateQuestion = (qid: string, field: keyof Question, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === qid ? { ...q, [field]: value } : q))
    );
  };

  const addOption = (qid: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === qid ? { ...q, options: [...(q.options || []), ""] } : q
      )
    );
  };

  const updateOption = (qid: string, idx: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: q.options?.map((opt, i) => (i === idx ? value : opt)),
            }
          : q
      )
    );
  };

  const deleteQuestion = (qid: string) => {
    setQuestions(questions.filter((q) => q.id !== qid));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateForm({
      id: id!,
      title,
      description,
      questions: questions.map(({ id, ...q }) => q),
    });
    navigate("/");
  };

  if (isLoading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

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
            required
          />
          <textarea
            placeholder="Form description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-2 text-gray-600 placeholder-gray-400 focus:outline-none resize-none"
          />
        </div>

        {/* Список питань */}
        <div className="space-y-6">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 relative"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-purple-600 rounded-l-xl"></div>

              <input
                type="text"
                placeholder="Question text"
                value={q.text}
                onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                className="w-full text-lg font-medium text-gray-800 placeholder-gray-400 border-b border-gray-200 focus:border-purple-600 outline-none"
              />

              <select
                value={q.type}
                onChange={(e) =>
                  updateQuestion(
                    q.id,
                    "type",
                    e.target.value as Question["type"]
                  )
                }
                className="mt-3 border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="TEXT">Text</option>
                <option value="RADIO">Radio</option>
                <option value="CHECKBOX">Checkbox</option>
                <option value="DATE">Date</option>
              </select>

              {(q.type === "RADIO" || q.type === "CHECKBOX") && (
                <div className="mt-4 space-y-2">
                  {q.options?.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => updateOption(q.id, idx, e.target.value)}
                      className="w-full text-sm border-b border-gray-200 focus:border-purple-600 outline-none py-1"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(q.id)}
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Add option
                  </button>
                </div>
              )}

              {/* Correct + Points */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Correct answer (optional)"
                  value={q.correctAnswer || ""}
                  onChange={(e) =>
                    updateQuestion(q.id, "correctAnswer", e.target.value)
                  }
                  className="border-b border-gray-200 focus:border-purple-600 outline-none text-sm py-1"
                />
                <input
                  type="number"
                  placeholder="Points (optional)"
                  value={q.points || ""}
                  onChange={(e) =>
                    updateQuestion(q.id, "points", Number(e.target.value))
                  }
                  className="border-b border-gray-200 focus:border-purple-600 outline-none text-sm py-1"
                />
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => deleteQuestion(q.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete question
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditFormPage;

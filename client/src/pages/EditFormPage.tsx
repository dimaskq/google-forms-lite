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

  if (isLoading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <h2>Questions</h2>
        {questions.map((q) => (
          <div
            key={q.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "5px",
            }}
          >
            <input
              placeholder="Question text"
              value={q.text}
              onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
            />

            <select
              value={q.type}
              onChange={(e) =>
                updateQuestion(q.id, "type", e.target.value as Question["type"])
              }
            >
              <option value="TEXT">TEXT</option>
              <option value="RADIO">RADIO</option>
              <option value="CHECKBOX">CHECKBOX</option>
              <option value="DATE">DATE</option>
            </select>

            {(q.type === "RADIO" || q.type === "CHECKBOX") && (
              <div>
                <button
                  type="button"
                  onClick={() => addOption(q.id)}
                  style={{ marginTop: "5px" }}
                >
                  Add option
                </button>
                <ul>
                  {q.options?.map((opt, idx) => (
                    <li key={idx}>
                      <input
                        value={opt}
                        onChange={(e) =>
                          updateOption(q.id, idx, e.target.value)
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ marginTop: "10px" }}>
              <input
                placeholder="Correct answer (optional)"
                value={q.correctAnswer || ""}
                onChange={(e) =>
                  updateQuestion(q.id, "correctAnswer", e.target.value)
                }
                style={{ marginRight: "10px" }}
              />
              <input
                type="number"
                placeholder="Points"
                value={q.points || ""}
                onChange={(e) =>
                  updateQuestion(q.id, "points", Number(e.target.value))
                }
                style={{ width: "80px" }}
              />
            </div>

            <button
              type="button"
              onClick={() => deleteQuestion(q.id)}
              style={{ marginTop: "10px", color: "red" }}
            >
              Delete question
            </button>
          </div>
        ))}

        <div style={{ marginTop: "20px" }}>
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
}

export default EditFormPage;

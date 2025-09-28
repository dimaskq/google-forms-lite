import { useState } from "react";
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

  if (isLoading) return <p>Loading...</p>;

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

    await submitResponse({
      formId: id!,
      answers: Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        value,
      })),
    });

    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{data?.form?.title}</h1>
      <p>{data?.form?.description}</p>

      <form onSubmit={handleSubmit}>
        {data?.form?.questions?.map((q: any) => (
          <div key={q.id} style={{ margin: "15px 0" }}>
            <label>
              <strong>{q.text}</strong>
            </label>

            {q.type === "TEXT" && (
              <input
                type="text"
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
            )}

            {q.type === "DATE" && (
              <input
                type="date"
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
            )}

            {q.type === "RADIO" &&
              q.options?.map((opt: string, idx: number) => (
                <div key={idx}>
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                  />
                  {opt}
                </div>
              ))}

            {q.type === "CHECKBOX" &&
              q.options?.map((opt: string, idx: number) => (
                <div key={idx}>
                  <input
                    type="checkbox"
                    value={opt}
                    checked={answers[q.id]?.split(",").includes(opt) || false}
                    onChange={() => handleCheckboxChange(q.id, opt)}
                  />
                  {opt}
                </div>
              ))}
          </div>
        ))}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default FillFormPage;

import { useParams } from "react-router-dom";
import { useGetFormQuery, useGetResponsesQuery } from "../services/formsApi";

function ResponsesPage() {
  const { id } = useParams<{ id: string }>();
  const { data: formData } = useGetFormQuery({ id: id! });
  const { data: respData, isLoading } = useGetResponsesQuery({ formId: id! });

  if (isLoading) return <p>Loading...</p>;

  // make a map question id -> text
  const questionMap: Record<string, string> = {};
  formData?.form?.questions?.forEach((q: any) => {
    questionMap[q.id] = q.text;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Responses for {formData?.form?.title}</h1>
      {respData?.responses?.length === 0 && <p>No responses yet.</p>}
      {respData?.responses?.map((r: any) => (
        <div
          key={r.id}
          style={{
            border: "1px solid #ccc",
            margin: "10px 0",
            padding: "10px",
          }}
        >
          <p>
            <strong>Response #{r.id}</strong> — Score:{" "}
            <strong>{r.score ?? 0}</strong>
          </p>
          <ul>
            {r.answers.map((a: any, idx: number) => (
              <li key={idx}>
                {questionMap[a.questionId] || a.questionId}:{" "}
                <strong>{a.value}</strong>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ResponsesPage;

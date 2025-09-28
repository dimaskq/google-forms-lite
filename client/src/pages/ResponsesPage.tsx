import { useParams } from "react-router-dom";
import { useGetFormQuery, useGetResponsesQuery } from "../services/formsApi";

function ResponsesPage() {
  const { id } = useParams<{ id: string }>();
  const { data: formData } = useGetFormQuery({ id: id! });
  const { data: respData, isLoading } = useGetResponsesQuery({ formId: id! });

  if (isLoading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  // make a map question id -> text
  const questionMap: Record<string, string> = {};
  formData?.form?.questions?.forEach((q: any) => {
    questionMap[q.id] = q.text;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Responses for {formData?.form?.title}
        </h1>
        <p className="text-gray-600 mb-6">
          Total responses: {respData?.responses?.length || 0}
        </p>

        {respData?.responses?.length === 0 && (
          <p className="text-gray-500">No responses yet.</p>
        )}

        <div className="space-y-6">
          {respData?.responses?.map((r: any) => (
            <div
              key={r.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-5"
            >
              <p className="mb-3 text-gray-700">
                <span className="font-medium">Response #{r.id}</span> — Score:{" "}
                <span className="font-medium text-purple-600">
                  {r.score ?? 0}
                </span>
              </p>
              <ul className="space-y-2 text-gray-700">
                {r.answers.map((a: any, idx: number) => (
                  <li key={idx} className="border-b border-gray-100 pb-1">
                    <span className="font-medium">
                      {questionMap[a.questionId] || a.questionId}:
                    </span>{" "}
                    {a.value}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResponsesPage;

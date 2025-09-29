import { useParams } from "react-router-dom";
import { useGetFormQuery, useGetResponsesQuery } from "../services/formsApi";
import Container from "../components/layout/Container";
import PageTitle from "../components/layout/PageTitle";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import ResponseItem from "../components/form/ResponseItem";

function ResponsesPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: formData,
    isLoading: isFormLoading,
    isError: isFormError,
    error: formError,
  } = useGetFormQuery({ id: id! });
  const {
    data: respData,
    isLoading: isRespLoading,
    isError: isRespError,
    error: respError,
  } = useGetResponsesQuery({ formId: id! });

  if (isFormLoading || isRespLoading) return <Loader />;

  if (isFormError)
    return (
      <ErrorMessage
        message={`Failed to load form: ${JSON.stringify(formError)}`}
      />
    );

  if (isRespError)
    return (
      <ErrorMessage
        message={`Failed to load responses: ${JSON.stringify(respError)}`}
      />
    );

  // map question id -> text
  const questionMap: Record<string, string> = {};
  formData?.form?.questions?.forEach((q: any) => {
    questionMap[q.id] = q.text;
  });

  return (
    <Container>
      <PageTitle>Responses for {formData?.form?.title}</PageTitle>
      <p className="text-gray-600 mb-6">
        Total responses: {respData?.responses?.length || 0}
      </p>

      {respData?.responses?.length === 0 && (
        <p className="text-gray-500">No responses yet.</p>
      )}

      <div className="space-y-6">
        {respData?.responses?.map((r: any, idx: number) => (
          <ResponseItem
            key={r.id}
            index={idx}
            answers={r.answers}
            score={r.score}
            maxScore={r.maxScore}
            questionMap={questionMap}
          />
        ))}
      </div>
    </Container>
  );
}

export default ResponsesPage;

import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  useGetFormQuery,
  useSubmitResponseMutation,
} from "../services/formsApi";
import Container from "../components/layout/Container";
import PageTitle from "../components/layout/PageTitle";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import QuestionList from "../components/form/QuestionList";
import ScoreCard from "../components/form/ScoreCard";
import Button from "../components/common/Button";

export default function FillFormPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useGetFormQuery({ id: id! });
  const [submitResponse] = useSubmitResponseMutation();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [unanswered, setUnanswered] = useState<string[]>([]);
  const [result, setResult] = useState<{
    score: number;
    maxScore: number;
  } | null>(null);

  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage message={(error as any)?.message} />;

  const handleChange = (id: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const handleCheckboxChange = (id: string, value: string) => {
    setAnswers((prev) => {
      const current = prev[id]?.split(",") || [];
      return current.includes(value)
        ? { ...prev, [id]: current.filter((v) => v !== value).join(",") }
        : { ...prev, [id]: [...current, value].join(",") };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missing =
      data?.form?.questions
        .filter((q: any) => !answers[q.id])
        .map((q: any) => q.id) || [];

    if (missing.length > 0) {
      setUnanswered(missing);
      const first = missing[0];
      questionRefs.current[first]?.scrollIntoView({ behavior: "smooth" });
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
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  if (result) {
    return (
      <Container>
        <ScoreCard score={result.score} maxScore={result.maxScore} />
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>{data?.form?.title}</PageTitle>
      <p className="text-gray-600 mb-6">{data?.form?.description}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <QuestionList
          questions={data?.form?.questions || []}
          answers={answers}
          onChange={handleChange}
          onCheckboxChange={handleCheckboxChange}
          unanswered={unanswered}
          questionRefs={questionRefs}
        />

        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Container>
  );
}

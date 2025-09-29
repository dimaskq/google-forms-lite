import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetFormQuery, useUpdateFormMutation } from "../services/formsApi";
import Container from "../components/layout/Container";
import PageTitle from "../components/layout/PageTitle";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";
import QuestionEditor from "../components/form/QuestionEditor";
import TextInput from "../components/common/TextInput";
import Textarea from "../components/common/Textarea";

export default function EditFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetFormQuery({ id: id! });
  const [
    updateForm,
    { isLoading: saving, isError: saveError, error: saveErr },
  ] = useUpdateFormMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [showScore, setShowScore] = useState(true);

  useEffect(() => {
    if (data?.form) {
      setTitle(data.form.title || "");
      setDescription(data.form.description || "");
      setQuestions(data.form.questions || []);
      setShowScore(data.form.showScore ?? true);
    }
  }, [data]);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage message={(error as any)?.message} />;

  const addQuestion = () =>
    setQuestions([
      ...questions,
      { id: Date.now().toString(), text: "", type: "TEXT", options: [] },
    ]);

  const updateQuestion = (idx: number, q: any) => {
    const newQs = [...questions];
    newQs[idx] = q;
    setQuestions(newQs);
  };

  const removeQuestion = (idx: number) =>
    setQuestions(questions.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateForm({
        id: id!,
        title,
        description,
        questions: questions.map((q) => ({
          text: q.text,
          type: q.type,
          options: q.options,
          correctAnswer: q.correctAnswer,
          points: q.points,
        })),
        showScore,
      }).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Update form failed:", err);
    }
  };

  return (
    <Container>
      <PageTitle>Edit form</PageTitle>

      {saveError && <ErrorMessage message={(saveErr as any)?.message} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextInput
          label="Form title"
          placeholder="Form title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          label="Description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            checked={showScore}
            onChange={(e) => setShowScore(e.target.checked)}
          />
          Show score after submission
        </label>

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <QuestionEditor
              key={q.id}
              question={q}
              onChange={(updated) => updateQuestion(idx, updated)}
              onRemove={() => removeQuestion(idx)}
            />
          ))}
        </div>

        <Button type="button" variant="secondary" onClick={addQuestion}>
          + Add question
        </Button>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Container>
  );
}

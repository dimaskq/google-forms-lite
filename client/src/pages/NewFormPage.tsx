import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateFormMutation } from "../services/formsApi";
import Button from "../components/common/Button";
import TextInput from "../components/common/TextInput";
import Textarea from "../components/common/Textarea";
import QuestionEditor from "../components/form/QuestionEditor";

export default function NewFormPage() {
  const navigate = useNavigate();
  const [createForm] = useCreateFormMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [showScore, setShowScore] = useState(true);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        type: "TEXT",
        options: [],
        correctAnswer: "",
        points: 0,
      },
    ]);
  };

  const handleUpdateQuestion = (index: number, updated: any) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("The form must have a title");
      return;
    }

    for (let q of questions) {
      if (!q.text.trim()) {
        alert("All questions must have text");
        return;
      }

      if (q.type === "RADIO" || q.type === "CHECKBOX") {
        if (
          !q.options ||
          q.options.length === 0 ||
          q.options.every((opt: string) => !opt.trim())
        ) {
          alert(
            `Question "${
              q.text || "(without a name)"
            }" must have at least one meaningful answer`
          );
          return;
        }
      }
    }

    try {
      await createForm({
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
      console.error("Create form failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Create New Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TextInput
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showScore}
              onChange={(e) => setShowScore(e.target.checked)}
            />
            <span className="text-gray-700">Show score after submit</span>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => (
              <QuestionEditor
                key={idx}
                question={q}
                onChange={(updated) => handleUpdateQuestion(idx, updated)}
                onRemove={() => handleRemoveQuestion(idx)}
              />
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              onClick={handleAddQuestion}
              variant="secondary"
            >
              Add Question
            </Button>

            <Button type="submit">Create Form</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

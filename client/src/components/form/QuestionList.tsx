import FormQuestion from "./FormQuestion";

type Question = {
  id: string;
  text: string;
  type: string;
  options?: string[];
};

type Props = {
  questions: Question[];
  answers: Record<string, string>;
  onChange: (questionId: string, value: string) => void;
  onCheckboxChange: (questionId: string, value: string) => void;
  unanswered?: string[];
  questionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
};

export default function QuestionList({
  questions,
  answers,
  onChange,
  onCheckboxChange,
  unanswered = [],
  questionRefs,
}: Props) {
  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <FormQuestion
          key={q.id}
          ref={(el) => {
            questionRefs.current[q.id] = el;
          }}
          question={q}
          value={answers[q.id] || ""}
          onChange={(val) => onChange(q.id, val)}
          onCheckboxChange={(val) => onCheckboxChange(q.id, val)}
          isUnanswered={unanswered.includes(q.id)}
        />
      ))}
    </div>
  );
}

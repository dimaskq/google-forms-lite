import type { ChangeEvent } from "react";
import OptionEditor from "./OptionEditor";
import Button from "../common/Button";
import TextInput from "../common/TextInput";

type Props = {
  question: any;
  onChange: (updated: any) => void;
  onRemove: () => void;
};

export default function QuestionEditor({
  question,
  onChange,
  onRemove,
}: Props) {
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...question, text: e.target.value });

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) =>
    onChange({ ...question, type: e.target.value, options: [] });

  const handleCorrectAnswerChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...question, correctAnswer: e.target.value });

  const handlePointsChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...question, points: parseInt(e.target.value) || 0 });

  return (
    <div className="border rounded-xl shadow-sm p-5 space-y-4">
      <TextInput
        placeholder="Question text"
        value={question.text}
        onChange={handleTextChange}
      />

      <select
        value={question.type}
        onChange={handleTypeChange}
        className="border rounded-md px-3 py-2"
      >
        <option value="TEXT">Text</option>
        <option value="DATE">Date</option>
        <option value="RADIO">Radio</option>
        <option value="CHECKBOX">Checkbox</option>
      </select>

      {(question.type === "RADIO" || question.type === "CHECKBOX") && (
        <OptionEditor
          options={question.options || []}
          onChange={(opts) => onChange({ ...question, options: opts })}
        />
      )}

      <TextInput
        placeholder="Correct answer"
        value={question.correctAnswer || ""}
        onChange={handleCorrectAnswerChange}
      />

      <TextInput
        type="number"
        placeholder="Points"
        value={question.points || ""}
        onChange={handlePointsChange}
      />

      <div className="flex justify-end">
        <Button type="button" variant="secondary" onClick={onRemove}>
          Remove
        </Button>
      </div>
    </div>
  );
}

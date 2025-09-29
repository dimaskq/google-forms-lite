import { forwardRef } from "react";

type Question = {
  id: string;
  text: string;
  type: string;
  options?: string[];
};

type Props = {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  onCheckboxChange: (value: string) => void;
  isUnanswered?: boolean;
};

const FormQuestion = forwardRef<HTMLDivElement, Props>(
  ({ question, value, onChange, onCheckboxChange, isUnanswered }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white border rounded-xl shadow-sm p-5 ${
          isUnanswered ? "ring-2 ring-red-500" : ""
        }`}
      >
        <label className="block text-lg font-medium text-gray-800 mb-3">
          {question.text}
        </label>

        {question.type === "TEXT" && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border-b border-gray-300 focus:border-purple-600 outline-none py-2 text-gray-700"
          />
        )}

        {question.type === "DATE" && (
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
          />
        )}

        {question.type === "RADIO" && (
          <div className="space-y-2">
            {question.options?.map((opt, idx) => (
              <label
                key={idx}
                className="flex items-center gap-2 text-gray-700"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => onChange(e.target.value)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                {opt}
              </label>
            ))}
          </div>
        )}

        {question.type === "CHECKBOX" && (
          <div className="space-y-2">
            {question.options?.map((opt, idx) => (
              <label
                key={idx}
                className="flex items-center gap-2 text-gray-700"
              >
                <input
                  type="checkbox"
                  value={opt}
                  checked={value.split(",").includes(opt)}
                  onChange={() => onCheckboxChange(opt)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                {opt}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  }
);

export default FormQuestion;

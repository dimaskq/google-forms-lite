type Answer = {
  questionId: string;
  value: string;
};

type Props = {
  index: number;
  answers: Answer[];
  score?: number;
  maxScore?: number;
  questionMap: Record<string, string>;
};

export default function ResponseItem({
  index,
  answers,
  score,
  maxScore,
  questionMap,
}: Props) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-semibold mb-2">
        Response #{index + 1}{" "}
        {score !== undefined && maxScore !== undefined && (
          <span className="text-sm text-gray-600">
            — Score: {score} / {maxScore}
          </span>
        )}
      </h3>
      <ul className="space-y-2">
        {answers.map((a, i) => (
          <li key={i}>
            <strong>{questionMap[a.questionId]}:</strong> {a.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

type Props = { score: number; maxScore: number };

export default function ScoreCard({ score, maxScore }: Props) {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Test Completed 🎉
      </h2>
      <p className="text-lg text-gray-700 mb-6">
        Your score:{" "}
        <span className="font-bold text-purple-600 text-xl">
          {score} / {maxScore}
        </span>
      </p>
      <Button onClick={() => navigate("/")}>Back to Home</Button>
    </div>
  );
}

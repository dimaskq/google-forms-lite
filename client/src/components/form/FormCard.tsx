import { Link } from "react-router-dom";

type Props = {
  form: {
    id: string;
    title: string;
    description?: string;
  };
  onDelete: (args: { id: string }) => void;
};

export default function FormCard({ form, onDelete }: Props) {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
      <h2 className="text-lg font-medium text-gray-900">{form.title}</h2>
      <p className="text-gray-600 text-sm mt-1">{form.description}</p>

      <div className="mt-4 flex gap-6 text-sm">
        <Link
          to={`/forms/${form.id}/fill`}
          className="text-purple-600 hover:underline"
        >
          Fill
        </Link>
        <Link
          to={`/forms/${form.id}/responses`}
          className="text-purple-600 hover:underline"
        >
          Responses
        </Link>
        <Link
          to={`/forms/${form.id}/edit`}
          className="text-purple-600 hover:underline"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete({ id: form.id })}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

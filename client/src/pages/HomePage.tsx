import { Link } from "react-router-dom";
import { useGetFormsQuery, useDeleteFormMutation } from "../services/formsApi";

function HomePage() {
  const { data, isLoading, isError, error } = useGetFormsQuery();
  const [deleteForm, { isError: isDeleteError, error: deleteError }] =
    useDeleteFormMutation();

  if (isLoading) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  if (isError) {
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load forms: {JSON.stringify(error)}
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
          Forms
        </h1>

        {/* Delete error message */}
        {isDeleteError && (
          <p className="text-center text-red-500 mb-4">
            Failed to delete form: {JSON.stringify(deleteError)}
          </p>
        )}

        {data?.forms?.length === 0 && (
          <p className="text-gray-600 text-center">
            No forms yet. Create one to get started.
          </p>
        )}

        {/* form list */}
        <div className="grid gap-4">
          {data?.forms?.map((form: any) => (
            <div
              key={form.id}
              className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-medium text-gray-900">
                {form.title}
              </h2>
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
                  onClick={() => deleteForm({ id: form.id })}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* create btn */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/forms/new"
            className="inline-block px-6 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            Create new form
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

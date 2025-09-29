import { Link } from "react-router-dom";
import { useGetFormsQuery, useDeleteFormMutation } from "../services/formsApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import FormCard from "../components/form/FormCard";
import EmptyState from "../components/common/EmptyState";

function HomePage() {
  const { data, isLoading, isError, error } = useGetFormsQuery();
  const [deleteForm, { isError: isDeleteError, error: deleteError }] =
    useDeleteFormMutation();

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <ErrorMessage
        message={`Failed to load forms: ${JSON.stringify(error)}`}
      />
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
          Forms
        </h1>

        {isDeleteError && (
          <ErrorMessage
            message={`Failed to delete form: ${JSON.stringify(deleteError)}`}
          />
        )}

        {data?.forms?.length === 0 ? (
          <EmptyState message="No forms yet. Create one to get started." />
        ) : (
          <div className="grid gap-4">
            {data?.forms?.map((form: any) => (
              <FormCard key={form.id} form={form} onDelete={deleteForm} />
            ))}
          </div>
        )}

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

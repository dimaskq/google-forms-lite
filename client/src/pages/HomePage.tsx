import { Link } from "react-router-dom";
import { useGetFormsQuery, useDeleteFormMutation } from "../services/formsApi";

function HomePage() {
  const { data, isLoading, refetch } = useGetFormsQuery();
  const [deleteForm] = useDeleteFormMutation();

  if (isLoading) return <p>Loading...</p>;

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      await deleteForm({ id });
      refetch(); // update the list after deletion
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Forms</h1>
      <ul>
        {data?.forms?.map((form: any) => (
          <li key={form.id}>
            <strong>{form.title}</strong> — {form.description}
            {" | "}
            <Link to={`/forms/${form.id}/fill`}>Fill</Link>
            {" | "}
            <Link to={`/forms/${form.id}/responses`}>Responses</Link>
            {" | "}
            <Link to={`/forms/${form.id}/edit`}>✏️ Edit</Link>
            {" | "}
            <button
              onClick={() => handleDelete(form.id)}
              style={{
                color: "red",
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <Link to="/forms/new">Create new form</Link>
    </div>
  );
}

export default HomePage;

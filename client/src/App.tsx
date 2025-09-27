import { useGetFormsQuery, useCreateFormMutation } from "./services/formsApi";

function App() {
  const { data, isLoading } = useGetFormsQuery();
  const [createForm] = useCreateFormMutation();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Google Forms Lite</h1>
      <button
        onClick={() => createForm({ title: "Нова форма", description: "Тест" })}
      >
        Створити форму
      </button>

      <ul>
        {data?.forms?.map((form: any) => (
          <li key={form.id}>
            {form.title} - {form.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

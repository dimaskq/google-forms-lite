import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NewFormPage from "./pages/NewFormPage";
import FillFormPage from "./pages/FillFormPage";
import ResponsesPage from "./pages/ResponsesPage";
import EditFormPage from "./pages/EditFormPage";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "10px", background: "#f5f5f5" }}>
        <Link to="/" style={{ marginRight: "10px" }}>
          Home
        </Link>
        <Link to="/forms/new">Create Form</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forms/new" element={<NewFormPage />} />
        <Route path="/forms/:id/fill" element={<FillFormPage />} />
        <Route path="/forms/:id/responses" element={<ResponsesPage />} />
        <Route path="/forms/:id/edit" element={<EditFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

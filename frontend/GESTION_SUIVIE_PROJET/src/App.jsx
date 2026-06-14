import { Routes, Route } from "react-router-dom";

// Pages test_tast
import TestSupervisor from "../../test_tast/page";
import TestStudent from "../../test_tast/page2";

// Pages générales
import LoginPage from "./pages/LoginPage.jsx";
import Home from "./pages/home";
import Messages from "./pages/messages";
import Students from "./pages/students";
import DatabaseGroups from "./pages/DatabaseGroups";
import Evaluation from "./pages/evaluation";

// Pages professeur
import Professor from "./pages/professor";
import Projects from "./pages/projects";
import ProjectDetails from "./pages/ProjectDetails";
import GroupDetails from "./pages/GroupDetails";
import NewProject from "./pages/newproject";


// Pages étudiant
import Student from "./pages/etudiant/etudiant";
import Kanban from "./pages/etudiant/kanban";
import Livrables from "./pages/etudiant/livrables";
import Notes from "./pages/etudiant/notes";
import Chat from "./pages/etudiant/chat";

export default function App() {
  return (
    <Routes>
      

      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Home />} />

      {/* Routes étudiant */}
      <Route path="/etudiant" element={<Student />} />
      <Route path="/kanban" element={<Kanban />} />
      <Route path="/livrables" element={<Livrables />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/chat" element={<Chat />} />

      {/* Routes professeur / admin */}
      <Route path="/professor" element={<Professor />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/new-project" element={<NewProject />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/students" element={<Students />} />
      <Route path="/evaluation" element={<Evaluation />} />
      <Route path="/database-groups" element={<DatabaseGroups />} />
      <Route
  path="/project-details"
  element={<ProjectDetails />}
/>

<Route
  path="/group-details"
  element={<GroupDetails />}
/>
    </Routes>
  );
}
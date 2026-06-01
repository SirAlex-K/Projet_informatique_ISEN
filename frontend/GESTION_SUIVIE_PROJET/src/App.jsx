import { Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Professor from "./pages/professor";
import Projects from "./pages/projects";
import NewProject from "./pages/newproject";
import Students from "./pages/students";
import Groups from "./pages/groups";
import DatabaseGroups from "./pages/DatabaseGroups";
import Messages from "./pages/messages";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/professor" element={<Professor />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/new-project" element={<NewProject />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/students" element={<Students />} />
      <Route path="/groups" element={<Groups />} />
      <Route
        path="/database-groups"
        element={<DatabaseGroups />}
      />
    </Routes>
  );
}
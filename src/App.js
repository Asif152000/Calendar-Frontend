import { Routes, Route } from "react-router-dom";
import Login from "./Authentication/Login";
import Logout from "./Authentication/Logout";
import CompanyManagement from "./Components/AdminModule/CompanyManagement";
import CommunicationManagement from "./Components/AdminModule/CommunicationManagement";
import Dashboard from "./Components/UserModule/Dashboard";
import Calendar from "./Components/UserModule/Calendar";
import Notification from "./Components/UserModule/Notification";
import UserLogin from "./Authentication/UserLogin";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/companyManagement" element={<CompanyManagement />} />
        <Route path="/communicationManagement" element={<CommunicationManagement />} />
       <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
       <Route path="/notification" element={<Notification />} />
       <Route path="/userLogin" element={<UserLogin />} />
      </Routes>
    </div>
  );
}

export default App;

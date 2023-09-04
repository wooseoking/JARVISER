import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Main from "./pages/Main";
import Reservation from "./pages/Reservation";

function App() {
  return (
    <>
      <div>
        <h1>JARVISER HEADER</h1>
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reservation" element={<Reservation />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

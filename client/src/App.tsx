import {
  Outlet,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;

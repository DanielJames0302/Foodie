import {
  Outlet,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
      <>
        <Navbar />
        <Outlet />
        <ToastContainer/>
      </>
  );
}

export default App;

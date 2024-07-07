import {
  Outlet,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import "./style.scss";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={`theme-light`}>
        <Navbar />
      
        <Outlet />
        <ToastContainer/>
 

  
       
      </div>
      
    </QueryClientProvider>
  );
}

export default App;

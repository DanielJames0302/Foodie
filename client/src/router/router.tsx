import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute
 from "../components/route/ProtectedRoute";
import App from "../App";
import Home from "../pages/home/Home";
import Profile from "../pages/profile/Profile";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Messenger from "../pages/messenger/Messenger";


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/messages",
        element: <Messenger />
      },
     
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

]);

export default router

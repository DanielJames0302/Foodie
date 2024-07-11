import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute
 from "../components/route/ProtectedRoute";
import App from "../App";
import Home from "../pages/home/Home";
import Profile from "../pages/profile/Profile";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Messenger from "../pages/messenger/Messenger";
import ConversationLayout from "../pages/conversation/ConversationLayout";
import Menu from "../pages/menu/Menu";
import Share from "../components/share/Share";
import PostLayout from "../pages/post/PostLayout";


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
        path: "/users_messages",
        element: <Messenger />
      },
      {
        path: "/conversations",
        element: <ConversationLayout />
      },
      {
        path: "/conversations/:conversationId",
        element: <ConversationLayout />
      },
      {
        path: "/menu",
        element: <Menu/>
      },
      {
        path: "/share",
        element: <Share/>
      },
      {
        path: "/post/:postId",
        element: <PostLayout />
      }
     
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

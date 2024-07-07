import { useContext } from "react"
import { AuthContext } from "../../context/authContext"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
  children: React.ReactNode;
}



const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

  const { currentUser } = useContext(AuthContext) 

 

  if (!currentUser) {
    return <Navigate to="/login" />;
  } 

  return <>{children}</>
}

export default ProtectedRoute

import { PropsWithChildren, useContext } from "react"
import { AuthContext } from "../../context/authContext"
import { Navigate, useNavigate } from "react-router-dom"

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

import { useContext } from "react"
import { AuthContext } from "../../context/authContext"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
  children: React.ReactNode;
}



const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

  const { currentUser, isLoading } = useContext(AuthContext) 

 

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  } 

  return <>{children}</>
}

export default ProtectedRoute

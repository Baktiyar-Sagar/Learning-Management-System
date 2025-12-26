import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "./AuthContext"

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext)

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Role-based protection
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute

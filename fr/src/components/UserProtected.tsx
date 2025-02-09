import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const UserProtected = () => {
  const user = useSelector((state) => state.user.user);

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default UserProtected;

import { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
 function navigateToComponent() {
   if (!currentUser) {
     navigate("/login");
     return null;
   }
 }
 useEffect(()=>{
   navigateToComponent()
 },[])

  return <Outlet />
}

export default PrivateRoute;

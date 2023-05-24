import { useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { useAtom } from 'jotai';
import { currentUserAtom } from '../jotai/models';

function PrivateRoute() {
  const [currentUser ] = useAtom(currentUserAtom);
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

import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';



const useConditionalRedirect = (auth, redirectPath) => {
  const navigate = useNavigate();

  function authorized() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  const condition = useMemo(()=>{
    return auth ? authorized() : !authorized()
  },[auth])


  useEffect(() => {
    if (!condition) {
      navigate(redirectPath);
    }
  }, [condition, navigate, redirectPath]);
};

const ProtectedRoute = ({ auth, redirectPath, children }) => {
  useConditionalRedirect(auth, redirectPath);
  return auth ? children : null;
};

export default ProtectedRoute;

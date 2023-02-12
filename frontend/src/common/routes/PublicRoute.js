import React from 'react';
 import { Navigate } from 'react-router-dom';

 function PublicRoute({ authenticated, component: Component }) {
   return (
     authenticated ? <Navigate to='/' {...alert("접근할 수 없는 페이지입니다.")} /> : Component
   )
 }

 export default PublicRoute 
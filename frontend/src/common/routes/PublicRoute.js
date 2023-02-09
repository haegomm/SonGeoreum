import React from 'react';
import { Router, Routes, Route, Navigate } from 'react-router-dom';
import isLogin from './isAuth';

function PublicRoute({
  element: Element,
  restricted,
  ...rest
}) {
  console.log({
    Element,
    restricted,
    ...rest
  })
  // const navigate = useNavigate();
  return (
    <Router>
    <Routes>
    <Route
      {...rest}
      element={
        isLogin() && restricted ? (
          <Navigate to="/" />
        ) : (
          <Element.type />
        )
      }
    />
    </Routes>
    </Router>
  );
}

export default PublicRoute;
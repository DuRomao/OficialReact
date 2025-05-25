import React from "react";
import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { authRoutes } from "./AuthRoutes";
import { classes } from "../Data/Layouts";
import Loader from "../Layout/Loader";
import LayoutRoutes from "../Route/LayoutRoutes";
import Signin from "../Auth/Signin";
import PrivateRoute from "./PrivateRoute";
import LogoutSistema from "../Auth/Logout";

const Routers = () => {
  const [authenticated, setAuthenticated] = useState(false); // <-- CORRETO
  const [isLoading, setIsLoading] = useState(true);
  
  const defaultLayoutObj = classes.find(
    (item) => Object.values(item).pop(1) === "compact-wrapper",
  );
  const layout = localStorage.getItem("layout") || Object.keys(defaultLayoutObj).pop();

  useEffect(() => {
    let abortController = new AbortController();

    // Verificar autenticação inicial
    const checkInitialAuth = () => {
      const token = localStorage.getItem("Token");
      const authStatus = localStorage.getItem("Authenticated");

      if (token && authStatus === "true") {
        setAuthenticated(true);
      } else {
        LogoutSistema();
      };

      setIsLoading(false);
    };

    checkInitialAuth();

    console.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];
    console.disableYellowBox = true;

    return () => {
      abortController.abort();
    };
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <BrowserRouter basename={"/"}>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Rota de login pública */}
          <Route
            path={`${process.env.PUBLIC_URL}/login`}
            element={<Signin />}
          />

          {/* Rotas de autenticação e erro (públicas) */}
          {authRoutes.map(({ path, Component }, i) => (
            <Route path={path} element={Component} key={i} />
          ))}

          {/* Rotas protegidas */}
          <Route path="/" element={<PrivateRoute />}>
            {/* Redirecionamento da raiz para dashboard */}
            <Route
              path="/"
              element={
                <Navigate
                  to={`${process.env.PUBLIC_URL}/dashboard/default/${layout}`}
                  replace
                />
              }
            />
            <Route
              path={`${process.env.PUBLIC_URL}`}
              element={
                <Navigate
                  to={`${process.env.PUBLIC_URL}/dashboard/default/${layout}`}
                  replace
                />
              }
            />

            {/* Todas as rotas internas protegidas */}
            <Route path="/*" element={<LayoutRoutes />} />
          </Route>

          {/* Rota catch-all para páginas não encontradas - redireciona para erro 500 */}
          <Route
            path="*"
            element={
              <Navigate
                to={`${process.env.PUBLIC_URL}/pages/errors/error500/compact`}
                replace
              />
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Routers;

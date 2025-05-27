
import React, { Fragment } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { routes } from "./Routes";
import AppLayout from "../Config/Layout/Layout";

const LayoutRoutes = () => {
  return (
    <>
      <Routes>
        {routes.map(({ path, Component }, i) => (
          <Fragment key={i}>
            <Route element={<AppLayout />}>
              <Route path={path} element={Component} />
            </Route>
          </Fragment>
        ))}
        
        {/* Rota catch-all para rotas internas inválidas */}
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
    </>
  );
};

export default LayoutRoutes;

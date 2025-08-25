import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { authRoutes, publicRoutes } from "./router.link";
import Feature from "../feature";
import AuthFeature from "../authFeature";
import Login from "../auth/login";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { RootState } from "../../core/data/redux/store";
import { all_routes } from "./all_routes";

const ALLRoutes: React.FC = () => {
  const location = useLocation();
  const route = all_routes;
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  // Find the current route in either public or auth routes
  const currentRoute =
    publicRoutes.find((route) => route.path === location.pathname) ||
    authRoutes.find((route) => route.path === location.pathname);

  // Construct the full title
  const fullTitle = currentRoute?.title ? `${currentRoute.title}` : "CRMS";

  if (!isLoggedIn && location.pathname !== route.login) {
    return <Navigate to={route.login} />;
  }

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
      </Helmet>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route element={<Feature />}>
          {publicRoutes.map((route, idx) => (
            <Route path={route.path} element={route.element} key={idx} />
          ))}
        </Route>

        {/* Authenticated Routes */}
        <Route element={<AuthFeature />}>
          {authRoutes.map((route, idx) => (
            <Route path={route.path} element={route.element} key={idx} />
          ))}
        </Route>

        {/* Fallback for unmatched routes */}
        <Route path="*" element={<Navigate to={route.login} />} />
      </Routes>
    </>
  );
};

export default ALLRoutes;

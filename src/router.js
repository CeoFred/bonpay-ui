import { HomePage, NFTPage, TokensPage } from "./routes/index";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import React from "react";

export default function Router() {
  let location = useLocation();

  return (
    <>
      <Routes>
        <Route path="/wallet" element={<HomePage />}></Route>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/nft" element={<NFTPage />}></Route>
        <Route path="/token" element={<TokensPage />}></Route>
      </Routes>
      {location.pathname === "/" && <Navigate replace={true} to="/wallet" />}
    </>
  );
}

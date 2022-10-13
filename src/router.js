import { HomePage, NFTPage, TokensPage, TransferPage } from "./routes/index";
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
        <Route path="/transfer" element={<TransferPage />}></Route>
      </Routes>
      {location.pathname === "/" && <Navigate replace={true} to="/wallet" />}
    </>
  );
}

import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../Components/Header/Header.jsx";
import Footer from "../Components/Footer/footer.jsx";
import Routers from "../routes/router";
import { Toaster } from "react-hot-toast";

const Layout = () => {
  const location = useLocation();
  const hideFooter = ["/login", "/register"].includes(location.pathname);


  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Toaster position="top-right" />
      <Header />
      <div className="flex-grow">
        <Routers />
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
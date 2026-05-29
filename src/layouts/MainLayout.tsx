import Header from "../components/common/Header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/common/Footer";
import { useEffect } from "react";

const HEADER_OFFSET = 64;

const MainLayout = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }

    const scrollToSection = () => {
      const section = document.getElementById(hash.slice(1));
      if (!section) return;

      const top =
        section.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    };

    const scrollTimer = window.setTimeout(scrollToSection, 100);
    return () => window.clearTimeout(scrollTimer);
  }, [hash, pathname]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;

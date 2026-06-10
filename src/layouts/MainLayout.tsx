import Header from "../components/common/Header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/common/Footer";
import { useEffect } from "react";
import { NavigationProvider } from "../providers/NavigationProvider";
import ChatBotWidget from "../components/chatbot/ChatBotWidget";

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

  const showChatWidget =
    pathname === "/" ||
    pathname === "/buy-online" ||
    pathname.startsWith("/buy-online/") ||
    pathname === "/profile";

  return (
    <>
      <NavigationProvider>
        <Header />
        <Outlet />
        <Footer />
        {showChatWidget && <ChatBotWidget />}
      </NavigationProvider>
    </>
  );
};

export default MainLayout;

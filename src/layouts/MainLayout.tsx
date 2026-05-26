import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";
import FullScreenLoader from "../components/common/FullScreenLoader";
import { useAppSelector } from "../hooks/reduxHooks";

const MainLayout = () => {
  const loading = useAppSelector((state) => state.auth.loading);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      {loading && <FullScreenLoader text="Processing..." />}
    </>
  );
};

export default MainLayout;

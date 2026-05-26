import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import Home from "../components/home/Home";
import Categories from "../components/categories/Categories";
import Reservation from "../components/reservation/Reservation";
import AboutUs from "../components/aboutUs/AboutUs";
import Team from "../components/team/Team";
import Faq from "../components/faq/Faq";
import FullScreenLoader from "../components/common/FullScreenLoader";

const MainPage = () => {
  const [startupLoading, setStartupLoading] = useState(true);
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    const t = setTimeout(() => setStartupLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const showStartupOverlay = startupLoading || (token ? !user : false);

  return (
    <div>
      <Home />
      <AboutUs />
      <Categories />
      <Team />
      <Reservation />
      <Faq />
      {showStartupOverlay && <FullScreenLoader text="Loading..." />}
    </div>
  );
};

export default MainPage;

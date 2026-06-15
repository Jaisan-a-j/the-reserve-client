import { useEffect, useState } from "react";
import Home from "../components/home/Home";
import Categories from "../components/categories/Categories";
import Reservation from "../components/reservation/Reservation";
import AboutUs from "../components/aboutUs/AboutUs";
import Team from "../components/team/Team";
import Faq from "../components/faq/Faq";
import FullScreenLoader from "../components/common/FullScreenLoader";
import DisplayReviews from "../components/reviews/DisplayReviews";

const MainPage = () => {
  const [startupLoading, setStartupLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setStartupLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <Home />
      <AboutUs />
      <Categories />
      <Team />
      <Reservation />
      <DisplayReviews />
      <Faq />
      {startupLoading && <FullScreenLoader text="Loading..." />}
    </div>
  );
};

export default MainPage;

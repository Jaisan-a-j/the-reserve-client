import Home from "../components/home/Home";
import Categories from "../components/categories/Categories";
import Reservation from "../components/reservation/Reservation";
import AboutUs from "../components/aboutUs/AboutUs";
import Team from "../components/team/Team";
const MainPage = () => {
  return (
    <div>
      <Home />
      <AboutUs />
      <Categories />
      <Team />
      <Reservation />
    </div>
  );
};

export default MainPage;

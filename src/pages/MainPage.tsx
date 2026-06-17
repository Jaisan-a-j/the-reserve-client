import Home from "../components/home/Home";
import Categories from "../components/categories/Categories";
import Reservation from "../components/reservation/Reservation";
import AboutUs from "../components/aboutUs/AboutUs";
import Team from "../components/team/Team";
import Faq from "../components/faq/Faq";
import DisplayReviews from "../components/reviews/DisplayReviews";

const MainPage = () => {


  return (
    <div>
      <Home />
      <AboutUs />
      <Categories />
      <Team />
      <Reservation />
      <DisplayReviews />
      <Faq />
    </div>
  );
};

export default MainPage;

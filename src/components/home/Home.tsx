import home from "../../assets/home.jpeg";
import Button from "../common/Button";

const Main = () => {
  return (
    <section className="w-full px-6 pt-36 pb-16 bg-[#f8f7fb] overflow-hidden">
      <div className="flex flex-col items-center justify-center sm:mt-[55px]">
        <div className="flex justify-center">
          <div className="border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-600 flex items-center gap-2">
            <span>Serving Food Lovers Since 2016</span>
            <span>❤️</span>
          </div>
        </div>

        <div className="mt-8 text-center xl:w-[60%]">
          <h1 className="text-3xl xl:text-5xl font-bold tracking-tight text-[#2b2d42] leading-tight">
            Savor Every Bite. Savor Every Moment.
          </h1>

          <p className="mt-6 text-gray-600 text-lg leading-8">
            Welcome to a dining experience where flavor, freshness, and
            hospitality come together. Whether it's your first visit or your
            hundredth, every plate is made to impress.
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <Button content="Experience the Flavor →" />
        </div>
      </div>

      <div className="mt-16 xl:mt-28">
        <img
          src={home}
          alt="Restaurant Food"
          className="w-full h-[420px] object-cover rounded-[2rem]"
        />
      </div>
    </section>
  );
};

export default Main;

import { chefs } from "../../constants/chef";

const Team = () => {
  const displayedChefs = chefs.slice(0, 7);

  return (
    <section
      id="team"
      className="py-24 px-6 bg-gradient-to-b from-blue-50 via-white to-blue-50"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-blue-950">
          Get to Know Our Amazing Team
        </h2>

        <p className="mt-6 text-lg md:text-xl text-slate-600 leading-8">
          Meet the Passionate Experts Behind Our Success and Learn More About
          Their Roles.
        </p>
      </div>

      <div className="xl:hidden max-w-7xl mx-auto mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedChefs.map((chef) => (
            <div
              key={chef.id}
              className="
                bg-white
                rounded-3xl
                overflow-hidden
                border border-blue-100
                shadow-lg shadow-blue-100/40
                hover:-translate-y-1
                transition-all
              "
            >
              <img
                src={chef.image}
                alt={chef.name}
                className="w-full h-72 object-cover object-top"
              />

              <div className="p-5">
                <h3 className="text-2xl font-bold text-blue-950">
                  {chef.name}
                </h3>

                <div className="h-px bg-blue-100 my-4"></div>

                <h4 className="text-blue-600 font-semibold text-lg">
                  {chef.role}
                </h4>

                <p className="mt-3 text-slate-600 leading-7">
                  {chef.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden xl:block max-w-[1500px] mx-auto mt-20">
        <div className="grid grid-cols-4 gap-6 items-start">
          {displayedChefs.slice(0, 4).map((chef, index) => {
            const imageHeights = [
              "h-[260px]",
              "h-[420px]",
              "h-[300px]",
              "h-[380px]",
            ];

            const offsets = [
              "mt-12",
              "mt-0",
              "mt-20",
              "mt-6",
            ];

            return (
              <div key={chef.id} className={offsets[index]}>
                <div
                  className="
                    bg-white
                    rounded-3xl
                    overflow-hidden
                    border border-blue-100
                    shadow-lg shadow-blue-100/50
                    hover:-translate-y-2
                    hover:shadow-2xl
                    hover:shadow-blue-200/50
                    transition-all duration-300
                  "
                >
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className={`w-full object-cover object-top ${imageHeights[index]}`}
                  />

                  <div className="p-5">
                    <h3 className="text-2xl font-bold text-blue-950">
                      {chef.name}
                    </h3>

                    <div className="h-px bg-blue-100 my-4"></div>

                    <h4 className="text-blue-600 font-semibold text-lg">
                      {chef.role}
                    </h4>

                    <p className="mt-3 text-slate-600 text-sm leading-7">
                      {chef.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto mt-12 items-start">
          {displayedChefs.slice(4, 7).map((chef, index) => {
            const imageHeights = [
              "h-[360px]",
              "h-[260px]",
              "h-[400px]",
            ];

            const offsets = [
              "mt-0",
              "mt-16",
              "mt-4",
            ];

            return (
              <div key={chef.id} className={offsets[index]}>
                <div
                  className="
                    bg-white
                    rounded-3xl
                    overflow-hidden
                    border border-blue-100
                    shadow-lg shadow-blue-100/50
                    hover:-translate-y-2
                    hover:shadow-2xl
                    hover:shadow-blue-200/50
                    transition-all duration-300
                  "
                >
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className={`w-full object-cover object-top ${imageHeights[index]}`}
                  />

                  <div className="p-5">
                    <h3 className="text-2xl font-bold text-blue-950">
                      {chef.name}
                    </h3>

                    <div className="h-px bg-blue-100 my-4"></div>

                    <h4 className="text-blue-600 font-semibold text-lg">
                      {chef.role}
                    </h4>

                    <p className="mt-3 text-slate-600 text-sm leading-7">
                      {chef.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Team;
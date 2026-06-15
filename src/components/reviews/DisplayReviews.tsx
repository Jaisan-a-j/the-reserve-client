import MarqueeBase from "react-fast-marquee";
import { ChevronRight, Quote, Star } from "lucide-react";
import { useReviews } from "../../hooks/useReviews";
import type { ReviewType } from "../../types";

type MarqueeModule = { default: typeof MarqueeBase };
const Marquee =
  (MarqueeBase as unknown as MarqueeModule).default ?? MarqueeBase;

const DisplayReviews = () => {
  const { data: reviews } = useReviews();


  return (
    <section className="bg-[#f8f6ff] py-16">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <span className="inline-flex items-center rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-[#7f56d9] shadow-sm">
          <ChevronRight size={14} />
          <span className="ml-2">Guest Reviews</span>
        </span>

        <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          What Our <span className="text-[#7f56d9]">Guests</span> Say
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          We take pride in creating memorable dining experiences. Here&apos;s
          what our guests have to say about us.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-6 rounded-[2rem] bg-white px-6 py-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:flex-row sm:px-10">
          <div className="text-center sm:text-left">
            <p className="text-5xl font-bold text-slate-950">4.8</p>
            <div className="mt-2 flex items-center justify-center gap-1 text-[#7f56d9] sm:justify-start">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  size={18}
                  fill="#7f56d9"
                  stroke="#7f56d9"
                  strokeWidth={1.5}
                />
              ))}
              <span className="text-sm font-medium text-slate-500">
                Based on 256+ reviews
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-3xl bg-[#f4f0ff] px-4 py-3 text-sm font-semibold text-[#4f46e5] shadow-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg">
              ❤
            </span>
            Loved by food lovers across the city!
          </div>
        </div>
      </div>

      <div className="mt-12 overflow-hidden">
        <Marquee speed={30} gradient={false} pauseOnHover={false}>
          {(reviews?.length ?? 0) === 0 ? (
            <div className="mr-6 w-[320px] rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-lg">
              <p className="text-sm font-semibold text-slate-500">
                No reviews available.
              </p>
            </div>
          ) : (
           reviews.map((review: ReviewType) => (
              <div
                key={review._id}
                className="mr-6 w-[320px] rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eef2ff] text-sm font-semibold text-[#5b21b6]">
                      {review.userName
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-950">
                        {review.userName}
                      </h3>
                    </div>
                  </div>
                  <Quote className="h-7 w-7 text-[#c4b5fd]" />
                </div>

                <div className="mb-4 flex gap-1 text-[#f5b301]">
                  {Array.from({ length: 5 }, (_, starIndex) => (
                    <Star
                      key={starIndex}
                      size={16}
                      fill={
                        starIndex < review.rating ? "#f5b301" : "transparent"
                      }
                      stroke="#f5b301"
                      strokeWidth={1.5}
                    />
                  ))}
                </div>

                <p className="mb-5 text-sm leading-6 text-slate-700">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </Marquee>
      </div>
    </section>
  );
};

export default DisplayReviews;

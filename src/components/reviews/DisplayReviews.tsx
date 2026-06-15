import { useMemo } from "react";
import { Star } from "lucide-react";
import { useReviews } from "../../hooks/useReviews";
import type { ReviewType } from "../../types";

const fakeNames = [
  "Olivia",
  "Ethan",
  "Sophia",
  "Liam",
  "Ava",
  "Noah",
  "Isabella",
  "Mason",
  "Mia",
  "Lucas",
];

const DisplayReviews = () => {
  const { data: reviews, isLoading, isError } = useReviews();

  const reviewCards = useMemo(() => {
    if (!reviews) return [];

    return reviews.slice(0, 6).map((review: ReviewType, index) => ({
      ...review,
      displayName: fakeNames[index % fakeNames.length],
    }));
  }, [reviews]);

  if (isLoading) {
    return <div className="review-list">Loading reviews...</div>;
  }

  if (isError) {
    return <div className="review-list">Unable to load reviews.</div>;
  }

  return (
    <section className="review-list px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">Customer Reviews</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviewCards.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              No reviews yet.
            </div>
          ) : (
            reviewCards.map((review) => (
              <div
                key={review._id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {review.displayName}
                    </h3>
                    <p className="text-sm text-gray-500">Customer</p>
                  </div>
                  <div className="flex items-center gap-1 text-[#f5b301]">
                    {Array.from({ length: 5 }, (_, starIndex) => (
                      <Star
                        key={starIndex}
                        size={18}
                        fill={
                          starIndex < review.rating ? "#f5b301" : "transparent"
                        }
                        stroke="#f5b301"
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm leading-6 text-gray-700">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default DisplayReviews;

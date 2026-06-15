import { useState } from "react";
import { Star } from "lucide-react";
import "./Checkout.scss";

interface UserReviewProps {
  reviewRating: number;
  onRatingChange: (rating: number) => void;
  reviewText: string;
  onReviewTextChange: (text: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting?: boolean;
  errorMessage?: string;
  successMessage?: string;
  ratingError?: string;
  commentError?: string;
}

const UserReview = ({
  reviewRating,
  onRatingChange,
  reviewText,
  onReviewTextChange,
  onSubmit,
  isSubmitting = false,
  errorMessage = "",
  successMessage = "",
  ratingError = "",
  commentError = "",
}: UserReviewProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <form
      className="checkout-review"
      onSubmit={onSubmit}
      aria-label="Order feedback"
    >
      <div className="checkout-review__header">
        <h2>How was your experience?</h2>
        <p>We&apos;d love to hear your feedback.</p>
      </div>

      {errorMessage ? (
        <p className="checkout-review__feedback checkout-review__feedback--error">
          {errorMessage}
        </p>
      ) : null}

      {successMessage && !ratingError && !commentError ? (
        <p className="checkout-review__feedback checkout-review__feedback--success">
          {successMessage}
        </p>
      ) : null}

      <div className="checkout-review__field">
        <span className="checkout-review__label">Your rating</span>
        <div
          className="checkout-review__stars"
          onMouseLeave={() => setHoverRating(0)}
        >
          {Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const isActive = starValue <= (hoverRating || reviewRating);

            return (
              <button
                key={starValue}
                type="button"
                className="checkout-review__star"
                aria-label={`Rate ${starValue} out of 5 stars`}
                onClick={() => onRatingChange(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
              >
                <Star
                  size={28}
                  strokeWidth={1.5}
                  fill={isActive ? "#f5b301" : "transparent"}
                  stroke="#f5b301"
                />
              </button>
            );
          })}
        </div>
        {ratingError ? (
          <p className="checkout-review__feedback checkout-review__feedback--error">
            {ratingError}
          </p>
        ) : null}
      </div>

      <div className="checkout-review__field">
        <label
          className="checkout-review__label"
          htmlFor="checkout-review-text"
        >
          Write a review
        </label>
        <textarea
          id="checkout-review-text"
          className="checkout-review__textarea"
          placeholder="Share your thoughts about your order..."
          value={reviewText}
          onChange={(event) => onReviewTextChange(event.target.value)}
          rows={5}
        />
        {commentError ? (
          <p className="checkout-review__feedback checkout-review__feedback--error">
            {commentError}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="checkout-review__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default UserReview;

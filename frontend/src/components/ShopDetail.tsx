// src/components/ShopDetail.tsx
//
// Slide-in panel on the right side that shows a shop's details and its reviews.
// Logged-in users see a review form at the bottom.

import { useEffect, useState } from 'react';
import { getReviews, Review } from '@/api/reviews';
import { CoffeeShop } from '@/api/shops';
import { useAuth } from '@/context/AuthContext';
import ReviewForm from './ReviewForm';
import { Link } from 'react-router-dom';

interface Props {
  shop: CoffeeShop;
  onClose: () => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400">
      {'★'.repeat(rating)}
      <span className="text-gray-300">{'★'.repeat(5 - rating)}</span>
    </span>
  );
}

export default function ShopDetail({ shop, onClose }: Props) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const userHasReviewed = reviews.some((r) => r.username === user?.username);

  async function fetchReviews() {
    setLoadingReviews(true);
    try {
      const { data } = await getReviews(shop.id);
      setReviews(data);
    } finally {
      setLoadingReviews(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, [shop.id]);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="h-full flex flex-col bg-white border-l overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b">
        <div>
          <h2 className="font-semibold text-lg leading-tight">{shop.name}</h2>
          <p className="text-sm text-muted-foreground">{shop.neighborhood_name}</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground ml-2 mt-0.5">
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 space-y-4">
        {shop.address && (
          <p className="text-sm text-muted-foreground">{shop.address}</p>
        )}

        {avgRating && (
          <p className="text-sm font-medium">
            Average rating: <span className="text-amber-500">{avgRating} ★</span>{' '}
            <span className="text-muted-foreground">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
          </p>
        )}

        {/* Reviews list */}
        <div>
          <h3 className="font-medium text-sm mb-2">Reviews</h3>
          {loadingReviews && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!loadingReviews && reviews.length === 0 && (
            <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
          )}
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="text-sm border rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{r.username}</span>
                  <StarRating rating={r.rating} />
                </div>
                {r.comment && <p className="text-muted-foreground">{r.comment}</p>}
                <p className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Review form */}
        <div className="border-t pt-4">
          {!user && (
            <p className="text-sm text-muted-foreground">
              <Link to="/login" className="text-primary underline underline-offset-4">
                Log in
              </Link>{' '}
              to leave a review.
            </p>
          )}
          {user && userHasReviewed && (
            <p className="text-sm text-muted-foreground">You've already reviewed this shop.</p>
          )}
          {user && !userHasReviewed && (
            <>
              <h3 className="font-medium text-sm mb-2">Leave a review</h3>
              <ReviewForm shopId={shop.id} onReviewAdded={fetchReviews} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

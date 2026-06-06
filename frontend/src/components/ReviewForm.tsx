// src/components/ReviewForm.tsx
//
// Shown inside ShopDetail for logged-in users who haven't reviewed the shop yet.

import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { createReview } from '@/api/reviews';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Props {
  shopId: number;
  onReviewAdded: () => void;
}

export default function ReviewForm({ shopId, onReviewAdded }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createReview(shopId, { rating, comment: comment || undefined });
      setComment('');
      setRating(5);
      toast.success('Review submitted!');
      onReviewAdded();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        'Failed to submit review';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pt-2">
      <div className="space-y-1">
        <Label>Rating</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={`text-2xl transition-transform hover:scale-110 ${
                n <= rating ? 'opacity-100' : 'opacity-30'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="comment">Comment (optional)</Label>
        <Textarea
          id="comment"
          rows={3}
          placeholder="Share your experience…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="sm" disabled={loading}>
        {loading ? 'Submitting…' : 'Submit review'}
      </Button>
    </form>
  );
}

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Edit, Trash2, X } from 'lucide-react';
import { useCreateReview, useUpdateReview, useDeleteReview, ReviewData } from '@/hooks/useReviews';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface ReviewFormProps {
  productId: number;
  productName: string;
  existingReview?: {
    id: number;
    rating: number;
    title: string;
    comment: string;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  productName,
  existingReview,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [hoveredRating, setHoveredRating] = useState(0);

  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  const isEditing = !!existingReview;
  const isLoading = createReviewMutation.isPending || updateReviewMutation.isPending || deleteReviewMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !comment.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and comment.",
        variant: "destructive",
      });
      return;
    }

    const reviewData: ReviewData = {
      product_id: productId,
      rating,
      title: title.trim(),
      comment: comment.trim(),
    };

    try {
      if (isEditing && existingReview) {
        await updateReviewMutation.mutateAsync({
          reviewId: existingReview.id,
          reviewData,
          userId: user.id
        });
        toast({
          title: "Review Updated",
          description: "Your review has been updated successfully.",
        });
      } else {
        await createReviewMutation.mutateAsync({
          reviewData,
          userId: user.id
        });
        toast({
          title: "Review Submitted",
          description: "Thank you for your review!",
        });
      }
      
      // Force refetch reviews with a small delay
      setTimeout(() => {
        queryClient.invalidateQueries({ 
          queryKey: ['reviews', productId],
          exact: false 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['userReview', productId],
          exact: false 
        });
      }, 500);
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!existingReview) return;

    try {
      await deleteReviewMutation.mutateAsync({
        reviewId: existingReview.id,
        productId,
        userId: user.id
      });
      toast({
        title: "Review Deleted",
        description: "Your review has been deleted successfully.",
      });
      
      // Force refetch reviews with a small delay
      setTimeout(() => {
        queryClient.invalidateQueries({ 
          queryKey: ['reviews', productId],
          exact: false 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['userReview', productId],
          exact: false 
        });
      }, 500);
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold text-navy-800">
            {isEditing ? 'Edit Review' : 'Write a Review'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Info */}
            <div className="bg-cream-50 rounded-lg p-4">
              <h3 className="font-medium text-navy-800 mb-2">Reviewing:</h3>
              <p className="text-navy-600">{productName}</p>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-3">
                Rating *
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? 'fill-gold-400 text-gold-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-navy-600 mt-2">
                {rating > 0 && (
                  <>
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </>
                )}
              </p>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-navy-700 mb-2">
                Review Title *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                maxLength={255}
                required
              />
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-navy-700 mb-2">
                Review Comment *
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your detailed experience with this product..."
                rows={6}
                maxLength={1000}
                required
              />
              <p className="text-sm text-navy-600 mt-1">
                {comment.length}/1000 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading || rating === 0 || !title.trim() || !comment.trim()}
                className="flex-1 bg-gold-600 hover:bg-gold-700"
              >
                {isLoading ? 'Submitting...' : (isEditing ? 'Update Review' : 'Submit Review')}
              </Button>
              
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
              
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewForm; 
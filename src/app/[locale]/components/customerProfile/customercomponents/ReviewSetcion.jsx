import React, { useState } from 'react'
import { useTranslations } from 'use-intl'

function ReviewsSection({ userReviews, setUserReviews }) {
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [editingReview, setEditingReview] = useState(null)
  const [editReviewData, setEditReviewData] = useState({ rating: 1, comment: '' })

  const filteredReviews = userReviews.filter(review => {
    if (filterType === 'all') return true
    return review.entityType.toLowerCase() === filterType
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  const handleDeleteReview = (reviewId) => {
    setUserReviews(prev => prev.filter(review => review._id !== reviewId))
    // Here you would typically make an API call to delete the review
    console.log('Deleting review:', reviewId)
  }

  const handleEditReview = (review) => {
    setEditingReview(review)
    setEditReviewData({
      rating: review.rating,
      comment: review.comment
    })
  }

  const handleUpdateReview = () => {
    setUserReviews(prev => prev.map(review => 
      review._id === editingReview._id 
        ? { ...review, rating: editReviewData.rating, comment: editReviewData.comment }
        : review
    ))
    setEditingReview(null)
    setEditReviewData({ rating: 1, comment: '' })
    // Here you would typically make an API call to update the review
    console.log('Updating review:', editingReview._id, editReviewData)
  }

  const handleCancelEditReview = () => {
    setEditingReview(null)
    setEditReviewData({ rating: 1, comment: '' })
  }

  const StarRating = ({ rating, size = 'w-4 h-4' }) => (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`${size} ${i < rating ? 'fill-amber-400' : 'fill-slate-300'}`} viewBox="0 0 14 13">
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
      ))}
    </div>
  )

  const EditableStarRating = ({ rating, onChange }) => (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className="focus:outline-none"
        >
          <svg className={`w-6 h-6 transition-colors ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-300 text-slate-300 hover:fill-amber-200'}`} viewBox="0 0 14 13">
            <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm font-medium text-slate-700">{rating}/5</span>
    </div>
  )
  const t = useTranslations('reviews');
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">{t('myreviews')}</h3>
          <p className="text-slate-600">{t('desc')}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">{t('all')}</option>
            <option value="product">{t('products')}</option>
            <option value="store">{t('stores')}</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">{t('new')}</option>
            <option value="oldest">{t('old')}</option>
            <option value="highest">{t('high')}</option>
            <option value="lowest">{t('low')}</option>
          </select>
        </div>
      </div>

      {/* Reviews Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-bold text-blue-600">{userReviews.length}</p>
          <p className="text-slate-600 text-sm">{t('total')}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-bold text-green-600">
            {userReviews.filter(r => r.entityType === 'Product').length}
          </p>
          <p className="text-slate-600 text-sm">{t('product')}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {userReviews.filter(r => r.entityType === 'Store').length}
          </p>
          <p className="text-slate-600 text-sm">{t('store')}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-bold text-amber-600">
            {(userReviews.reduce((acc, r) => acc + r.rating, 0) / userReviews.length).toFixed(1)}
          </p>
          <p className="text-slate-600 text-sm">{t('average')}</p>
        </div>
      </div>

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">{t('edit')}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('rate')}</label>
                <EditableStarRating 
                  rating={editReviewData.rating}
                  onChange={(rating) => setEditReviewData(prev => ({ ...prev, rating }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('comment')}</label>
                <textarea
                  value={editReviewData.comment}
                  onChange={(e) => setEditReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Share your thoughts about this product/store..."
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCancelEditReview}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleUpdateReview}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('update')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <div key={review._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <img 
                  src={review.entityDetails.image} 
                  alt={review.entityDetails.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {review.entityDetails.name}
                      </h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          review.entityType === 'Product' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {review.entityType}
                        </span>
                        {review.entityType === 'Product' && review.entityDetails.price && (
                          <span className="text-slate-500 text-sm">${review.entityDetails.price}</span>
                        )}
                        {review.entityType === 'Store' && review.entityDetails.totalProducts && (
                          <span className="text-slate-500 text-sm">{review.entityDetails.totalProducts}{t('products')}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleEditReview(review)}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                        title="Edit review"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete review"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-3">
                    <StarRating rating={review.rating} />
                    <span className="text-sm font-medium text-slate-700">{review.rating}/5</span>
                  </div>
                  
                  {review.comment && (
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg">
                      "{review.comment}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('noreview')}</h3>
            <p className="text-slate-600">
              {filterType === 'all' 
                ? "You haven't written any reviews yet." 
                : `No ${filterType} reviews found.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewsSection
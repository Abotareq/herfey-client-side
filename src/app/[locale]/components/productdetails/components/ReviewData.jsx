"use client"
import React, { useState } from "react";

function ReviewsSection({ productRating = 4.2, totalReviews = 87 }) {
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const reviewsData = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2 days ago",
      verified: true,
      title: "Perfect fit and amazing quality!",
      review:
        "I absolutely love this t-shirt! The fabric is incredibly soft and comfortable. The fit is perfect - not too tight, not too loose. I've washed it several times and it still looks brand new. Definitely worth every penny!",
      helpful: 12,
      size: "M",
      avatar: "SJ",
      images: [],
    },
    {
      id: 2,
      name: "Mike Chen",
      rating: 4,
      date: "1 week ago",
      verified: true,
      title: "Great quality, runs slightly large",
      review:
        "Really impressed with the quality of this shirt. The material feels premium and the stitching is excellent. Only reason I'm giving 4 stars instead of 5 is that it runs a bit large - I usually wear L but this M fits perfectly.",
      helpful: 8,
      size: "M",
      avatar: "MC",
      images: [],
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 5,
      date: "2 weeks ago",
      verified: true,
      title: "Exceeded expectations!",
      review:
        "Ordered this as a gift for my boyfriend and he absolutely loves it. The color is vibrant, the fit is great, and it's held up really well after multiple washes. Fast shipping too!",
      helpful: 15,
      size: "L",
      avatar: "ER",
      images: [],
    },
    {
      id: 4,
      name: "David Park",
      rating: 4,
      date: "3 weeks ago",
      verified: false,
      title: "Good value for money",
      review:
        "Solid t-shirt for the price. Comfortable to wear and seems well-made. The only minor issue is that the neck can be a bit tight initially, but it loosens up after a few wears.",
      helpful: 5,
      size: "XL",
      avatar: "DP",
      images: [],
    },
    {
      id: 5,
      name: "Jessica Kim",
      rating: 5,
      date: "1 month ago",
      verified: true,
      title: "Love the soft fabric!",
      review:
        "This is my third purchase from this brand and they never disappoint. The fabric is so soft and breathable. Perfect for everyday wear or working out. Highly recommend!",
      helpful: 9,
      size: "S",
      avatar: "JK",
      images: [],
    },
    {
      id: 6,
      name: "Alex Thompson",
      rating: 3,
      date: "1 month ago",
      verified: true,
      title: "Decent shirt, color faded a bit",
      review:
        "Overall a decent t-shirt. Comfortable fit and good quality. However, after several washes, the color has faded slightly which is a bit disappointing for the price point.",
      helpful: 3,
      size: "L",
      avatar: "AT",
      images: [],
    },
  ];

  const ratingDistribution = [
    { stars: 5, count: 42, percentage: 48 },
    { stars: 4, count: 28, percentage: 32 },
    { stars: 3, count: 12, percentage: 14 },
    { stars: 2, count: 3, percentage: 4 },
    { stars: 1, count: 2, percentage: 2 },
  ];

  const displayedReviews = showAllReviews
    ? reviewsData
    : reviewsData.slice(0, 4);

  const StarRating = ({ rating, size = "w-4 h-4" }) => (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${size} ${
            i < rating ? "fill-amber-400" : "fill-slate-300"
          }`}
          viewBox="0 0 14 13"
        >
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="mt-16 border-t border-slate-200 pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Reviews Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Customer Reviews
            </h2>
            <p className="text-slate-600">See what our customers are saying</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Filter and Sort */}
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
                <option value="helpful">Most Helpful</option>
              </select>

              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              Write a Review
            </button>
          </div>
        </div>

        {/* Rating Summary */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 mb-12 border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-slate-900 mb-2">
                {productRating}
              </div>
              <StarRating rating={Math.floor(productRating)} size="w-6 h-6" />
              <p className="text-slate-600 mt-2">
                Based on {totalReviews} reviews
              </p>
            </div>

            <div className="lg:col-span-2 space-y-3">
              {ratingDistribution.map((rating) => (
                <div key={rating.stars} className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-slate-700 w-12">
                    {rating.stars} star
                  </span>
                  <div className="flex-1 bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-orange-400 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${rating.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-600 w-12 text-right">
                    {rating.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-8">
          {displayedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {review.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                    <div className="flex items-center space-x-3 flex-wrap">
                      <h4 className="font-semibold text-slate-900">
                        {review.name}
                      </h4>
                      {review.verified && (
                        <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Verified Purchase</span>
                        </div>
                      )}
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        Size: {review.size}
                      </span>
                    </div>
                    <span className="text-sm text-slate-500">
                      {review.date}
                    </span>
                  </div>

                  <div className="mb-3">
                    <StarRating rating={review.rating} />
                  </div>

                  <h5 className="font-semibold text-slate-900 mb-2">
                    {review.title}
                  </h5>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    {review.review}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors group">
                        <svg
                          className="w-4 h-4 group-hover:scale-110 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V9a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          Helpful ({review.helpful})
                        </span>
                      </button>
                      <button className="text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium">
                        Reply
                      </button>
                      <button className="text-slate-500 hover:text-red-600 transition-colors text-sm font-medium">
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More / Show Less Button */}
        {reviewsData.length > 4 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              {showAllReviews
                ? "Show Less Reviews"
                : `Load More Reviews (${reviewsData.length - 4} remaining)`}
            </button>
          </div>
        )}

        {/* Review Summary Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">94%</div>
            <div className="text-slate-600 font-medium">
              Recommend this product
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">4.8</div>
            <div className="text-slate-600 font-medium">
              Average quality rating
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">4.6</div>
            <div className="text-slate-600 font-medium">Average fit rating</div>
          </div>
        </div>

        {/* Most Mentioned Keywords */}
        <div className="mt-12 bg-slate-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">
            Most Mentioned
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              { keyword: "Comfortable", count: 45 },
              { keyword: "Soft fabric", count: 38 },
              { keyword: "Great fit", count: 32 },
              { keyword: "Good quality", count: 28 },
              { keyword: "True to size", count: 24 },
              { keyword: "Durable", count: 19 },
              { keyword: "Breathable", count: 16 },
            ].map((item) => (
              <span
                key={item.keyword}
                className="bg-white px-4 py-2 rounded-full border border-slate-200 text-slate-700 text-sm font-medium hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer"
              >
                {item.keyword} ({item.count})
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewsSection;

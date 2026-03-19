import { Order } from "@/types/order";
import { notify, Notification } from "@/utils/notify";
import { useState } from "react";

export default function ReviewModal({
    order,
    items,
    onClose,
}: {
    order: Order;
    items: any[];
    onClose: () => void;
}) {
    const [selectedKey, setSelectedKey] = useState("");
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);
    const [hover, setHover] = useState(0);

    const selectedItem = items.find(
        (i) => `${i.product_id}_${i.variant_id}` === selectedKey
    );

    const isValid =
        selectedItem &&
        rating > 0 &&
        review.trim().length > 0;

    const submitReview = async () => {
        if (!selectedItem) {
            notify(Notification.FAILURE, "Please select a product");
            return;
        }

        if (!rating) {
            notify(Notification.FAILURE, "Please select rating");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/products/review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    product_id: selectedItem.product_id,
                    variant_id: selectedItem.variant_id,
                    order_id: order.id,
                    rating,
                    review,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to submit review");
            }

            notify(Notification.SUCCESS, "Review submitted");
            onClose();
        } catch (e: any) {
            notify(Notification.FAILURE, e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-lg font-bold mb-4">Product Review</h2>

                {/* PRODUCT DROPDOWN */}
                <select
                    value={selectedKey}
                    onChange={(e) => setSelectedKey(e.target.value)}
                    className="w-full border rounded-lg p-2 mb-4"
                >
                    <option value="">Select product</option>
                    {items.map((item) => (
                        <option
                            key={`${item.product_id}_${item.variant_id}`}
                            value={`${item.product_id}_${item.variant_id}`}
                        >
                            {item.product?.name} ({item.variant?.name || "Variant"})
                        </option>
                    ))}
                </select>

                {/* ⭐ STAR RATING */}
                <div className="flex flex-col items-center mb-6">
                    <p className="text-sm text-gray-500 mb-2">Tap to rate</p>

                    <div className="flex justify-center gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                className={`cursor-pointer text-4xl transition-all duration-150 ${(hover || rating) >= star
                                    ? "text-yellow-500 scale-110"
                                    : "text-gray-300"
                                    }`}
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    {/* Rating Label */}
                    {(hover || rating) > 0 && (
                        <p className="mt-2 text-sm font-medium text-gray-700">
                            {["Poor", "Fair", "Good", "Very Good", "Excellent"][(hover || rating) - 1]}
                        </p>
                    )}
                </div>

                {/* REVIEW TEXT */}
                <textarea
                    placeholder="Write your review..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full border rounded-lg p-2 mb-4"
                    rows={4}
                />

                {/* ACTIONS */}
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={!isValid || loading}
                        onClick={submitReview}
                        className={`px-4 py-1.5 rounded-lg text-white ${isValid
                                ? "bg-green-700 hover:bg-green-800"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
}
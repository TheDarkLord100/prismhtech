"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductSearchSelect from "@/components/questions/ProductSearchSelect";
import { Notification, notify } from "@/utils/notify";

type Product = {
    id: string;
    name: string;
};

export default function AskQuestionPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const MAX_TAGS = 5;
    const [images, setImages] = useState<File[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    /* ---------- Image handling ---------- */
    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;

        const selected = Array.from(e.target.files);
        const remainingSlots = 3 - images.length;

        setImages((prev) => [...prev, ...selected.slice(0, remainingSlots)]);
    }

    function removeImage(index: number) {
        setImages((prev) => prev.filter((_, i) => i !== index));
    }

    /* ---------- Tag handling ---------- */
    function addTag(raw: string) {
        const clean = raw.trim().toLowerCase();

        if (!clean) return;
        if (tags.includes(clean)) return;
        if (tags.length >= MAX_TAGS) return;

        setTags((prev) => [...prev, clean]);
    }


    function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            addTag(tagInput);
            setTagInput("");
        }
    }


    function removeTag(tag: string) {
        setTags(tags.filter((t) => t !== tag));
    }

    const isSubmitDisabled = !title.trim() || !description.trim();

    async function handleSubmit() {
        if (isSubmitDisabled) return;

        setLoading(true);
        setError(null);

        try {
            /* 1️⃣ Create question */
            const createRes = await fetch("/api/questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    body: description,
                    tags,
                    product_id: selectedProduct?.id || null,
                }),
            });

            const createData = await createRes.json();

            if (!createRes.ok) {
                throw new Error(createData.error || "Failed to create question");
            }

            const questionId = createData.question_id;

            /* 2️⃣ Upload images */
            const imageUrls = await uploadImages(questionId);

            /* 3️⃣ Link images to question */
            if (imageUrls.length > 0) {
                const linkRes = await fetch("/api/questions/link-images", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        question_id: questionId,
                        images: imageUrls,
                    }),
                });

                if (!linkRes.ok) {
                    throw new Error("Failed to link images");
                }
            }

            /* 4️⃣ Redirect */
            notify(Notification.SUCCESS, "Question submitted successfully");
            window.location.href = "/blogs";

        } catch (err: any) {
            notify(Notification.FAILURE, err.message || "Submission failed");
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function uploadImages(questionId: string) {
        if (images.length === 0) return [];

        const uploadedUrls: string[] = [];

        for (let i = 0; i < images.length; i++) {
            const file = images[i];
            const ext = file.name.split(".").pop();
            const filePath = `${questionId}/${crypto.randomUUID()}.${ext}`;

            const res = await fetch("/api/questions/upload-images", {
                method: "POST",
                body: (() => {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("path", filePath);
                    return formData;
                })(),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Image upload failed");
            }

            uploadedUrls.push(data.publicUrl);
        }

        return uploadedUrls;
    }



    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50]">
            <Navbar />

            <main className="flex-1 pt-24 pb-12">
                <div className="max-w-3xl mx-auto px-6 py-10 bg-white/90 rounded-xl shadow-lg">
                    <h1 className="text-2xl font-bold text-green-900 mb-6">
                        Ask a Question
                    </h1>

                    <form className="space-y-6">
                        {/* TITLE */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter a short title"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                            />
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your question in detail"
                                rows={6}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                            />
                        </div>

                        {/* IMAGES */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Images (optional, max 3)
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                disabled={images.length >= 3}
                                onChange={handleImageChange}
                                className="block w-full text-sm"
                            />

                            <div className="flex gap-4 mt-3 flex-wrap">
                                {images.map((file, index) => (
                                    <div
                                        key={index}
                                        className="relative w-24 h-24 rounded-lg overflow-hidden border"
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                            alt="preview"
                                            className="object-cover w-full h-full"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded-full px-2"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* TAGS */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tags (optional)
                            </label>

                            <div className="flex flex-wrap gap-2 mb-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="text-xs"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))}
                            </div>

                            <input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                disabled={tags.length >= MAX_TAGS}
                                placeholder={
                                    tags.length >= MAX_TAGS
                                        ? "Maximum 5 tags reached"
                                        : "Type a tag and press space"
                                }
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none disabled:bg-gray-100"
                            />
                        </div>

                        {/* PRODUCT REFERENCE */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Related Product (optional)
                            </label>
                            <ProductSearchSelect
                                value={selectedProduct}
                                onChange={setSelectedProduct}
                            />
                        </div>
                        {error && (
                            <p className="text-red-600 text-sm">{error}</p>
                        )}

                        {/* SUBMIT */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitDisabled || loading}
                            className="px-6 py-2 bg-yellow-400 text-green-900 font-semibold rounded-lg hover:bg-yellow-300 disabled:opacity-50"
                        >
                            {loading ? "Submitting..." : "Submit Question"}
                        </button>

                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}

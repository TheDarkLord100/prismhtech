"use client";

interface StepIndicatorProps {
  currentStep: number; // 1, 2, or 3
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-2 mb-4 text-sm text-gray-700">

      {/* STEP 1 */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
            currentStep >= 1
              ? "bg-green-600 text-white"
              : "border border-gray-400 text-gray-400"
          }`}
        >
          {currentStep > 1 ? "✓" : "1"}
        </div>

        <span className={currentStep >= 1 ? "font-semibold" : "text-gray-400"}>
          Step 1: Select item(s)
        </span>
      </div>

      {/* LINE 1 (hidden on mobile) */}
      <div className="hidden sm:block flex-1 border-t border-gray-400 mx-2"></div>

      {/* STEP 2 */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
            currentStep >= 2
              ? "border border-green-600 text-green-600"
              : "border border-gray-400 text-gray-400"
          }`}
        >
          2
        </div>

        <span className={currentStep >= 2 ? "font-semibold" : "text-gray-400"}>
          Step 2: Select address
        </span>
      </div>

      {/* LINE 2 (hidden on mobile) */}
      <div className="hidden sm:block flex-1 border-t border-dashed border-gray-300 mx-2"></div>

      {/* STEP 3 */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
            currentStep >= 3
              ? "border border-green-600 text-green-600"
              : "border border-gray-400 text-gray-400"
          }`}
        >
          3
        </div>

        <span className={currentStep >= 3 ? "font-semibold" : "text-gray-400"}>
          Step 3: Checkout
        </span>
      </div>
    </div>
  );
}

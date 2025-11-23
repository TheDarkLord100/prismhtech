"use client";

interface StepIndicatorProps {
  currentStep: number; // 1, 2, 3, or 4
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const renderStep = (step: number, label: string) => {
    const isCompleted = currentStep > step; // completed before current step
    const isCurrent = currentStep === step; // the current active step

    return (
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* Step Circle */}
        <div
          className={`
            w-6 h-6 rounded-full flex items-center justify-center text-xs
            ${
              isCompleted
                ? "bg-green-600 text-white"
                : isCurrent
                ? "border border-green-600 text-green-600"
                : "border border-gray-400 text-gray-400"
            }
          `}
        >
          {isCompleted ? "✓" : step}
        </div>

        {/* Step Label */}
        <span
          className={
            isCompleted || isCurrent ? "font-semibold" : "text-gray-400"
          }
        >
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-2 mb-4 text-sm text-gray-700">

      {renderStep(1, "Step 1: Select item(s)")}

      <div className="hidden sm:block flex-1 border-t border-gray-400 mx-2" />

      {renderStep(2, "Step 2: Select address")}

      <div className="hidden sm:block flex-1 border-t border-dashed border-gray-300 mx-2" />

      {renderStep(3, "Step 3: Checkout")}

    </div>
  );
}

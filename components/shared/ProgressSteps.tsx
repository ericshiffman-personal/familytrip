'use client';

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function ProgressSteps({ currentStep, totalSteps, labels }: ProgressStepsProps) {
  return (
    <div className="w-full max-w-lg mx-auto mb-8">
      {/* Progress bar */}
      <div className="h-1.5 bg-sand-dark rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-coral rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between">
        {labels.map((label, idx) => {
          const step = idx + 1;
          const isComplete = step < currentStep;
          const isCurrent = step === currentStep;
          return (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isComplete
                    ? 'bg-coral text-white'
                    : isCurrent
                    ? 'bg-coral text-white ring-4 ring-coral/20'
                    : 'bg-sand-dark text-deep/30'
                }`}
              >
                {isComplete ? '✓' : step}
              </div>
              <span
                className={`text-xs hidden md:block transition-colors ${
                  isCurrent ? 'text-coral font-medium' : isComplete ? 'text-deep/40' : 'text-deep/25'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';

import {
  CheckCircle2,
  ClipboardList,
  CreditCard,
  User,
} from 'lucide-react';

interface Props {
  currentStep: number;
}

export const StepIndicator: React.FC<Props> = ({
  currentStep,
}) => {
  const steps = [
    {
      id: 1,
      label: 'Thông tin',
      icon: ClipboardList,
    },
    {
      id: 2,
      label: 'Hồ sơ',
      icon: User,
    },
    {
      id: 3,
      label: 'Thanh toán',
      icon: CreditCard,
    },
    {
      id: 4,
      label: 'Hoàn tất',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="bg-[#00b5f1] px-8 py-5">
      <div className="relative flex items-center justify-between">
        <div className="absolute top-5 left-0 h-[2px] w-full bg-white/30" />

        <div
          className="absolute top-5 left-0 h-[2px] bg-white transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => {
          const active = currentStep >= step.id;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              <div
                className={`
                  flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all
                  ${
                    active
                      ? 'border-white bg-white text-[#00b5f1]'
                      : 'border-white/50 bg-[#00b5f1] text-white/50'
                  }
                `}
              >
                <step.icon className="h-4 w-4" />
              </div>

              <span
                className={`
                  text-[12px] font-semibold
                  ${active ? 'text-white' : 'text-white/60'}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
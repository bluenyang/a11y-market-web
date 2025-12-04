import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Button } from '../ui/button';

export const A11yOptionCard = ({ label, icon, isActive, onClick, steps = 0, currentStep = 0 }) => {
  return (
    <Button
      variant='outline'
      aria-label={label}
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(
        'relative flex h-auto flex-col items-center justify-center gap-2 rounded-xl border px-2 py-8 transition-all',
        'hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-600',
        isActive
          ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
          : 'border-gray-200 bg-gray-100 text-gray-700',
      )}
    >
      {icon && icon}
      <span className='text-center text-sm font-medium break-keep'>{label}</span>

      {isActive && (
        <div className='absolute top-2 right-2 rounded-full bg-blue-600 p-0.5 text-white'>
          <Check
            className='size-3'
            strokeWidth={3}
          />
        </div>
      )}

      {steps > 0 && (
        <div className='mt-2 flex gap-1'>
          {Array.from({ length: steps }).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                'h-1 w-4 rounded-full transition-colors',
                currentStep > idx ? 'bg-blue-600' : 'bg-gray-300',
              )}
            />
          ))}
        </div>
      )}
      {!steps && <div className='mt-2 h-1 w-4' />}
    </Button>
  );
};

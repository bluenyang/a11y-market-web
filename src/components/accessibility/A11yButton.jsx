import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';
import { useState } from 'react';
import A11yOverlay from '@/components/accessibility/A11yOverlay';

export default function A11yButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setOpen(true)}
        aria-label='접근성 설정 열기'
        className='fixed right-6 bottom-6 z-50 flex size-18 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700'
      >
        <Settings2
          className='size-10'
          strokeWidth={2}
        />
      </Button>

      {/* Overlay */}
      {open && (
        <A11yOverlay
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

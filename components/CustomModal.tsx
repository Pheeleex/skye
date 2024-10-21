// CustomModal.tsx
import React, { ReactNode, useRef, useEffect } from 'react';

// Dialog (Main Modal Component)
export const Dialog = ({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose(); // Close the modal if the user clicks outside of the modal content
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

// Dialog Trigger (Button to Open Modal)
export const DialogTrigger = ({ onClick, children }: { onClick: () => void; children: ReactNode }) => {
  return <div onClick={onClick}>{children}</div>;
};

// Dialog Content (Content Wrapper Inside Modal)
export const DialogContent = ({ children }: { children: ReactNode }) => {
  return <div className='text-gray-900 z-50'>{children}</div>;
};

// Dialog Header (Header of the Modal)
export const DialogHeader = ({ children }: { children: ReactNode }) => {
  return <div className="mb-4 z-50">{children}</div>;
};

// Dialog Title (Title Text in Modal Header)
export const DialogTitle = ({ children }: { children: ReactNode }) => {
  return <h2 className="text-xl font-semibold">{children}</h2>;
};

// Dialog Description (Description Text in Modal Header)
export const DialogDescription = ({ children }: { children: ReactNode }) => {
  return <p className="text-sm text-black">{children}</p>;
};

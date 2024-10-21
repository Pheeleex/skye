'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/legacy/image';
import { decryptKey, encryptKey } from '@/lib/utils';

const PassKeyModal = () => {
  const [open, setOpen] = useState(true);
  const [passkey, setPassKey] = useState(Array(6).fill('')); // Array to store 6 digits
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // Refs for inputs
  const router = useRouter();

  // Retrieve encrypted key from localStorage
  const encryptedKey =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('accessKey')
      : null;

  useEffect(() => {
    const accessKey = encryptedKey ? decryptKey(encryptedKey) : null;

    if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      setOpen(false);
      router.push('/admin');
    }
  }, [encryptedKey, router]);

  // Handle OTP input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;

    if (/^\d$/.test(value)) {
      const newPasskey = [...passkey];
      newPasskey[index] = value;
      setPassKey(newPasskey);

      // Focus next input if available
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace and focus shift
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && index > 0 && passkey[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Validate PassKey
  const validatePassKey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const enteredPassKey = passkey.join('');
    if (enteredPassKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(enteredPassKey);
      localStorage.setItem('accessKey', encryptedKey);
      setOpen(false);
      router.push('/admin');
    } else {
      setError('Invalid passkey. Please try again.');
    }
  };

  // Close modal and redirect
  const closeModal = () => {
    setOpen(false);
    router.push('/');
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} items-center justify-center bg-gray-900 bg-opacity-75`}>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold">Admin access verification</h2>
          <Image
            src="/assets/icons/close.svg"
            alt="close"
            width={20}
            height={20}
            onClick={closeModal}
            className="cursor-pointer"
          />
        </div>
        <p className="mt-2 text-sm text-gray-600">To access the admin page, please enter the passkey.</p>
        <div className="flex justify-center mt-4">
          {passkey.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}  
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 border border-gray-300 rounded-lg text-center text-2xl mx-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label={`Passkey digit ${index + 1}`}
            />
          ))}
        </div>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        <button
          onClick={validatePassKey}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Enter Admin Passkey
        </button>
      </div>
    </div>
  );
};

export default PassKeyModal;

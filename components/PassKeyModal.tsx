'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { usePathname, useRouter } from 'next/navigation';
import Image from "next/legacy/image";
import { decryptKey, encryptKey } from '@/lib/utils';

const PassKeyModal = () => {
  const [open, setOpen] = useState(true);
  const [passkey, setPassKey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const path = usePathname();

  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  useEffect(() => {
    const accessKey = encryptedKey ? decryptKey(encryptedKey) : null;

    if (path) {
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        setOpen(false);
        router.push('/admin');
      } else {
        setOpen(true);
      }
    }
  }, [encryptedKey]);

  const validatePassKey =
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        const encryptedKey = encryptKey(passkey);
        localStorage.setItem("accessKey", encryptedKey);
        setOpen(false);
        router.push('/admin');
      } else {
        setError('Invalid passkey. Please try again');
      }
    };

  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-sm w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between text-lg md:text-xl">
            Admin Access Verification
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => closeModal()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm md:text-base text-gray-600">
            To access the admin page, please enter the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="mt-4">
          <InputOTP 
            maxLength={6}
            value={passkey}
            onChange={(value) => setPassKey(value)}
          >
            <InputOTPGroup className="flex justify-center space-x-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  className="w-10 h-10 md:w-12 md:h-12 border border-gray-300 rounded-md text-center text-xl"
                  index={index}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="text-red-500 text-sm md:text-base text-center mt-4">
              {error}
            </p>
          )}
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogAction
            onClick={(e) => validatePassKey(e)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-base md:text-lg transition duration-200"
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PassKeyModal;

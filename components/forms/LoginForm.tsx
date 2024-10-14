'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import CustomFormField from '../CustomFormField';
import { FormFieldType } from './AppointmentForm';
import { ReturnClientValidation } from '@/lib/validations';
import { checkPatientExists } from '@/lib/actions/patients.actions';
import { useRouter } from 'next/navigation';
import { Form } from '../ui/form';
import SubmitButton from '../SubmitButton';

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof ReturnClientValidation>>({
    resolver: zodResolver(ReturnClientValidation),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  async function onSubmit(values: z.infer<typeof ReturnClientValidation>) {
    setIsLoading(true);
    try {
      const { name, email, phone } = values;
      const userId = await checkPatientExists(name, email, phone);

      if (userId) {
        setSuccess(true);
        router.push(`/patients/${userId}/dashboard`);
      } else {
        setError('No matching user found');
        setIsLoading(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-[40rem] bg-white rounded-lg shadow-lg p-8 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <section className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-gray-800">Welcome Back 👋</h1>
              <p className="text-gray-600">Enter your correct details to sign in</p>
            </section>

            {/* Success and Error Messages */}
            {success && (
              <div className="success-message text-center bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg">
                Success!
              </div>
            )}
            {error && (
              <div className="error-message text-center bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg">
                {error}
              </div>
            )}

            {/* Full Name */}
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Full name"
              placeholder="John Doe"
              iconSrc="/assets/icons/user.svg"
              iconAlt="user"
            />

            {/* Email & Phone */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email address"
                placeholder="johndoe@gmail.com"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
              />

              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Phone Number"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Submit Button */}
            <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;

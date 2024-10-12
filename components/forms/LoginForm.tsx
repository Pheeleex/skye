'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import CustomFormField from '../CustomFormField'
import { FormFieldType } from './AppointmentForm'
import { ReturnClientValidation } from '@/lib/validations'
import { checkPatientExists } from '@/lib/actions/patients.actions'
import { useRouter } from 'next/navigation'
import { Form } from '../ui/form'
import SubmitButton from '../SubmitButton'

const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<boolean>(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof ReturnClientValidation>>({
        resolver: zodResolver(ReturnClientValidation),
        defaultValues: {
          name:  "",
          email: "",
          phone:  "",
        },
      })

      async function onSubmit(values: z.infer<typeof ReturnClientValidation>) {
            setIsLoading(true)
        try {
            const { name, email, phone } = values;

            // Check if a patient exists with the provided name, email, and phone
      const userId = await checkPatientExists(name, email, phone);

      if (userId) {
        // Redirect to the patient's dashboard if a match is found
        setSuccess(true)
      
       
            router.push(`/patients/${userId}/dashboard`);
      } else {
        // Handle the case where no patient was found (e.g., show an error message)
        console.error("No matching patient found.");
        setError("No matching user found")
        setIsLoading(false)
      }
        } catch (error) {
            // Check if error is an instance of Error and get the message
            if (error instanceof Error) {
                setError(error.message);
                setIsLoading(false)
            } else {
                // Otherwise, convert the error to string
                setError(String(error));
                setIsLoading(false)
            }
    return null;
        }
      }
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}  className="flex-1 space-y-6">
            <section className="space-y-4">
                <h1 className="header">Welcome Back 👋</h1>
                 <p className="text-dark-700">Enter you correct details to sign in</p>
            </section>


             {/* Success and Error Messages */}
        {success && (
          <div className="success-message fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 
          text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-500 ease-in-out z-10">
           Success!
          </div>
        )}
        {error && (
          <div className="error-message fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 
          text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-500 ease-in-out z-10">
            {error}
          </div>
        )}

            <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        {/* EMAIL & PHONE */}
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
        <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
        </form>
    </Form>
  )
}

export default LoginForm
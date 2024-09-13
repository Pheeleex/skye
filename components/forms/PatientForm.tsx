"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomFormField from "../CustomFormField"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patients.actions"
import SubmitButton from "../SubmitButton"
import { UserFormValidation } from "@/lib/validations"

export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON= 'skeleton'
}



 const PatientForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })
  const router = useRouter()

  // 2. Define a submit handler.
 async function onSubmit({name, email, phone}: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
    try {
      const userData = {
        name, email, phone
      }
      console.log(userData)
      const user = await createUser(userData) 
      
      if(user){router.push(`/patients/${user.$id}/register`)}
      console.log('user created')
    } catch (error: any) {
      console.log("Error in creating user:", error);
      // Check for specific error message
      if (error.message.includes("A user with this email or phone number already exists.")) {
        setError("A user with this email or phone number already exists.");
      } else {
        setError("An unexpected error occurred.");
      }
      } finally {
          setIsLoading(false);
      }
    
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
      {error && <div className="error-message text-red-700 bg-red opacity-4 p-2">{error}</div>}
        <section className="mb-12 space-y-4">
            <h1 className="header">Hi there 👋</h1>
            <p className="text-dark-700">Get started with appointments.</p>
        </section>
        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
        />

        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="johndoe@dermatech.dev"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
        />

        <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="(555) 123-4567"
        />
       <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}
export default PatientForm
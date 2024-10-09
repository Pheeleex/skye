'use client'
import React, { useState } from 'react'
import {
    Form,
    FormControl,
  } from "@/components/ui/form"
  import { zodResolver } from "@hookform/resolvers/zod"

import { string, z } from "zod"
import { PatientDetailsValidation } from '@/lib/validations'
import { GenderOptions, PatientDetailsDefaultValues } from '@/constants'
import CustomFormField from '../CustomFormField'

import { useForm } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'


import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import SubmitButton from '../SubmitButton'

import { addPatientDetails } from '@/lib/actions/patients.actions'
import { FileUploader } from '../FileUploader'
import { nanoid } from 'nanoid'
import { addDetails } from '@/lib/firebase'
import { FormFieldType } from './AppointmentForm'

const DetailsForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)
  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientDetailsValidation>>({
    resolver: zodResolver(PatientDetailsValidation),
    defaultValues: {
    ...PatientDetailsDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  })
  const router = useRouter()
  const { userId } = useParams();
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientDetailsValidation>) {
    setIsLoading(true);
    try {
      const patientData = {
        ...values,
        userId: userId ?? nanoid(), // Use userId from URL or fallback to a new one
        birthDate: new Date(values.birthDate),
        facePicture: values.facePicture
      }

      console.log(patientData, 'patientData')

        //@ts-ignore
       await addDetails(patientData)

        // Set success to true to show success message
      setSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
        // Redirect to the dashboard with the userId
        router.push(`/patients/${patientData.userId}/dashboard`)
      }, 3000)
    } catch (error) {
      console.log(error);
      
      // Check if error is an instance of Error and get the message
      if (error instanceof Error) {
          setError(error.message);
          setIsLoading(false)
      } else {
          // Otherwise, convert the error to string
          setError(String(error));
          setIsLoading(false)
      }
  }
  
  }
  return (
    <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex-1 space-y-12"
    >
      <section className="space-y-4">
        <h1 className="header">Welcome 👋</h1>
        <p className="text-dark-700">Let us know more about yourself.</p>
      </section>

          {/* Success and Error Messages */}
        {success && (
          <div className="success-message fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 
          text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-500 ease-in-out">
            Details submitted successfully!
          </div>
        )}
        {error && (
          <div className="error-message fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 
          text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-500 ease-in-out">
            {error}
          </div>
        )}


      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Personal Information</h2>
        </div>

        {/* NAME */}

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

         {/* BirthDate & Gender */}
         <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of birth"
          />

        <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option, i) => (
                    <div key={option + i} className="radio-group gold-border">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer text-gold-400">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
  )} />
          </div>

           {/* Address & Occupation */}
          <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="14 street, New york, NY - 5101"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder=" Software Engineer"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergency contact name"
            placeholder="Guardian's name"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency contact number"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* ALLERGY & CURRENT MEDICATIONS */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanuts, Penicillin, Pollen"
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current medications"
            placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
          />
        </div>

        <div>
        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="facePicture"
          label="Please upload a clear picture of your face"
          renderSkeleton={(field) => (
            <FormControl>
             <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />
        </div>

        <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Consent and Privacy</h2>
        </div>

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to receive treatment for my health condition."
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to the use and disclosure of my health
          information for treatment purposes."
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I acknowledge that I have reviewed and agree to the
          privacy policy"
        />
      </section>

      <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
    </section>
    </form>
    </Form>
  )
}

export default DetailsForm
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import { useState } from "react"
import { useRouter } from "next/navigation"
import SubmitButton from "../SubmitButton"
import { AppointmentFormValidation } from "@/lib/validations"
import { Treatments } from "@/constants"
import { SelectItem } from "../ui/select"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import {  createSkyeAppointment } from "@/lib/firebase"
import { nanoid } from 'nanoid';


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
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      treatment: "",
      schedule:  new Date(),
      reason: "",
      note: "",
    },
  })
  const router = useRouter()

  // 2. Define a submit handler.
 async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
  const userId = nanoid()
    setIsLoading(true);
    try {
      const userData = values
      console.log(userData)
      const appointment = await createSkyeAppointment(userData) 
      if(appointment){router.push(`/patients/${userId}/details`)}
      console.log('user created')
    } catch (error: any) {
      console.log("Error in creating user:", error);
      
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
            <p className="text-dark-700">When would you be free to stop by? <br />
             Please enter your correct details.</p>
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
            name="phoneNumber"
            label="Phone number"
            placeholder="(555) 123-4567"
        />

        <div>
        <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="location"
            label="Location"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {['Lagos', 'Abuja'].map((option, i) => (
                    <div key={option + i} className="radio-group gold-border">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer text-gold-400">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl> )} />
        </div>

<CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="treatment"
              label="Treatment"
              placeholder="Select a treatment"
            >
              {Treatments.map((treatment, i) => (
                <SelectItem key={i} value={treatment}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <p>{treatment}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

        <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for Appointment"
                placeholder="Enter Appointment reason"
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Comments/notes"
                placeholder="Prefer afternoon appointments, if possible"
              />
            </div>
       <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}
export default PatientForm
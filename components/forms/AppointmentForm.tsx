'use client'
import { getAppointmentSchema } from "@/lib/validations"
import { Appointment } from "@/types/firebasetypes"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "../ui/form"
import CustomFormField from "../CustomFormField"
import { FormFieldType } from "./PatientForm"
import { Doctors, Treatments } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import SubmitButton from "../SubmitButton"
import { createSkyeAppointment } from "@/lib/firebase"
import { updateAppointment, updateAppointments } from "@/lib/actions/appointments.actions"
import { nanoid } from "nanoid"

const AppointmentForm = ({
  type,
  appointment,
  userId,
  id,
  setOpen
}: {
  type: "create" | "cancel" | "schedule",
  appointment?: Appointment,
  userId: string
  id: string
  setOpen?: (open: boolean) => void
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<SetStateAction<string>>('')
  const AppointmentFormValidation = getAppointmentSchema(type)

  console.log(appointment, 'appointment', userId)
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      name: appointment ? appointment.name : '',
      email: appointment ? appointment.email : '',
      phoneNumber: appointment ? appointment.phoneNumber : '',
      location: appointment ? appointment.location : 'Abuja',
      treatment: appointment ? appointment.treatment : '',
      primaryPhysician: appointment ? appointment.primaryPhysician : '',
      schedule:  new Date(),
      reason: appointment ? appointment.reason : '',
      note: appointment ? appointment.note : '',
      cancellationReason: appointment?.cancellationReason || '',
    },
  })
  
  const router = useRouter()

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true)

    let status: string;
    switch (type) {
      case 'schedule':
        status = 'scheduled';
        break;
      case 'cancel':
        status = 'cancelled';
        break;
      default:
        status = 'pending';
        break;
    }

    try {
      if (type === 'create') {
        const appointmentData = {
          ...values,
          id: nanoid(),
          status: status as Status,
        }
        console.log(appointmentData)
        const appointment = await createSkyeAppointment(appointmentData);


        if (appointment) {
          form.reset();
        } else {
          setError(error);
        }
      } else {
        const appointmentToUpdate = {
          appointment: {
            id: appointment?.id,
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
  }
    const updatedAppointment = await updateAppointments(userId, appointmentToUpdate)
    if(updatedAppointment){
      setOpen && setOpen(false);
      form.reset();
    }
      };
    } catch (error: any) {
      console.log(error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  let buttonLabel: string;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Submit Appointment";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {
          type === 'create' && (
            <section className="mb-12 space-y-4">
              <h1 className="header">New Appointment 👋</h1>
              <p className="text-dark-700">Request a new appointment in 10 seconds</p>
            </section>
          )
        }

        {
          type == "create" && (
            <>
              <div>
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
                    name="phoneNumber"
                    label="Phone Number"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name="schedule"
                    label="Expected appointment date"
                    showTimeSelect
                    dateFormat="MM/dd/yyyy  -  h:mm aa"
                  />

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
                          {['Abuja', 'Lagos'].map((option, i) => (
                            <div key={option + i} className="radio-group gold-border">
                              <RadioGroupItem value={option} id={option} />
                              <Label htmlFor={option} className="cursor-pointer text-gold-400">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="primaryPhysician"
                  label="Doctor"
                  placeholder="Select a doctor"
                >
                  {Doctors.map((doctor, i) => (
                    <SelectItem key={doctor.name + i} value={doctor.name}>
                      <div className="flex cursor-pointer items-center gap-2">
                        <Image
                          src={doctor.image}
                          width={32}
                          height={32}
                          alt="doctor"
                          className="rounded-full border border-dark-500"
                        />
                        <p>{doctor.name}</p>
                      </div>
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="treatment"
                  label="What would you like us to do for you"
                  placeholder="Consultation"
                >
                  {Treatments.map((treatment, i) => (
                    <SelectItem key={i} value={treatment}>
                      <div className="flex cursor-pointer items-center gap-2">
                        {treatment}
                      </div>
                    </SelectItem>
                  ))}
                </CustomFormField>
              </div>

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
                  label="Comments/Notes"
                  placeholder="Prefer afternoon appointments, if possible"
                />
              </div>
            </>
          )
        }

{
  type === 'schedule' && (
    <div className="w-full">
      {/* Displaying Name, Email, Phone Number, and Location as text */}
      <div className="flex flex-wrap gap-8 items-center">
        <p><strong>Name:</strong> {appointment?.name}</p>
        <p><strong>Email:</strong> {appointment?.email}</p>
        <p><strong>Phone:</strong> {appointment?.phoneNumber}</p>
        <p><strong>Location:</strong> {appointment?.location}</p>
      </div>

      {/* Other fields remain editable */}
      <div className="flex flex-col gap-16 xl:flex-row">
        <CustomFormField
          fieldType={FormFieldType.DATE_PICKER}
          control={form.control}
          name="schedule"
          label="Expected appointment date"
          showTimeSelect
          dateFormat="MM/dd/yyyy  -  h:mm aa"
        />

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Doctor"
          placeholder="Select a doctor"
        >
          {Doctors.map((doctor, i) => (
            <SelectItem key={doctor.name + i} value={doctor.name}>
              <div className="flex cursor-pointer items-center gap-2">
                <Image
                  src={doctor.image}
                  width={32}
                  height={32}
                  alt="doctor"
                  className="rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>
      </div>

      <div className="flex flex-col">
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="treatment"
          label="What would you like us to do for you"
          placeholder="Consultation"
        >
          {Treatments.map((treatment, i) => (
            <SelectItem key={i} value={treatment}>
              <div className="flex cursor-pointer items-center gap-2">
                {treatment}
              </div>
            </SelectItem>
          ))}
        </CustomFormField>
      </div>

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
          label="Comments/Notes"
          placeholder="Prefer afternoon appointments, if possible"
        />
      </div>
    </div>
  )
}


        {
          type === "cancel" && (
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="cancellationReason"
              label="Reason for cancellation"
              placeholder="Urgent meeting came up"
            />
          )
        }

        <SubmitButton
          isLoading={isLoading}
          className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from './ui/button';
import AppointmentForm from './forms/AppointmentForm';
import { Appointment } from '@/types/firebasetypes';
//import AppointmentForm from './forms/AppointmentsForm';
  

const AppointmentModal = ({
    appointment,
    type,
    userId,
    id,
}: {
    id: string,
    userId: string
    appointment?: Appointment,
    type: "schedule" | "cancel";
    title: string;
    description: string;
}) => {
    const [open, setOpen] = useState(false);

    const modalOpen = () => {
      console.log(userId)
      console.log(`appointment with ${appointment?.id} opened`)
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        <Button variant="ghost" 
        className={`capitalize ${type} === 'schedule` &&
        'text-green-500'}
        onClick={modalOpen}
        >
            {type}
        </Button>
  </DialogTrigger>
  <DialogContent className='shad-dialog sm:max-w-md'>
  <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
          <DialogDescription>
            Please fill in the following details to {type} appointment
          </DialogDescription>
        </DialogHeader>
       <AppointmentForm
            id={appointment?.id || userId}
            userId={userId}
            type={type}
            appointment={appointment}
            setOpen={setOpen}
        />
  </DialogContent>
</Dialog>
  )
}

export default AppointmentModal
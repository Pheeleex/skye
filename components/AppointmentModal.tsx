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
import { Appointment, Patient } from '@/types/firebasetypes';
//import AppointmentForm from './forms/AppointmentsForm';
  

const AppointmentModal = ({
    appointment,
    type,
    appointmentId,
    user,
    patient
}: {
    appointmentId?: string,
    appointment?: Appointment,
    type: "schedule" | "cancel" | "create";
    title: string;
    description: string;
    user?:"visitor" | "client";
    patient?: Patient
}) => {
    const [open, setOpen] = useState(false);

   
  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        <Button variant="ghost" 
        className={`capitalize ${type === 'schedule' ? 'text-green-500' : 'text-red-700'} 
        ${user === 'visitor' ? '' : 'p-2 bg-slate-200 '}`}

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
        <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
            <AppointmentForm
              appointmentId={appointment?.id}
              type={type}
              appointment={appointment}
              setOpen={setOpen}
              user={user!}
              patient={patient}
            />
        </div>
  </DialogContent>
</Dialog>
  )
}

export default AppointmentModal
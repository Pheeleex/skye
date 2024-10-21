import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './CustomModal'; // Import your custom modal components
import AppointmentForm from './forms/AppointmentForm';
import { Appointment, Patient } from '@/types/firebasetypes';

const AppointmentModal = ({
  appointment,
  type,
  appointmentId,
  user,
  patient,
}: {
  appointmentId?: string;
  appointment?: Appointment;
  type: 'schedule' | 'cancel' | 'create';
  user?: 'visitor' | 'client';
  patient?: Patient;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <DialogTrigger onClick={() => setOpen(true)}>
        <button
          className={`capitalize ${type === 'schedule' ? 'text-green-500' : 'text-red-700'} 
          ${user === 'visitor' ? '' : 'p-2 bg-slate-200'}`}
        >
          {type}
        </button>
      </DialogTrigger>

      {/* Dialog Modal */}
      
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <div className="capitalize z-50">
              <DialogTitle>{type} Appointment</DialogTitle>
            </div>
            <DialogDescription>
              Please fill in the following details to {type} the appointment
            </DialogDescription>
          </DialogHeader>

          {/* Form Content */}
          <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin z-50">
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
    </>
  );
};

export default AppointmentModal;

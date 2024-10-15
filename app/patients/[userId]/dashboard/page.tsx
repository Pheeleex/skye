import PatientDashboard from '@/components/PatientDashboard/PatientDashboard'
import { getAppointment, getUserAppointment } from '@/lib/actions/appointments.actions'

import { fetchPatientById } from '@/lib/actions/patients.actions'
import React from 'react'

const page = async({ params: { userId } }: SearchParamProps) => {
  const patient = await fetchPatientById(userId)
  console.log(userId)
  console.log(patient);
  const userAppointment = await getUserAppointment(userId)
  console.log('userAppointment', userAppointment)
  return (
    <div>
        {
          patient && userAppointment &&(
            <PatientDashboard 
            patient={patient}
            userAppointment={userAppointment}/>
          )
        }
    </div>   
  )
}

export default page


{/**/}
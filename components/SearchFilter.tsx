import React from 'react'
import CustomFormField from './CustomFormField'
import { FormFieldType } from './forms/PatientForm'
import { Form } from './ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Correcting the validation schema with z.object
const SearchFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),
})

const SearchFilter = () => {
    // Fixing the useForm hook to use z.infer and zodResolver correctly
    const form = useForm<z.infer<typeof SearchFormValidation>>({
        resolver: zodResolver(SearchFormValidation),
        defaultValues: {
            name: ""
        },
      })
      
  return (
    <div className='flex items-center justify-center m-16'>
        <Form {...form}>
        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="search product"
            placeholder="XYZ SPF"
        />
        </Form>
    </div>
  )
}

export default SearchFilter

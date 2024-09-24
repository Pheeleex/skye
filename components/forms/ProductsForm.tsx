"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { number, z } from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ID } from "node-appwrite"
import { Form, FormControl } from "../ui/form"
import CustomFormField from "../CustomFormField"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { ProductType, SkinConcern, SkinType } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import { FileUploader } from "../FileUploader"
import SubmitButton from "../SubmitButton"
import { StoreFormValidation } from "@/lib/validations"
import { addProducts } from "@/lib/firebase"
import { nanoid } from "nanoid"



 const ProductForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);
  // 1. Define your form.
  const form = useForm<z.infer<typeof StoreFormValidation>>({
    resolver: zodResolver(StoreFormValidation),
    defaultValues: {
      name: '',
      price: '',
      category: '',
      skinConcern: '',
      description: '',
    },
  })
  const router = useRouter()

 async function onSubmit(values: z.infer<typeof StoreFormValidation>) {
    setIsLoading(true);
    
    try {
      const addedProduct = {
        ...values,
        id: nanoid(),
        imageFiles: values.imageFiles as File[]
      }

      console.log(addedProduct, 'product')

        //@ts-ignore
      const productAdded = await addProducts(addedProduct)
      if(productAdded){
        console.log(`product ${addedProduct.id} has been added`)
      }
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
            label="Product name"
            placeholder="XYZ SPF"
        />
        
        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="price"
            label="Price"
            placeholder="12"
        />
        <div>
        <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="skinType"
            label="Skin type"
            renderSkeleton={(field) => (
              <FormControl>  
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {SkinType.map((option, i) => (
                    <div key={option + i} className="radio-group gold-border">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer text-gold-400">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl> )} />

              <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="category"
              label="Product Type"
              placeholder="Select a skin concern"
            >
              {ProductType.map((product, i) => (
                <SelectItem key={i} value={product}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <p>{product}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
        </div>

        <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="skinConcern"
              label="Skin concern"
              placeholder="Select a skin concern"
            >
              {SkinConcern.map((treatment, i) => (
                <SelectItem key={i} value={treatment}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <p>{treatment}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

        <div>
        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="imageFiles"
          label="Upload Image"
          renderSkeleton={(field) => (
            <FormControl>
             <FileUploader files={field.value as File[]} onChange={field.onChange} />
            </FormControl>
          )}
        />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="description"
                label="Descrption"
                placeholder="Solves ABC for XYZ in 123"
              />
            </div>
       <SubmitButton isLoading={isLoading}>Add Product</SubmitButton>
      </form>
    </Form>
  )
}
export default ProductForm
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { nanoid } from "nanoid"
import { Products } from "@/types/firebasetypes"
import { StoreFormValidation } from "@/lib/validations"

import { Form, FormControl } from "../ui/form"
import CustomFormField from "../CustomFormField"

import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { SkinConcern, SkinType, ProductType } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import { FileUploader } from "../FileUploader"
import SubmitButton from "../SubmitButton"
import { FormFieldType } from "./AppointmentForm"
import { addProducts, updateProducts } from "@/lib/actions/products.actions"

const ProductForm = ({
  type,
  products,
  productId,
}: {
  type: "create" | "update",
  products?: Products,
  productId: string
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize form
  const form = useForm<z.infer<typeof StoreFormValidation>>({
    resolver: zodResolver(StoreFormValidation),
    defaultValues: {
      name: '',
      price: '',
      category: '',
      skinType: '',
      imageFiles: [],
      skinConcern: '',
      description: '',
      number:0,
    },
  })

  const router = useRouter()
  const { reset } = form

  // Reset form values when products data changes
  useEffect(() => {
    if (products) {
      reset({
        name: products?.name || '',
        price: products?.price || '',
        category: products?.category || '',
        skinType: products?.skinType as SkinType,
        skinConcern: products?.skinConcern || '',
        description: products?.description || '',
        number: 0,
      })
    }
  }, [products, reset])

  // Handle form submission
  async function onSubmit(values: z.infer<typeof StoreFormValidation>) {
    setIsLoading(true)
    
    try {
      if (type === "create") {
        const addedProduct = {
          ...values,
          id: nanoid(),
          imageFiles: values.imageFiles as File[],
        }
        //@ts-ignore
        await addProducts(addedProduct)
      }
      form.reset() // Reset form after successful submission
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(String(error))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {error && <div className="error-message text-red-700 bg-red opacity-4 p-2">{error}</div>}

        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">
            When would you be free to stop by? <br />
            Please enter your correct details.
          </p>
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

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="number"
          label="Amount available"
          placeholder="0"
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
              </FormControl>
            )}
          />

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

        {/* Conditional Rendering for File Uploader */}
        <div>
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="imageFiles"
            label="Upload Image"
            renderSkeleton={(field) => (
              <FormControl>
                {type === 'create' ? (
                  <FileUploader
                    files={field.value as File[]}
                    onChange={field.onChange}
                  />
                ) : (
                  <div className="text-gray-500">
                    Images cannot be edited during update.
                  </div>
                )}
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="description"
            label="Description"
            placeholder="Solves ABC for XYZ in 123"
          />
        </div>

        <SubmitButton isLoading={isLoading}>
          {type === "create" ? "Add Product" : "Update Product"}
        </SubmitButton>
      </form>
    </Form>
  )
}

export default ProductForm

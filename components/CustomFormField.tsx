import React from 'react'
import { E164Number } from "libphonenumber-js/core";
import {
    Form,
    FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import ReactDatePicker from "react-datepicker";
import { Input } from "@/components/ui/input"
import { Control } from 'react-hook-form'
import Image from "next/legacy/image"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { SelectTrigger } from '@radix-ui/react-select';
import { Select, SelectContent, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { FormFieldType } from './forms/AppointmentForm';


interface CustomProps{
    control: Control<any>,
    fieldType: FormFieldType,
    name: string,
    label?: string,
    placeholder?:string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    dateFormat?: string,
    showTimeSelect?: boolean,
    children?: React.ReactNode,
    renderSkeleton?: (field: any) => React.ReactNode
}

const RenderField = ({field, props}: {field:any, props: CustomProps}) => {
    const {fieldType, iconSrc, 
      iconAlt, 
      placeholder,
      showTimeSelect, 
      dateFormat,
      renderSkeleton,
      name
    } = props;
    switch(fieldType){
        case FormFieldType.INPUT:
            return(
                <div className="flex rounded-md border 
                border-gold-300 bg-transparent">
                    {
                        props.iconSrc && (
                            <Image
                            src={props.iconSrc}
                            height={24}
                            width={24}
                            alt={props.iconAlt || "icon"}
                            className="ml-2"
                          />)
                    }
            <FormControl>
                <Input
                    placeholder={props.placeholder}
                    {...field}
                    onChange={(e) => {
                      // Explicitly handle number type inputs
                      if (name === "number" || name === "price") {
                        const parsedValue = parseFloat(e.target.value);
                        field.onChange(isNaN(parsedValue) ? "" : parsedValue);
                      } else {
                        field.onChange(e.target.value);
                      }
                    }}
                    className="shad-input border-0"
                    type={name === "number" ? "number" : "text"} 
                    />
            </FormControl> 
            </div>
            );
            case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      );
            case FormFieldType.PHONE_INPUT:
                return(
                    <FormControl>
                        <PhoneInput
                            defaultCountry='US'
                            placeholder={placeholder}
                            international
                            withCountryCallingCode
                            value={field.value as E164Number | undefined}
                            onChange={field.onChange}
                            className='input-phone'
                        />
                    </FormControl>
                )
                case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
              case FormFieldType.DATE_PICKER:
                return(
                  <div className='flex rounded-md border
                   border-gold-300 bg-white'>
                      <Image
                        src="/assets/icons/calender.svg"
                        height={24}
                        width={24}
                        alt='c'
                        className='ml-2'
                        />
                        <FormControl>
                          <DatePicker
                            selected={field.value ? new Date(field.value) : new Date()}
                            onChange={(date) => field.onChange(date)}
                            dateFormat={
                              dateFormat ?? 'MM/dd/yyyy'
                            }
                            showTimeSelect={showTimeSelect ?? false}
                            timeInputLabel='Time'
                            wrapperClassName='date-picker'
                          />
                        </FormControl>
                   </div>
                )
      case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
          
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
           case FormFieldType.SKELETON:
            return renderSkeleton ? renderSkeleton(field): null  
          default:
          break; 
    }   
}

const CustomFormField = (props: CustomProps) => {
    const {control, fieldType, name, label} = props
  return (
    <div>
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              {
                fieldType !== FormFieldType.CHECKBOX && label &&
                (
                    <FormLabel>{label}</FormLabel>
                )
              }
              <RenderField field={field} props={props} />

             <FormMessage className='shad-error' />
            </FormItem>
          )}
        />
    </div>
  )
}

export default CustomFormField
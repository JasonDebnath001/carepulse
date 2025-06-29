import React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { FormFieldType } from "./forms/PatientForm";
import Image from "next/image";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

const DatePickerInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
  <input
    ref={ref}
    {...props}
    className="w-full h-11 bg-[#1A1D21] rounded-md px-3 text-14-medium border-none focus:outline-none focus:ring-0 placeholder:text-dark-600"
    style={{ boxShadow: "none" }}
  />
));
DatePickerInput.displayName = "DatePickerInput";

interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const {
    fieldType,
    iconSrc,
    iconsAlt,
    placeholder,
    dateFormat,
    showTimeSelect,
    renderSkeleton,
  } = props;
  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-[#363A3D] bg-[#1A1D21]">
          {iconSrc && (
            <Image
              src={iconSrc}
              alt={iconsAlt || "icon"}
              height={24}
              width={24}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              className="bg-[#1A1D21] placeholder:text-[#76828D] border-[#363A3D] h-11 focus-visible:ring-0 focus-visible:ring-offset-0 !important"
            />
          </FormControl>
        </div>
      );
      break;
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="CA"
            international
            withCountryCallingCode
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
            className="mt-2 h-11 rounded-md px-3 text-sm bg-[#1A1D21] placeholder:text-[#76828D] border-[#363A3D] focus:border-0 !important"
          />
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-[#363A3D] bg-[#1A1D21]">
          <Image
            src={"/assets/icons/calendar.svg"}
            alt="calendar"
            width={24}
            height={24}
            className="ml-2"
          />
          <FormControl>
            <div className="w-full">
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                dateFormat={dateFormat ?? "mm/dd/yyyy"}
                showTimeSelect={showTimeSelect ?? false}
                timeInputLabel="Time"
                customInput={<DatePickerInput />}
              />
            </div>
          </FormControl>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-[#1A1D21]  placeholder:text-[#76828D] border-[#363A3D] h-11 focus:ring-0 focus:ring-offset-0 !important">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-[#1A1D21] border-[#363A3D] !important">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            {...field}
            className="bg-[#1A1D21] placeholder:text-[#76828D] border-[#363A3D] focus-visible:ring-0 focus-visible:ring-offset-0 !important"
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label
              htmlFor={props.name}
              className="cursor-pointer text-sm font-medium text-dark-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 md:leading-none"
            >
              {props.label}
            </Label>
          </div>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;
    default:
      break;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, name, label } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FormFieldType.CHECKBOX && (
            <FormLabel>{label}</FormLabel>
          )}
          <RenderField field={field} props={props} />
          <FormMessage className="text-red-400 !important" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;

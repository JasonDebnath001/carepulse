"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { getAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";
import Image from "next/image";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { SelectItem } from "../ui/select";
import { Appointment } from "@/types/appwrite.types";

interface AppointmentFormProps {
  type: "create" | "cancel" | "schedule";
  userId: string;
  patientId: string;
  appointment?: Appointment;
  setOpen: (open: boolean) => void;
}

export default function AppointmentForm({
  type,
  userId,
  patientId,
  appointment,
  setOpen,
}: AppointmentFormProps) {
  const AppointmentFormValidation = getAppointmentSchema(type);

  console.log("AppointmentForm rendered", { type }); // Add this line

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      schedule: appointment ? new Date(appointment.schedule) : new Date(),
      reason:
        appointment && appointment.reason != null ? appointment.reason : "",
      note: appointment && appointment.note != null ? appointment.note : "",
      cancellationReason:
        appointment && appointment.cancellationReason != null
          ? appointment.cancellationReason
          : "",
      // Only include primaryPhysician if not cancel
      ...(type !== "cancel"
        ? {
            primaryPhysician:
              appointment && appointment.primaryPhysician != null
                ? appointment.primaryPhysician
                : "",
          }
        : {}),
    },
  });

  // Log form errors on each render
  console.log("formState.errors", form.formState.errors);

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    console.log("onSubmit called", { type, values }); // Debug: check if submit is triggered
    setIsLoading(true);
    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "canceled";
        break;
      default:
        status = "pending";
        break;
    }
    try {
      if (type === "create" && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        };
        const appointment = await createAppointment(appointmentData);
        if (appointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
      } else if (type === "schedule" && patientId) {
        // Before calling updateAppointment, log userId
        console.log("Calling updateAppointment with userId:", userId);

        if (!appointment?.$id) {
          console.error("No appointment ID found for scheduling.");
          setIsLoading(false);
          return;
        }

        const appointmentToUpdate = {
          userId,
          appointmentId: appointment.$id,
          appointment: {
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values?.schedule),
            status: status as Status,
          },
          type,
        };
        const updatedAppointment = await updateAppointment(appointmentToUpdate);
        if (updatedAppointment) {
          setOpen(false);
          form.reset();
        }
      } else if (type === "cancel") {
        if (!appointment?.$id) {
          console.error("No appointment ID found for cancellation.");
          setIsLoading(false);
          return;
        }
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment.$id,
          appointment: {
            primaryPhysician: appointment?.primaryPhysician,
            schedule: appointment?.schedule
              ? new Date(appointment.schedule)
              : new Date(),
            reason: appointment?.reason ?? "",
            note: appointment?.note ?? "",
            status: status as Status,
            cancellationReason: values?.cancellationReason,
          },
          type,
        };
        const updatedAppointment = await updateAppointment(appointmentToUpdate);
        if (updatedAppointment) {
          setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  let buttonLabel;
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
      break;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          console.log("form onSubmit event"); // Add this line
          form.handleSubmit(onSubmit)(e);
          // Log errors after submit attempt
          setTimeout(() => {
            console.log("formState.errors after submit", form.formState.errors);
          }, 0);
        }}
        className="space-y-6 flex-1"
      >
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="text-[32px] leading-[36px] font-bold md:text-36-bold">
              New Appointment
            </h1>
            <p className="text-[#ABB8C4]">
              Request a new appointment in 10 seconds
            </p>
          </section>
        )}
        {type !== "cancel" && (
          <>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image} // fallback if doctor.image is missing
                      alt={doctor.name}
                      width={32}
                      height={32}
                      className="rounded-full border border-[#363A3D]"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected Appointment Date"
              showTimeSelect
              dateFormat="MM/dd/yyy - h:mm aa"
            />
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for appointment"
                placeholder="Enter reason for appointment"
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Notes"
                placeholder="Enter notes"
              />
            </div>
          </>
        )}
        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          type="submit"
          onClick={() => console.log("SubmitButton clicked")} // Add this line
          className={`${
            type === "cancel"
              ? "bg-red-700 text-white !important"
              : "bg-green-500 text-white !important"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
}

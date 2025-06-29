import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import * as Sentry from '@sentry/nextjs'
import { getUser } from "@/lib/actions/patient.actions";

const Success = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);
  if (!appointment) {
    return (
      <div className="flex h-screen items-center justify-center">
        Appointment not found.
      </div>
    );
  }
  const user = await getUser(userId)

  Sentry.metrics.set('user_view_appointment_success', user.name)

  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician
  );
  console.log(appointment.schedule);

  // appointment.schedule is already ISO format, no need to parse manually
  function isValidDate(d: Date | null): d is Date {
    return !!d && !isNaN(d.getTime());
  }

  const parsedDate = appointment?.schedule
    ? new Date(appointment.schedule)
    : null;
  const formattedSchedule = isValidDate(parsedDate)
    ? formatDateTime(parsedDate)
    : null;

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="m-auto flex flex-1 flex-col items-center justify-between gap-10 py-10">
        <Link href="/">
          <Image
            src={"/assets/icons/logo-full.svg"}
            alt="logo"
            height={1000}
            width={1000}
            className="h-10 w-fit"
          />
        </Link>
        <section className="flex flex-col items-center">
          <Image
            src={"/assets/gifs/success.gif"}
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="text-[32px] leading-[36px] font-bold md:text-[36px] md:leading-[40px] md:font-bold mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">Appointment</span> Request Has
            Been Submitted!
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>
        <section className="flex w-full flex-col items-center gap-8 border-y-2 border-[#1A1D21] py-8 md:w-fit md:flex-row">
          <p>Requested appointment details:</p>
          {doctor && (
            <div className="flex items-center gap-3">
              <Image
                src={doctor.image}
                alt="doctor"
                width={100}
                height={100}
                className="size-6"
              />
              <p className="whitespace-nowrap">Dr.{doctor.name}</p>
            </div>
          )}
          <div className="flex gap-2">
            <Image
              src={"/assets/icons/calendar.svg"}
              height={24}
              width={24}
              alt="calendar"
            />
            <p>
              {formattedSchedule
                ? `${formattedSchedule.date} at ${formattedSchedule.time}`
                : "N/A"}
            </p>
          </div>
        </section>
        <Button
          className="bg-green-500 hover:bg-green-600 text-white border-none"
          asChild
        >
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>
        <p className="justify-items-end text-[#76828d] xl:text-left mt-10 py-12">
          &copy; 2025 carepulse
        </p>
      </div>
    </div>
  );
};

export default Success;

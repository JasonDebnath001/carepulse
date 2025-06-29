import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import * as Sentry from '@sentry/nextjs'

export default async function NewAppointment({
  params: { userId },
}: SearchParamProps) {
  const patient = await getPatient(userId);
  Sentry.metrics.set('user_view_new_appointment', patient.name)

  if (!patient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Patient not found</h2>
          <p className="text-gray-500">
            No patient record exists for this user.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar relative flex-1 overflow-y-auto px-[5%] my-auto">
        <div className="mx-auto flex-1 size-full flex-col py-10 max-w-[860px] justify-between">
          <Image
            src={"/assets/icons/logo-full.svg"}
            alt="Patient"
            height={1000}
            width={1000}
            className="mb-12 h-10 w-fit"
          />
          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient.$id}
          />
          <p className="justify-items-end text-[#76828d] xl:text-left mt-10 py-12">
            &copy; 2025 carepulse
          </p>
        </div>
      </section>
      <Image
        src={"/assets/images/appointment-img.png"}
        alt="appointment"
        height={1000}
        width={1000}
        className="hidden h-full object-cover md:block max-w-[390px] bg-bottom"
      />
    </div>
  );
}

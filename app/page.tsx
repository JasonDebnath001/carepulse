/* eslint-disable */
import PatientForm from "@/components/forms/PatientForm";
import PasskeyModal from "@/components/PasskeyModal";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function Home({ searchParams }: Props) {
  const isAdmin = searchParams?.admin === "true";

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}
      <section className="remove-scrollbar relative flex-1 overflow-y-auto px-[5%] my-auto">
        <div className="mx-auto flex size-full flex-col py-10 max-w-[496px]">
          <Image
            src={"/assets/icons/logo-full.svg"}
            alt="Patient"
            height={1000}
            width={1000}
            className="mb-12 h-10 w-fit"
          />
          <PatientForm />
          <div className="justify-items-end text-center text-[#76828D] xl:text-left mt-20 flex justify-between ">
            <p className="justify-items-end text-[#76828d] xl:text-left">
              &copy; 2025 CarePulse
            </p>
            <Link href={"/?admin=true"} className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>
      <Image
        src={"/assets/images/onboarding-img.png"}
        alt="onboarding"
        height={1000}
        width={1000}
        className="hidden h-full object-cover md:block max-w-[50%]"
      />
    </div>
  );
}

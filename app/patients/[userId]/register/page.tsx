import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import * as Sentry from '@sentry/nextjs'

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);
  Sentry.metrics.set('user_view_register', user.name)

  return (
    <div className="flex h-screen">
      <section className="remove-scrollbar relative flex-1 px-[5%] flex h-screen overflow-y-auto">
        <div className="mx-auto flex-1 size-full flex-col py-10 max-w-[860px]">
          <Image
            src={"/assets/icons/logo-full.svg"}
            alt="Patient"
            height={1000}
            width={1000}
            className="mb-12 h-10 w-fit"
          />
          <RegisterForm user={user} />
          <p className="text-[14px] leading-[18px] font-normal justify-items-end text-center text-dark-600 xl:text-left py-12">
            &copy; 2025 carepulse
          </p>
        </div>
      </section>
      <Image
        src={"/assets/images/register-img.png"}
        alt="Register"
        height={1000}
        width={1000}
        className="hidden h-screen object-cover md:block max-w-[390px]"
      />
    </div>
  );
};

export default Register;

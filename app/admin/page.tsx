import {DataTable} from "@/components/table/DataTable";
import StatCard from "@/components/StatCard";
import { getRecentAppointment } from "@/lib/actions/appointment.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {columns} from "@/components/table/columns";


  

const Admin = async () => {

    const appointments = await getRecentAppointment()

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-15">
      <header className="sticky top-3 z-20 mx-3 flex items-center justify-between rounded-2xl bg-[#0D0F10] px-[5%] py-5 shadow-lg xl:px-12">
        <Link href={"/"} className="cursor-pointer">
          <Image
            src={"/assets/icons/logo-full.svg"}
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>
        <p className="text-[16px] leading-[20px] font-semibold">
          Admin Dashboard
        </p>
      </header>
      <main className="flex flex-col items-center space-y-6 px-[5%] pb-12 xl:space-y-12 xl:px-12">
        <section className="w-full space-y-4">
          <h1 className="text-[32px] leading-[36px] font-bold md:text-[36px] md:leading-[40px] md:font-bold">
            Welcome 👋
          </h1>
          <p className="text-[#ABB8C4]">
            Start the day with managing the appointments
          </p>
        </section>
        <section className="flex w-full flex-col justify-between gap-5 sm:flex-row xl:gap-10">
          <StatCard
            type="appointments"
            count={appointments?.scheduleCount}
            label="Scheduled appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointments?.pendingCount}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="canceled"
            count={appointments?.canceledCount}
            label="Cancelled appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>
        <DataTable data={appointments?.documents} columns={columns} />
      </main>
    </div>
  );
};

export default Admin;

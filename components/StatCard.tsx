import clsx from "clsx";
import Image from "next/image";
import React from "react";

interface StatCardProps {
  type: "appointments" | "pending" | "canceled";
  count: number;
  label: string;
  icon: string;
}

const StatCard = ({ count = 0, label, icon, type }: StatCardProps) => {
  return (
    <div
      className={clsx(
        "flex flex-1 flex-col gap-6 rounded-2xl bg-cover p-6 shadow-lg",
        {
          "bg-appointment": type === "appointments",
          "bg-pending": type === "pending",
          "bg-canceled": type === "canceled",
        }
      )}
    >
      <div className="flex items-center gap-2">
        <Image
          src={icon}
          width={32}
          height={32}
          alt="label"
          className="size-8 w-fit"
        />
        <h2 className="text-[32px] leading-[36px] font-bold text-white">
          {count}
        </h2>
        <p className="text-[14px] leading-[18px] font-normal">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;

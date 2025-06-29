import { StatusIcon } from "@/constants";
import clsx from "clsx";
import Image from "next/image";
import React from "react";

type Status = "scheduled" | "pending" | "cancelled";

const fallbackIcon = "/assets/icons/pending.svg";

const StatusBadge = ({ status }: { status: Status }) => {
  const iconSrc = StatusIcon[status] || fallbackIcon;
  const normalizedStatus = status.toLowerCase();
  // Debug: Remove after confirming value
  console.log("StatusBadge status:", status);

  return (
    <div
      className={clsx("flex w-fit items-center gap-2 rounded-full px-4 py-2", {
        "": normalizedStatus === "scheduled",
        "": normalizedStatus === "pending",
        "": normalizedStatus === "canceled",
      })}
    >
      <Image
        src={iconSrc}
        alt="status"
        width={24}
        height={24}
        className="h-fit w-3"
      />
      <p
        className={clsx("text-[12px] leading-[16px] font-semibold capitalize", {
          "text-white": normalizedStatus === "scheduled",
          "text-gray-200": normalizedStatus === "pending",
          "text-gray-100": normalizedStatus === "canceled",
        })}
      >
        {status}
      </p>
    </div>
  );
};

export default StatusBadge;

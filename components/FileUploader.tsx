"use client";
import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};

const FileUploader = ({ files, onChange }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (typeof onChange === "function") {
        onChange(acceptedFiles);
      }
    },
    [onChange]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="text-12-regular flex cursor-pointer  flex-col items-center justify-center gap-3 rounded-md border border-dashed border-dark-500 bg-dark-400 p-5"
    >
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          alt="document"
          width={1000}
          height={1000}
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        <>
          <Image
            src={"/assets/icons/upload.svg"}
            alt={"upload"}
            width={40}
            height={40}
          />
          <div className="flex flex-col justify-center gap-2 text-center text-[#76828D]">
            <p className="text-[14px] leading-[18px] font-normal">
              <span className="text-green-500">Click to upload</span> or drag &
              drop
            </p>
            <p>SVG,PNG,JPEG,GIF (max 800x400)</p>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploader;

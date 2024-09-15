"use client";

import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { UploadButton } from "@/components/UploadButton";
import { FileCard } from "@/components/FileCard";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  const isLoading = files === undefined;

  return (
    <main className="container mx-auto pt-12">
      {isLoading && (
        <div className="flex flex-col gap-4 items-center mt-24">
          <Loader2 className="size-32 animate-spin text-gray-700" />
          <div className="text-2xl">Preparing your files...</div>
        </div>
      )}

      {!isLoading && files.length === 0 && (
        <div className="flex flex-col gap-8 items-center mt-24">
          <Image
            src="/empty.svg"
            width={400}
            height={400}
            alt="An image of a picture and directory icon"
          />
          <p className="text-2xl">
            You have no files yet. Click below to upload your first file.
          </p>
          <UploadButton />
        </div>
      )}

      {!isLoading && files.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Your Files</h1>

            <UploadButton />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {files?.map((file) => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
        </>
      )}
    </main>
  );
}

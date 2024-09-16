"use client";

import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { UploadButton } from "@/components/UploadButton";
import { FileCard } from "@/components/FileCard";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { useState } from "react";

function Placeholder({ filesDoNotExist }: { filesDoNotExist: boolean }) {
  return (
    <div className="flex flex-col gap-8 items-center mt-24">
      <Image
        src="/empty.svg"
        width={400}
        height={400}
        alt="An image of a picture and directory icon"
      />
      <p className="text-2xl">
        {filesDoNotExist
          ? "You have no files yet. Click below to upload your first file."
          : "No files match your search."}
      </p>
      {filesDoNotExist && <UploadButton />}
    </div>
  );
}

export default function FileBrowser({
  title,
  favoritesOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  const files = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          query,
          favorites: favoritesOnly,
        }
      : "skip"
  );
  const isLoading = files === undefined;

  return (
    <div>
      {isLoading && (
        <div className="flex flex-col gap-4 items-center mt-24">
          <Loader2 className="size-32 animate-spin text-gray-700" />
          <div className="text-2xl">Preparing your files...</div>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">{title}</h1>

            <SearchBar query={query} setQuery={setQuery} />

            <UploadButton />
          </div>

          {files.length === 0 && <Placeholder filesDoNotExist={false} />}

          <div className="grid grid-cols-4 gap-4">
            {files?.map((file) => {
              return <FileCard favorites={favorites ?? []} key={file._id} file={file} />;
            })}
          </div>
        </>
      )}
    </div>
  );
}

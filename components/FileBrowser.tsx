"use client";

import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { UploadButton } from "@/components/UploadButton";
import { FileCard } from "@/components/FileCard";
import Image from "next/image";
import { GridIcon, Loader2, RowsIcon } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { useState } from "react";
import { DataTable } from "./FileTable";
import { columns } from "./Columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc } from "@/convex/_generated/dataModel";
import { Label } from "./ui/label";

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
  deletedOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

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
          type: type === "all" ? undefined : type,
          query,
          favorites: favoritesOnly,
          deletedOnly,
        }
      : "skip"
  );

  const isLoading = files === undefined;

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorited: favorites?.some((favorite) => favorite.fileId === file._id),
    })) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>

        <SearchBar query={query} setQuery={setQuery} />

        <UploadButton />
      </div>

      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center">
          <TabsList className="mb-4">
            <TabsTrigger value="grid" className="flex gap-2 items-center">
              <GridIcon /> Grid
            </TabsTrigger>
            <TabsTrigger value="table" className="flex gap-2 items-center">
              <RowsIcon /> Table
            </TabsTrigger>
          </TabsList>
          <div>
            <Label htmlFor="type-select">
              Type Filter
            </Label>
            <Select
              value={type}
              onValueChange={(newType) => {
                setType(newType as Doc<"files">["type"] | "all");
              }}
            >
              <SelectTrigger id="type-select" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {isLoading && (
          <div className="flex flex-col gap-4 items-center mt-24">
            <Loader2 className="size-32 animate-spin text-gray-700" />
            <div className="text-2xl">Preparing your files...</div>
          </div>
        )}
        <TabsContent value="grid">
          <div className="grid grid-cols-4 gap-4">
            {modifiedFiles?.map((file) => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
        </TabsContent>
        <TabsContent value="table">
          <DataTable columns={columns} data={modifiedFiles} />
        </TabsContent>
      </Tabs>

      {files?.length === 0 && <Placeholder filesDoNotExist={false} />}
    </div>
  );
}

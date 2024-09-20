import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react";

import { ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { formatRelative } from "date-fns";
import { FileCardActions } from "./FileActions";

export const FileCard = ({
  file,
}: {
  file: Doc<"files"> & { isFavorited: boolean; url: string | null };
}) => {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>;

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 text-base font-normal">
          <div className="flex justify-center">{typeIcons[file.type]}</div>
          {file.name}
        </CardTitle>
        <div className="absolute top-2 right-2">
          <FileCardActions isFavorited={file.isFavorited} file={file} />
        </div>
      </CardHeader>
      <CardContent className="h-[200px] flex justify-center items-center">
        {file.type === "image" && file.url && (
          <Image src={file.url} alt={file.name} width={200} height={100} />
        )}

        {file.type === "csv" && (
          <Image
            src="/csv.png"
            width={80}
            height={80}
            alt="CSV File Type Image"
          />
        )}
        {file.type === "pdf" && (
          <Image
            src="/pdf.png"
            width={160}
            height={160}
            alt="PDF File Type Image"
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2 text-sm text-gray-700 w-20 items-center">
          <Avatar className="size-6">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>
              {userProfile?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>

        <div className="text-sm text-gray-700">
          {formatRelative(new Date(file._creationTime), new Date())}
        </div>
      </CardFooter>
    </Card>
  );
};

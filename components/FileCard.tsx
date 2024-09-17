import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "./ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  MoreVertical,
  StarIcon,
  TrashIcon,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ReactNode, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { Protect } from "@clerk/nextjs";

const FileCardActions = ({
  file,
  isFavorited,
}: {
  file: Doc<"files">;
  isFavorited: boolean;
}) => {
  const deleteFile = useMutation(api.files.deleteFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({
                  fileId: file._id,
                });

                toast({
                  variant: "default",
                  title: "File deleted successfully",
                  description: "Your file has been permanently deleted.",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              toggleFavorite({
                fileId: file._id,
              });
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            {isFavorited ? (
              <>
                <FaStar className="size-4" />
                <small className="font-semibold text-sm">Favorited</small>
              </>
            ) : (
              <>
                <StarIcon className="size-4" />
                <small className="text-sm">Favorite</small>
              </>
            )}
          </DropdownMenuItem>
          <Protect role="org:admin" fallback={<></>}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setIsConfirmOpen(true)}
              className="flex gap-1 text-red-600 items-center cursor-pointer"
            >
              <TrashIcon className="size-4" />
              Delete
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const FileCard = ({
  file,
  favorites,
}: {
  file: Doc<"files"> & { url: string | null };
  favorites: Doc<"favorites">[];
}) => {
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>;

  const isFavorited = favorites.some(
    (favorite) => favorite.fileId === file._id
  );

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2">
          <div className="flex justify-center">{typeIcons[file.type]}</div>
          {file.name}
        </CardTitle>
        <div className="absolute top-2 right-2">
          <FileCardActions isFavorited={isFavorited} file={file} />
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
      <CardFooter className="flex justify-center">
        <Button
          onClick={() => {
            // Open a new file to the file location on Convex
            if (file.url) {
              window.open(file.url, "_blank");
            }
          }}
        >
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

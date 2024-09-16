"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { FileIcon, StarIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const SideNav = () => {
  const pathname = usePathname();

  return (
    <div className="w-40 flex flex-col gap-4">
      <Link href="/dashboard/files">
        <Button
          variant={"link"}
          className={cn("flex gap-2", {
            "text-blue-500": pathname.includes("/dashboard/files"),
          })}
        >
          <FileIcon /> All Files
        </Button>
      </Link>

      <Link href="/dashboard/favorites">
        <Button
          variant={"link"}
          className={cn("flex gap-2", {
            "text-blue-500": pathname.includes("/dashboard/favorites"),
          })}
        >
          <StarIcon /> Favorites
        </Button>
      </Link>
    </div>
  );
};

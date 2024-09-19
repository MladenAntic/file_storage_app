"use client";

import FileBrowser from "@/components/FileBrowser";

export default function TrashPage() {
  return (
    <div>
      <FileBrowser title="Trash" deletedOnly />
    </div>
  );
}
"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";

export default function Home() {
  const files = useQuery(api.files.getFiles);
  const createFile = useMutation(api.files.createFile);

  return (
    <main>
      <SignedIn>
        <SignOutButton>
          <Button>Sign Out</Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>

      {files?.map((file) => {
        return <div key={file._id}>{file.name}</div>;
      })}

      <Button
        onClick={() => {
          createFile({ name: "Hello World" });
        }}
      >
        Click Me
      </Button>
    </main>
  );
}

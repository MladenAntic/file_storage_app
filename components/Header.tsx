import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <div className="border-b py-4 bg-gray-50 relative z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex gap-2 items-center text-xl">
          <Image src="/logo.png" width={50} height={50} alt="FileDrive Logo" />
          FileDrive
        </Link>

        <SignedIn>
          <Button variant="outline">
            <Link href="/dashboard/files">Your Files</Link>
          </Button>
        </SignedIn>

        <div className="flex gap-2">
          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

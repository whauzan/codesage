import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import GlobalSearch from "../search/GlobalSearch";

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/">
        <p className="h2-bold text-dark100_light900 flex items-center font-spaceGrotesk tracking-widest max-sm:hidden">
          C
          <Image
            src="/assets/images/site-logo.svg"
            width={27}
            height={27}
            alt="CodeSage"
            className="mr-0.5"
          />
          de
          <span className="primary-text-gradient">Sage</span>
        </p>
        <div className="sm:hidden">
          <Image
            src="/assets/images/site-logo.svg"
            width={23}
            height={23}
            alt="CodeSage"
          />
        </div>
      </Link>
      <GlobalSearch />
      <div className="flex-between gap-5">
        <Theme />
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: { avatarBox: "h-10 w-10" },
              variables: { colorPrimary: "#007BFF" },
            }}
          />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;

"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/actions/auth/authentication";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import Link from "next/link";

type NavbarProps = {
  session: Session | null;
};

export default function Navbar({ session }: NavbarProps) {
  return (
    <nav className="flex justify-around items-center bg-slate-400">
      <div className="logo">
        <Link href={"/"}>
          <Image
            src={"https://place-hold.it/48"}
            width={48}
            height={48}
            alt="logo"
          />
        </Link>
      </div>
      <div className="nav-items">
        <Link href={"/about"}>About</Link>
      </div>
      <div className="user">
        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:cursor-pointer" asChild>
              <Avatar>
                <AvatarImage src="http://somerandomurl.com" />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Button
                  className="w-full hover:cursor-pointer"
                  variant={"ghost"}
                  onClick={() => redirect("/settings")}
                >
                  Settings
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  className="w-full hover:cursor-pointer"
                  variant={"ghost"}
                  onClick={() => redirect("/boards")}
                >
                  Boards
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  className="w-full hover:cursor-pointer"
                  variant={"ghost"}
                  onClick={logoutAction}
                >
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-x-2">
            <Button
              onClick={() => redirect("/login")}
              className="bg-green-400 text-black hover:cursor-pointer hover:bg-green-600"
            >
              Login
            </Button>
            <Button
              onClick={() => redirect("/register")}
              className="bg-blue-400 text-black hover:cursor-pointer hover:bg-blue-600"
            >
              Register
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

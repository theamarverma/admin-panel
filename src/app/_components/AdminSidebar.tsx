"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiSolidPackage } from "react-icons/bi";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { FaUsers } from "react-icons/fa";
import { BsCalendar2EventFill } from "react-icons/bs";
import { BiSolidDonateBlood } from "react-icons/bi";
import { SiBlogger } from "react-icons/si";
import Image from "next/image";
export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <Sidebar>
      <SidebarHeader className="bg-[#FBFBFB]">
        <SidebarMenu>
          <SidebarMenuItem>
            <div>
              <Link href="/">
                <div className="flex flex-col gap-0.5 leading-none">
                  <div className="text-2xl font-semibold hover:bg-transparent">
                    <Image
                      className="ml-4 p-2"
                      alt="logo"
                      src={"http://acmelogos.com/images/logo-1.svg"}
                      width={150}
                      height={100}
                    />
                  </div>
                </div>
              </Link>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-[#Fdfaf6]">
        <SidebarMenu>
          <SidebarMenuItem className="px-2 py-1">
            <SidebarMenuButton
              className="rounded-md bg-[#e9ecef] p-6"
              asChild
              isActive={isActive("/products")}
            >
              <Link className="rounded-md" href="/products/">
                <BiSolidPackage style={{ width: "32px", height: "32px" }} />
                <span className="text-lg">Products</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem className="px-2 py-1">
            <SidebarMenuButton
              className="rounded-md bg-[#e9ecef] p-6"
              asChild
              isActive={isActive("/users")}
            >
              <Link href="/users">
                <FaUsers style={{ width: "32px", height: "32px" }} />
                <span className="text-lg">Users</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem className="px-2 py-1">
            <SidebarMenuButton
              className="rounded-md bg-[#e9ecef] p-6"
              asChild
              isActive={isActive("/events")}
            >
              <Link href="/events">
                <BsCalendar2EventFill
                  style={{ width: "26px", height: "26px" }}
                />
                <span className="text-lg">Events</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem className="px-2 py-1">
            <SidebarMenuButton
              className="rounded-md bg-[#e9ecef] p-6"
              asChild
              isActive={isActive("/donations")}
            >
              <Link href="/donations">
                <BiSolidDonateBlood style={{ width: "32px", height: "32px" }} />
                <span className="text-lg">Donation History</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem className="px-2 py-1">
            <SidebarMenuButton
              className="rounded-md bg-[#e9ecef] p-6"
              asChild
              isActive={isActive("/blogs")}
            >
              <Link href="/blogs">
                <SiBlogger style={{ width: "32px", height: "32px" }} />
                <span className="text-lg">Blogs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      {/* <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/settings")}>
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}

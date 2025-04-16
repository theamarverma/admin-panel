"use client";
import "../styles/globals.css";
import type React from "react";

import localFont from "next/font/local";

const aktivGrotesk = localFont({
  src: "../../public/fonts/AktivGroteskRegular.woff",
  display: "swap",
});

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AdminSidebar } from "./_components/AdminSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={aktivGrotesk.className} lang="en" suppressHydrationWarning>
      <head>
        <title>Admin Panel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="">
        <SidebarProvider>
          <AdminSidebar />
          <SidebarInset>
            {/* sidebar Header */}
            <header className="flex h-16 items-center justify-between border-b-2 bg-[#FDFAF6] px-6">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="h-8 w-8 hover:bg-black hover:text-yellow-300" />
              </div>
              <div className="flex w-full items-center justify-center text-3xl font-bold">
                {" "}
                ADMIN PANEL
              </div>
            </header>
            {/* body */}
            <main className="flex-1 bg-[#FDFAF6] p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <ToastContainer />
      </body>
    </html>
  );
}

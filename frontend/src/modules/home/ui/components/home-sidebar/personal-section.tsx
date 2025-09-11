"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useAuth, useClerk } from "@clerk/nextjs";
import { HistoryIcon, ListVideoIcon, ThumbsUpIcon } from "lucide-react";
import Link from "next/link";

const items = [
  {
    title: "History",
    url: "/playlists/history",
    icon: HistoryIcon,
    auth: true,
  },
  {
    title: "Liked videos",
    url: "/playlists/liked",
    icon: ThumbsUpIcon,
    auth: true,
  },
  {
    title: "All playlists",
    url: "/playlists",
    icon: ListVideoIcon,
    auth: true,
  },
];

function PersonalSection() {
  const { userId, isSignedIn } = useAuth();
  const clerk = useClerk();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>You</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(({ icon: Icon, title, url, auth }) => (
            <SidebarMenuItem key={title}>
              <SidebarMenuButton
                tooltip={title}
                asChild
                isActive={false}
                onClick={(e) => {
                  if (!isSignedIn && auth) {
                    e.preventDefault();
                    return clerk.openSignIn();
                  }
                }}
              >
                <Link href={url} className="flex items-center gap-4">
                  <Icon />
                  <span className="text-sm">{title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export default PersonalSection;

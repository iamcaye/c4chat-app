"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { trpc } from "@/utils/trpc/client"
import { useAuth } from "@clerk/nextjs"
import { ChevronRight, LoaderCircle, MessageSquareIcon } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export function NavMain() {
  const threadsQuery = trpc.llm.getThreads.useQuery();
  const threads = threadsQuery.data;
  const isLoading = threadsQuery.isLoading;
  const utils = trpc.useUtils();
  const session = useAuth();

  useEffect(() => {
    // Invalidate threads cache when component mounts
    utils.llm.getThreads.invalidate();
  }, [utils.llm.getThreads, session.userId]);


  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible
          key="chats"
          asChild
          defaultOpen={true}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip="Chats">
                <MessageSquareIcon className="h-4 w-4" />
                <span>Chats</span>
                {isLoading
                  ? <LoaderCircle className="ml-auto h-4 w-4 animate-spin transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  : <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                }

              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {threads?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild>
                      <Link href={`/chat/${subItem.id}`}>
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}

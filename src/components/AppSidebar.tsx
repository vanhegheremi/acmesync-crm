import { Home, Calendar, ShoppingBag, Factory, Plus, Activity } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, Link } from "react-router-dom";
import himytLogo from "@/assets/himyt-logo.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Accueil", url: "/", icon: Home },
  { title: "Aujourd'hui", url: "/today", icon: Calendar },
  { title: "Pipeline Particuliers", url: "/pipeline/tryon", icon: ShoppingBag },
  { title: "Pipeline Professionnels", url: "/pipeline/himyt", icon: Factory },
  { title: "Activités", url: "/activities", icon: Activity },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        {!isCollapsed && (
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src={himytLogo} alt="HIMYT Logo" className="h-10 w-auto" />
          </Link>
        )}
        {isCollapsed && (
          <Link to="/" className="flex justify-center hover:opacity-80 transition-opacity">
            <img src={himytLogo} alt="HIMYT Logo" className="h-8 w-8 object-contain" />
          </Link>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Actions rapides</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/add-lead?type=particuliers"
                    className="hover:bg-muted/50"
                  >
                    <Plus className="h-4 w-4" />
                    {!isCollapsed && <span>Nouveau artisan indép.</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/add-lead?type=professionnels"
                    className="hover:bg-muted/50"
                  >
                    <Plus className="h-4 w-4" />
                    {!isCollapsed && <span>Nouvelle entreprise</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

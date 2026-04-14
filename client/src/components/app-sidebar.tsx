import { LayoutDashboard, Table, BarChart3, Shield, Download } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { apiRequest } from "@/lib/queryClient";

const navItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Dataset", url: "/table", icon: Table },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function AppSidebar() {
  const [location] = useLocation();
  const { data: stats } = useQuery<{ totalSites: number }>({ queryKey: ["/api/stats"] });

  const handleExportCSV = async () => {
    try {
      const res = await apiRequest("GET", "/api/export/csv");
      const blob = await res.blob();
      triggerDownload(blob, "benign_websites_eu.csv");
    } catch (e) {
      console.error("CSV export failed", e);
    }
  };

  const handleExportJSON = async () => {
    try {
      const res = await apiRequest("GET", "/api/export/json");
      const blob = await res.blob();
      triggerDownload(blob, "benign_websites_eu.json");
    } catch (e) {
      console.error("JSON export failed", e);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">PhishGuard</div>
            <div className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">EU Dataset</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono tracking-wider uppercase">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono tracking-wider uppercase">Export</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleExportCSV} data-testid="button-export-csv">
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Export CSV</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleExportJSON} data-testid="button-export-json">
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Export JSON</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-[10px] font-mono text-muted-foreground">
          v1.2 · {stats?.totalSites ?? "..."} records · All benign
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

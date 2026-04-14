import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Globe,
  ShieldCheck,
  Lock,
  Layers,
  MapPin,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const CHART_COLORS = [
  "hsl(186, 70%, 44%)",
  "hsl(160, 45%, 50%)",
  "hsl(210, 50%, 58%)",
  "hsl(38, 65%, 58%)",
  "hsl(280, 40%, 58%)",
  "hsl(340, 50%, 55%)",
  "hsl(100, 40%, 45%)",
  "hsl(25, 60%, 55%)",
  "hsl(200, 55%, 45%)",
  "hsl(60, 50%, 45%)",
];

function KPICard({
  title,
  value,
  icon: Icon,
  suffix,
  loading,
}: {
  title: string;
  value: number | string;
  icon: any;
  suffix?: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
          <Icon className="h-4 w-4 text-primary/60" />
        </div>
        <div className="flex items-baseline gap-1">
          <span
            className="text-2xl font-semibold tabular-nums"
            style={{ fontVariantNumeric: "tabular-nums lining-nums" }}
          >
            {value}
          </span>
          {suffix && (
            <span className="text-xs text-muted-foreground">{suffix}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-md px-3 py-2 shadow-lg">
        <p className="text-xs font-mono text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{payload[0].value} sites</p>
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<{
    total: number;
    categories: number;
    countries: number;
    tlsEnabled: number;
    avgAge: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const { data: categoryData } = useQuery<
    { category: string; count: number }[]
  >({
    queryKey: ["/api/charts/categories"],
  });

  const { data: countryData } = useQuery<
    { country: string; countryCode: string; count: number }[]
  >({
    queryKey: ["/api/charts/countries"],
  });

  const { data: yearData } = useQuery<{ year: number; count: number }[]>({
    queryKey: ["/api/charts/years"],
  });

  const { data: languageData } = useQuery<
    { language: string; count: number }[]
  >({
    queryKey: ["/api/charts/languages"],
  });

  const { data: websites } = useQuery<any[]>({
    queryKey: ["/api/websites"],
  });

  const topCountries = countryData?.slice(0, 8) || [];
  const recentSites = websites?.slice(-5).reverse() || [];

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">
          Dataset Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Curated benign websites from major European regions for phishing
          detection benchmarks
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <KPICard
          title="Total Sites"
          value={stats?.total ?? 0}
          icon={Globe}
          loading={statsLoading}
        />
        <KPICard
          title="Categories"
          value={stats?.categories ?? 0}
          icon={Layers}
          loading={statsLoading}
        />
        <KPICard
          title="Countries"
          value={stats?.countries ?? 0}
          icon={MapPin}
          loading={statsLoading}
        />
        <KPICard
          title="TLS Enabled"
          value={stats ? `${Math.round((stats.tlsEnabled / stats.total) * 100)}%` : "0%"}
          icon={Lock}
          loading={statsLoading}
        />
        <KPICard
          title="Avg Age"
          value={stats?.avgAge ?? 0}
          icon={Clock}
          suffix="yrs"
          loading={statsLoading}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Sites by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              {categoryData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    layout="vertical"
                    margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="category"
                      width={110}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                      barSize={18}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="w-full h-full" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Country Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              {topCountries.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topCountries}
                    margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                  >
                    <XAxis
                      dataKey="countryCode"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                      {topCountries.map((_, index) => (
                        <Cell
                          key={index}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="w-full h-full" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Establishment Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              {yearData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={yearData}
                    margin={{ top: 4, right: 16, bottom: 0, left: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorCount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#colorCount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="w-full h-full" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Language Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              {languageData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={languageData}
                      dataKey="count"
                      nameKey="language"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {languageData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-popover border border-border rounded-md px-3 py-2 shadow-lg">
                              <p className="text-xs font-mono text-muted-foreground">
                                {payload[0].name}
                              </p>
                              <p className="text-sm font-semibold">
                                {payload[0].value} sites
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="w-full h-full" />
              )}
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-2 mt-2">
              {languageData?.slice(0, 6).map((lang, i) => (
                <div key={lang.language} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[i] }}
                  />
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">
                    {lang.language}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Labels benign status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-sm font-medium">All entries verified benign</div>
                <div className="text-xs text-muted-foreground">
                  Ready for use as ground truth in phishing detection pipelines
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="font-mono text-[10px]">
              LABEL: BENIGN
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

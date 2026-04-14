import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Treemap,
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

interface Website {
  id: number;
  domain: string;
  url: string;
  country: string;
  countryCode: string;
  city: string;
  category: string;
  subcategory: string;
  language: string;
  tls: boolean;
  registrar: string;
  yearEstablished: number;
  description: string;
  label: string;
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-md px-3 py-2 shadow-lg">
        <p className="text-xs font-mono text-muted-foreground">{label || payload[0]?.name}</p>
        <p className="text-sm font-semibold">{payload[0].value} sites</p>
      </div>
    );
  }
  return null;
}

export default function Analytics() {
  const { data: websites = [] } = useQuery<Website[]>({
    queryKey: ["/api/websites"],
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

  const { data: languageData } = useQuery<
    { language: string; count: number }[]
  >({
    queryKey: ["/api/charts/languages"],
  });

  // Derived analytics
  const registrarData = websites.reduce(
    (acc, w) => {
      const existing = acc.find((r) => r.registrar === w.registrar);
      if (existing) existing.count++;
      else acc.push({ registrar: w.registrar, count: 1 });
      return acc;
    },
    [] as { registrar: string; count: number }[]
  );
  registrarData.sort((a, b) => b.count - a.count);

  const subcategoryData = websites.reduce(
    (acc, w) => {
      const key = `${w.category} / ${w.subcategory}`;
      const existing = acc.find((s) => s.name === key);
      if (existing) existing.count++;
      else acc.push({ name: key, count: 1 });
      return acc;
    },
    [] as { name: string; count: number }[]
  );
  subcategoryData.sort((a, b) => b.count - a.count);

  // City data
  const cityData = websites.reduce(
    (acc, w) => {
      const existing = acc.find((c) => c.city === w.city);
      if (existing) existing.count++;
      else acc.push({ city: w.city, country: w.countryCode, count: 1 });
      return acc;
    },
    [] as { city: string; country: string; count: number }[]
  );
  cityData.sort((a, b) => b.count - a.count);

  // TLD analysis
  const tldData = websites.reduce(
    (acc, w) => {
      const parts = w.domain.split(".");
      const tld = "." + parts[parts.length - 1];
      const existing = acc.find((t) => t.tld === tld);
      if (existing) existing.count++;
      else acc.push({ tld, count: 1 });
      return acc;
    },
    [] as { tld: string; count: number }[]
  );
  tldData.sort((a, b) => b.count - a.count);

  // Age distribution buckets
  const ageBuckets = [
    { name: "0-5y", min: 0, max: 5, count: 0 },
    { name: "6-10y", min: 6, max: 10, count: 0 },
    { name: "11-15y", min: 11, max: 15, count: 0 },
    { name: "16-20y", min: 16, max: 20, count: 0 },
    { name: "21-25y", min: 21, max: 25, count: 0 },
    { name: "26-30y", min: 26, max: 30, count: 0 },
    { name: "30+y", min: 31, max: 100, count: 0 },
  ];
  websites.forEach((w) => {
    const age = 2026 - w.yearEstablished;
    const bucket = ageBuckets.find((b) => age >= b.min && age <= b.max);
    if (bucket) bucket.count++;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">
          Dataset Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Deep-dive analysis for phishing detection model training and
          benchmarking
        </p>
      </div>

      {/* Row 1: Registrar + TLD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Registrar Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Domain Registrars
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {registrarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={registrarData.slice(0, 10)}
                    layout="vertical"
                    margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="registrar"
                      width={140}
                      tick={{
                        fontSize: 10,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="count"
                      radius={[0, 4, 4, 0]}
                      barSize={16}
                    >
                      {registrarData.slice(0, 10).map((_, i) => (
                        <Cell
                          key={i}
                          fill={CHART_COLORS[i % CHART_COLORS.length]}
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

        {/* TLD Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Top-Level Domains
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {tldData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tldData.slice(0, 12)}
                      dataKey="count"
                      nameKey="tld"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                    >
                      {tldData.slice(0, 12).map((_, index) => (
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
                                {payload[0].value} domains
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
            <div className="flex flex-wrap gap-2 mt-2">
              {tldData.slice(0, 8).map((tld, i) => (
                <div key={tld.tld} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[i] }}
                  />
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {tld.tld} ({tld.count})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Age + Top Cities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Age Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Domain Age Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ageBuckets}
                  margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    barSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground mt-2">
              Most domains are 20-30 years old, reflecting established
              institutional presence
            </p>
          </CardContent>
        </Card>

        {/* Top Cities */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Top Cities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              {cityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={cityData.slice(0, 10)}
                    layout="vertical"
                    margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="city"
                      width={100}
                      tick={{
                        fontSize: 11,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--chart-2))"
                      radius={[0, 4, 4, 0]}
                      barSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="w-full h-full" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Category Radar + Subcategory breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Radar */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Category Coverage Radar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {categoryData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={categoryData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="category"
                      tick={{
                        fontSize: 9,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                    />
                    <Radar
                      dataKey="count"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="w-full h-full" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subcategory Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Subcategory Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] overflow-y-auto pr-2">
              <div className="space-y-1.5">
                {subcategoryData.map((sc, i) => {
                  const maxCount = subcategoryData[0]?.count || 1;
                  const pct = (sc.count / maxCount) * 100;
                  return (
                    <div key={sc.name} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground w-[180px] truncate flex-shrink-0">
                        {sc.name}
                      </span>
                      <div className="flex-1 h-4 bg-muted/50 rounded-sm overflow-hidden">
                        <div
                          className="h-full rounded-sm transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor:
                              CHART_COLORS[i % CHART_COLORS.length],
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-mono tabular-nums text-muted-foreground w-6 text-right">
                        {sc.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Notes */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
            Dataset Usage Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px] font-mono">
                  Training
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Use as negative (benign) examples in binary classifiers. Mix with
                known phishing datasets like PhishTank or OpenPhish for balanced
                training.
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px] font-mono">
                  Benchmarking
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Measure false positive rates of LLM-based or classifier-based
                phishing detectors against this verified benign set.
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px] font-mono">
                  Comparison
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Compare feature distributions (TLD, domain age, TLS status,
                registrar) between benign and phishing datasets to identify
                discriminative signals.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

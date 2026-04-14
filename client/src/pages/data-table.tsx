import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  ExternalLink,
  Lock,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";

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

const CATEGORY_COLORS: Record<string, string> = {
  "Government": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "News & Media": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "Banking & Finance": "bg-green-500/10 text-green-600 dark:text-green-400",
  "Education": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  "Healthcare": "bg-red-500/10 text-red-600 dark:text-red-400",
  "Transport": "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  "E-Commerce": "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  "Travel": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  "Technology": "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  "Culture": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "Industry": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

const PAGE_SIZE = 20;

export default function DataTable() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [selectedSite, setSelectedSite] = useState<Website | null>(null);

  const { data: websites = [], isLoading } = useQuery<Website[]>({
    queryKey: ["/api/websites"],
  });

  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ["/api/categories"],
  });

  const { data: countries = [] } = useQuery<
    { country: string; countryCode: string; count: number }[]
  >({
    queryKey: ["/api/countries"],
  });

  // Filter
  const filtered = websites.filter((w) => {
    const matchesSearch =
      !search ||
      w.domain.toLowerCase().includes(search.toLowerCase()) ||
      w.description.toLowerCase().includes(search.toLowerCase()) ||
      w.country.toLowerCase().includes(search.toLowerCase()) ||
      w.city.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || w.category === categoryFilter;
    const matchesCountry =
      countryFilter === "all" || w.country === countryFilter;
    return matchesSearch && matchesCategory && matchesCountry;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setCountryFilter("all");
    setPage(0);
  };

  const hasFilters = search || categoryFilter !== "all" || countryFilter !== "all";

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Dataset Browser</h1>
        <p className="text-sm text-muted-foreground">
          Browse, search, and filter the full benign website dataset
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search domains, countries, cities..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="pl-9 h-9 text-sm"
                data-testid="input-search"
              />
            </div>
            <div className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(v) => {
                setCategoryFilter(v);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-[160px] h-9 text-sm" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={countryFilter}
              onValueChange={(v) => {
                setCountryFilter(v);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-[160px] h-9 text-sm" data-testid="select-country">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((c) => (
                  <SelectItem key={c.country} value={c.country}>
                    {c.country} ({c.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-9 text-xs"
                data-testid="button-clear-filters"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span>
          {filtered.length} results{" "}
          {hasFilters && `(filtered from ${websites.length})`}
        </span>
        <span>
          Page {page + 1} of {totalPages || 1}
        </span>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] font-mono uppercase tracking-wider w-[200px]">
                    Domain
                  </TableHead>
                  <TableHead className="text-[10px] font-mono uppercase tracking-wider">
                    Category
                  </TableHead>
                  <TableHead className="text-[10px] font-mono uppercase tracking-wider">
                    Country
                  </TableHead>
                  <TableHead className="text-[10px] font-mono uppercase tracking-wider">
                    City
                  </TableHead>
                  <TableHead className="text-[10px] font-mono uppercase tracking-wider">
                    Lang
                  </TableHead>
                  <TableHead className="text-[10px] font-mono uppercase tracking-wider">
                    TLS
                  </TableHead>
                  <TableHead className="text-[10px] font-mono uppercase tracking-wider">
                    Year
                  </TableHead>
                  <TableHead className="text-[10px] font-mono uppercase tracking-wider">
                    Label
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j}>
                          <div className="h-4 bg-muted rounded animate-pulse" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-sm text-muted-foreground"
                    >
                      No websites match your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((w) => (
                    <TableRow
                      key={w.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => setSelectedSite(w)}
                      data-testid={`row-website-${w.id}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-medium truncate max-w-[180px]">
                            {w.domain}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-mono ${CATEGORY_COLORS[w.category] || ""}`}
                        >
                          {w.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          <span className="text-muted-foreground text-xs font-mono mr-1">
                            {w.countryCode}
                          </span>
                          {w.country}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{w.city}</TableCell>
                      <TableCell>
                        <span className="text-xs font-mono uppercase text-muted-foreground">
                          {w.language}
                        </span>
                      </TableCell>
                      <TableCell>
                        {w.tls ? (
                          <Lock className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <span className="text-xs text-red-500">No</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm tabular-nums font-mono">
                          {w.yearEstablished}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-mono bg-green-500/10 text-green-600 dark:text-green-400"
                        >
                          {w.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            data-testid="button-prev-page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
            const pageNum =
              totalPages <= 7
                ? i
                : page < 3
                  ? i
                  : page > totalPages - 4
                    ? totalPages - 7 + i
                    : page - 3 + i;
            return (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 text-xs font-mono"
                onClick={() => setPage(pageNum)}
              >
                {pageNum + 1}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            data-testid="button-next-page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedSite}
        onOpenChange={() => setSelectedSite(null)}
      >
        {selectedSite && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="font-mono">{selectedSite.domain}</span>
                <Badge
                  variant="secondary"
                  className="text-[10px] font-mono bg-green-500/10 text-green-600 dark:text-green-400"
                >
                  {selectedSite.label}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {selectedSite.description}
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">
                    URL
                  </span>
                  <a
                    href={selectedSite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1 font-mono text-xs break-all"
                  >
                    {selectedSite.url}
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">
                    Category
                  </span>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] font-mono ${CATEGORY_COLORS[selectedSite.category] || ""}`}
                  >
                    {selectedSite.category} / {selectedSite.subcategory}
                  </Badge>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">
                    Location
                  </span>
                  <span>
                    {selectedSite.city}, {selectedSite.country}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">
                    Language
                  </span>
                  <span className="uppercase font-mono">
                    {selectedSite.language}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">
                    TLS/SSL
                  </span>
                  <span className="flex items-center gap-1">
                    {selectedSite.tls ? (
                      <>
                        <Lock className="h-3 w-3 text-green-500" />
                        Enabled
                      </>
                    ) : (
                      "Disabled"
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">
                    Established
                  </span>
                  <span className="font-mono">
                    {selectedSite.yearEstablished}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">
                    Registrar
                  </span>
                  <span className="text-sm">{selectedSite.registrar}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

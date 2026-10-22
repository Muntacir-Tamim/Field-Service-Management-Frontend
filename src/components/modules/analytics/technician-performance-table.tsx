"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ADMIN_ROUTES } from "@/routes";
import type { LeaderboardSortBy, TechnicianLeaderboardRow } from "@/types";
import { getInitials } from "@/utils";
import RatingStars from "../feedback/rating-stars";

const SKELETON_ROWS = ["a", "b", "c", "d", "e"];

interface TechnicianPerformanceTableProps {
  rows: TechnicianLeaderboardRow[];
  isLoading?: boolean;
  // যে column এ sort হয়েছে সেটা bold হয়
  sortBy?: LeaderboardSortBy;
}

// ADMIN: technician leaderboard। rank = backend এর দেওয়া ক্রম
export default function TechnicianPerformanceTable({
  rows,
  isLoading = false,
  sortBy = "completedJobs",
}: TechnicianPerformanceTableProps) {
  const strong = (column: LeaderboardSortBy) =>
    sortBy === column ? "font-semibold" : "";

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Technician</TableHead>
            <TableHead className="hidden md:table-cell">Experience</TableHead>
            <TableHead className="text-right">Jobs</TableHead>
            <TableHead className="hidden text-right sm:table-cell">
              Labor hours
            </TableHead>
            <TableHead>Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? SKELETON_ROWS.map((id) => (
                <TableRow key={id}>
                  <TableCell>
                    <Skeleton className="h-4 w-5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-40" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-4 w-8" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="ml-auto h-4 w-10" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                </TableRow>
              ))
            : rows.map((row, index) => (
                <TableRow key={row.technicianId}>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`${ADMIN_ROUTES.technicians}/${row.technicianId}`}
                      className="flex items-center gap-3 hover:underline"
                    >
                      <Avatar>
                        <AvatarImage src={row.imageUrl} alt={row.name} />
                        <AvatarFallback>{getInitials(row.name)}</AvatarFallback>
                      </Avatar>
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {row.name}
                        </span>
                        <Badge
                          variant={row.isAvailable ? "success" : "muted"}
                          className="mt-0.5"
                        >
                          {row.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {row.experienceYears} yr
                  </TableCell>
                  <TableCell
                    className={`text-right tabular-nums ${strong("completedJobs")}`}
                  >
                    {row.completedJobs}
                  </TableCell>
                  <TableCell
                    className={`hidden text-right tabular-nums sm:table-cell ${strong("laborHours")}`}
                  >
                    {row.laborHours.toFixed(1)}
                  </TableCell>
                  <TableCell className={strong("averageRating")}>
                    {row.averageRating === null ? (
                      <span className="text-muted-foreground">No reviews</span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <RatingStars value={row.averageRating} size="sm" />
                        <span className="tabular-nums">
                          {row.averageRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({row.totalReviews})
                        </span>
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}

"use client";

import { ClipboardCheckIcon } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/common/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ADMIN_ROUTES } from "@/routes";
import type { Technician } from "@/types";
import { formatDate, getInitials } from "@/utils";

const SKELETON_ROWS = ["a", "b", "c", "d", "e"];
const VISIBLE_SKILLS = 2;

interface TechnicianTableProps {
  technicians: Technician[];
  isLoading?: boolean;
  onReview: (technician: Technician) => void;
}

export default function TechnicianTable({
  technicians,
  isLoading = false,
  onReview,
}: TechnicianTableProps) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Technician</TableHead>
            <TableHead className="hidden lg:table-cell">Skills</TableHead>
            <TableHead className="hidden md:table-cell">Experience</TableHead>
            <TableHead className="hidden sm:table-cell">Availability</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden xl:table-cell">Applied</TableHead>
            <TableHead className="w-40 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? SKELETON_ROWS.map((id) => (
                <TableRow key={id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-8 rounded-full" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-7 w-24" />
                  </TableCell>
                </TableRow>
              ))
            : technicians.map((technician) => {
                const needsReview =
                  technician.verificationStatus === "PENDING" &&
                  technician.user.emailVerified;
                const extraSkills = technician.skills.length - VISIBLE_SKILLS;

                return (
                  <TableRow key={technician.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {technician.user.imageUrl ? (
                            <AvatarImage
                              src={technician.user.imageUrl}
                              alt={technician.name}
                            />
                          ) : null}
                          <AvatarFallback>
                            {getInitials(technician.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <Link
                            href={`${ADMIN_ROUTES.technicians}/${technician.id}`}
                            className="block truncate font-medium hover:underline"
                          >
                            {technician.name}
                          </Link>
                          <span className="block truncate text-xs text-muted-foreground">
                            {technician.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {technician.skills
                          .slice(0, VISIBLE_SKILLS)
                          .map((entry) => (
                            <Badge key={entry.skill.id} variant="outline">
                              {entry.skill.name}
                            </Badge>
                          ))}
                        {extraSkills > 0 ? (
                          <Badge variant="muted">+{extraSkills}</Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {technician.experienceYears} yr
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant={technician.isAvailable ? "success" : "muted"}
                      >
                        {technician.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        <StatusBadge
                          kind="technician"
                          value={technician.verificationStatus}
                        />
                        {!technician.user.emailVerified ? (
                          <span className="text-xs text-muted-foreground">
                            Email not verified
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground xl:table-cell">
                      {formatDate(technician.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`${ADMIN_ROUTES.technicians}/${technician.id}`}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                          )}
                        >
                          View
                        </Link>
                        {needsReview ? (
                          <Button
                            size="sm"
                            onClick={() => onReview(technician)}
                          >
                            <ClipboardCheckIcon />
                            Review
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </div>
  );
}

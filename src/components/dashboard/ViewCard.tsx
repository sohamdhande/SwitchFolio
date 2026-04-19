"use client";

import { View } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Layers, MoreVertical, Pencil, Trash2, ArrowRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ViewCard({
  view,
  onEdit,
  onDelete,
}: {
  view: View;
  onEdit: (view: View) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 pr-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Layers className="h-5 w-5 text-gray-500" />
            {view.name}
          </CardTitle>
          <div className="text-sm text-muted-foreground font-mono">/{view.slug}</div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(view)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => onDelete(view.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-4 space-y-4">
        {view.description && (
          <CardDescription className="line-clamp-2 flex-1">
            {view.description}
          </CardDescription>
        )}
        <div className="flex items-center justify-between mt-auto pt-4">
          <Badge variant="secondary">
            {view._count?.projects || 0} Projects
          </Badge>
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/views/${view.id}`}>
              Manage Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

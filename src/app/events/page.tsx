"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useEventStore from "@/stores/eventStore";
import {
  Plus,
  Calendar,
  MapPin,
  Clock,
  Search,
  Trash2,
  Edit,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "free" | "paid">("all");
  const { events, deleteEvent } = useEventStore();

  const handleDelete = (id: string) => {
    deleteEvent(id);
    toast.success("Event deleted successfully!");
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      (filterType === "free" && event.pricingType === "free") ||
      (filterType === "paid" && event.pricingType === "paid");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <Button asChild>
          <Link href="/events/add">
            <Plus className="mr-2 h-4 w-4" />
            Add New Event
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event List</CardTitle>
          <CardDescription>
            {filteredEvents.length} event{filteredEvents.length !== 1 && "s"}{" "}
            found
          </CardDescription>
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-grow">
              <Input
                placeholder="Search events by title or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
            </div>
            <Select
              value={filterType}
              onValueChange={(value: "all" | "free" | "paid") =>
                setFilterType(value)
              }
            >
              <SelectTrigger className="w-[180px] bg-[#e9ecef] text-black hover:bg-[#FDFAF6] focus:bg-[#FDFAF6] data-[state=open]:bg-[#e9ecef]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent className="border-yellow-300 bg-[#e9ecef]">
                <SelectItem
                  value="all"
                  className="hover:bg-[#FDFAF6] focus:bg-[#FDFAF6] data-[state=highlighted]:bg-[#FDFAF6]"
                >
                  All Events
                </SelectItem>
                <SelectItem
                  value="free"
                  className="hover:bg-[#FDFAF6] focus:bg-[#FDFAF6] data-[state=highlighted]:bg-[#FDFAF6]"
                >
                  Free Events
                </SelectItem>
                <SelectItem
                  value="paid"
                  className="hover:bg-[#FDFAF6] focus:bg-[#FDFAF6] data-[state=highlighted]:bg-[#FDFAF6]"
                >
                  Paid Events
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-auto h-[300px] bg-muted">
                    <Image
                      className="h-full w-full object-cover"
                      src={event.image as unknown as string}
                      alt="Event Image"
                      width={400}
                      height={500}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{event.startDate}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>
                          {event.startTime} - {event.endTime}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {event.pricingType === "free"
                          ? "Free"
                          : `$${event.price}`}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <Link href={`/events/edit/${event.id}`}>
                          <Edit className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                          >
                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the event.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(event.id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">
                No events found matching your search and filter.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

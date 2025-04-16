"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, CalendarIcon, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import useBlogStore, { Blog } from "@/stores/blogStore";
import { useState, useMemo } from "react";
import { format, isAfter, isBefore } from "date-fns";
import { toast } from "react-toastify";

export default function BlogsPage() {
  const { blogs, deleteBlog } = useBlogStore();
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Explicitly type the date states
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  // Filtered blogs based on search and date range
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      // Search filter (case-insensitive, search in title)
      const matchesSearch = blog.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Date range filter with explicit null checks
      const blogDate = new Date(blog.date);
      const isWithinDateRange =
        (fromDate === null || blogDate >= fromDate) &&
        (toDate === null || blogDate <= toDate);

      return matchesSearch && isWithinDateRange;
    });
  }, [blogs, searchTerm, fromDate, toDate]);

  const handleDeleteBlog = () => {
    if (blogToDelete) {
      deleteBlog(blogToDelete.id);
      toast.success("Blog Deleted");
      setBlogToDelete(null);
    }
  };

  // Reset date filters
  const resetDateFilters = () => {
    setFromDate(null);
    setToDate(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
        <Button asChild>
          <Link href="/blogs/add">
            <Plus className="mr-2 h-4 w-4" />
            Add New Blog
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Blog Management</CardTitle>
          <CardDescription>View all Blogs Here</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Section */}
          <div className="mb-6 flex items-center space-x-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <Input
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
            </div>

            {/* From Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-1/4 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? (
                    format(fromDate, "LLL dd, y")
                  ) : (
                    <span>From Date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fromDate as Date | undefined}
                  onSelect={(date) => {
                    // Ensure the 'from' date is not after the 'to' date
                    if (date && (!toDate || !isAfter(date, toDate))) {
                      setFromDate(date);
                    }
                  }}
                  disabled={(date: Date) =>
                    Boolean(toDate && isAfter(date, toDate))
                  }
                />
              </PopoverContent>
            </Popover>

            {/* To Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-1/4 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "LLL dd, y") : <span>To Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={toDate as Date | undefined}
                  onSelect={(date) => {
                    // Ensure the 'to' date is not before the 'from' date
                    if (date && (!fromDate || !isBefore(date, fromDate))) {
                      setToDate(date);
                    }
                  }}
                  disabled={(date: Date) =>
                    Boolean(fromDate && isBefore(date, fromDate))
                  }
                />
              </PopoverContent>
            </Popover>

            {/* Reset Filters Button */}
            {(fromDate || toDate || searchTerm) && (
              <Button
                variant="ghost"
                onClick={() => {
                  resetDateFilters();
                  setSearchTerm("");
                }}
              >
                Reset Filters
              </Button>
            )}
          </div>

          {/* Blogs Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog: Blog) => (
                <Card key={blog.id} className="flex flex-col">
                  <div className="relative h-[15rem] w-full">
                    {" "}
                    <Image
                      src={blog.image || "/placeholder.svg"}
                      alt={blog.title}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <CardContent className="space-y-2">
                    <CardTitle className="mt-4 line-clamp-2">
                      {blog.title}
                    </CardTitle>
                    <CardDescription>
                      {new Date(blog.date).toLocaleDateString()}
                    </CardDescription>
                    <div className="mt-4 flex w-full justify-between">
                      {" "}
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="mr-2 w-1/2"
                      >
                        <Link href={`/blogs/edit/${blog.id}`}>
                          <Edit className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            className="w-1/2"
                            variant="destructive"
                            size="sm"
                            onClick={() => setBlogToDelete(blog)}
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
                              permanently delete the blog post &quot;
                              {blogToDelete?.title}&quot;.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteBlog}>
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
              <div className="col-span-full py-10 text-center text-gray-500">
                No blogs found matching your search or date range.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

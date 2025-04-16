"use client";
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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

interface User {
  name: string;
  email: string;
  joinedDate: string;
}

const initialCustomers = [
  {
    name: "John Smith",
    email: "john.smith@example.com",
    joinedDate: "2025-01-15",
  },
  {
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    joinedDate: "2025-01-20",
  },
  {
    name: "Michael Brown",
    email: "mbrown@example.com",
    joinedDate: "2025-02-05",
  },
  {
    name: "Emily Davis",
    email: "emily.davis@example.com",
    joinedDate: "2025-02-10",
  },
  {
    name: "Robert Wilson",
    email: "rwilson@example.com",
    joinedDate: "2025-02-15",
  },
  {
    name: "Jennifer Lee",
    email: "jlee@example.com",
    joinedDate: "2025-02-20",
  },
  {
    name: "David Miller",
    email: "dmiller@example.com",
    joinedDate: "2025-03-01",
  },
  {
    name: "Lisa Anderson",
    email: "lisa.a@example.com",
    joinedDate: "2025-03-10",
  },
];

export default function UsersPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [customerToDelete, setCustomerToDelete] = useState<User | null>(null);
  const itemsPerPage = 5;

  // Filter customers based on search term
  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [customers, searchTerm]);

  // Paginate filtered customers
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Handle customer deletion
  const handleDeleteCustomer = () => {
    if (customerToDelete) {
      setCustomers(
        customers.filter(
          (customer) => customer.email !== customerToDelete.email,
        ),
      );
      setCustomerToDelete(null);
      // Reset page if needed
      if (paginatedCustomers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>Manage your user database.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Input
              className="pl-10"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
          </div>
          <Table>
            <TableHeader className="bg-[#FDFAF6]">
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="w-[80px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((user: User, index: number) => (
                <TableRow key={user.email}>
                  <TableCell className="font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {new Date(user.joinedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-red-700 text-white hover:bg-red-600 hover:text-yellow-100"
                          onClick={() => setCustomerToDelete(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete user</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the user account for {customerToDelete?.name}{" "}
                            ({customerToDelete?.email}).
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteCustomer}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className="hover:bg-[#e9ecef]"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(Math.max(1, currentPage - 1));
                    }}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      className="hover:bg-[#e9ecef]"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(i + 1);
                      }}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    className="hover:bg-[#e9ecef]"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(Math.min(totalPages, currentPage + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

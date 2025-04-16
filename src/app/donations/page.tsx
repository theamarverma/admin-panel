"use client";
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search } from "lucide-react";

// Sample donation data
const donations = [
  {
    name: "John Smith",
    email: "john.smith@example.com",
    amount: 250.0,
    date: "2025-03-15",
    message: "Keep up the great work!",
    donationType: "one-off donation",
  },
  {
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    amount: 100.0,
    date: "2025-03-14",
    message: "Happy to support your cause.",
    donationType: "one-off donation",
  },
  {
    name: "Michael Brown",
    email: "mbrown@example.com",
    amount: 500.0,
    date: "2025-03-12",
    message: "For the children's education program.",
    donationType: "funder",
  },
  {
    name: "Emily Davis",
    email: "emily.davis@example.com",
    amount: 75.0,
    date: "2025-03-10",
    message: "",
    donationType: "donate equipment",
  },
  {
    name: "Robert Wilson",
    email: "rwilson@example.com",
    amount: 1000.0,
    date: "2025-03-08",
    message: "Annual donation for your foundation.",
    donationType: "funder",
  },
  {
    name: "Jennifer Lee",
    email: "jlee@example.com",
    amount: 150.0,
    date: "2025-03-05",
    message: "In memory of my father.",
    donationType: "donate equipment",
  },
  {
    name: "David Miller",
    email: "dmiller@example.com",
    amount: 300.0,
    date: "2025-03-03",
    message: "To support the new building project.",
    donationType: "one-off donation",
  },
  {
    name: "Lisa Anderson",
    email: "lisa.a@example.com",
    amount: 50.0,
    date: "2025-03-01",
    message: "Monthly contribution.",
    donationType: "one-off donation",
  },
];

export default function DonationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [donationTypeFilter, setDonationTypeFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique donation types for filter
  const donationTypes = [
    "ALL",
    ...new Set(donations.map((d) => d.donationType)),
  ];

  // Filter donations based on search and type
  const filteredDonations = useMemo(() => {
    return donations.filter(
      (donation) =>
        (searchTerm === "" ||
          donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (donationTypeFilter === "ALL" ||
          donation.donationType === donationTypeFilter),
    );
  }, [searchTerm, donationTypeFilter]);

  // Paginate filtered donations
  const paginatedDonations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDonations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDonations, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
          <CardDescription>View all donations received.</CardDescription>
          <div className="mb-4 flex w-full space-x-4">
            <div className="relative flex-grow">
              {" "}
              <Input
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
            </div>

            <Select
              value={donationTypeFilter}
              onValueChange={(value) => {
                setDonationTypeFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px] bg-[#e9ecef] text-black hover:bg-[#FDFAF6] focus:bg-[#FDFAF6] data-[state=open]:bg-[#e9ecef]">
                <SelectValue placeholder="Donation Type" />
              </SelectTrigger>
              <SelectContent className="border-yellow-300 bg-[#e9ecef]">
                {donationTypes.map((type) => (
                  <SelectItem
                    className="hover:bg-[#FDFAF6] focus:bg-[#FDFAF6] data-[state=highlighted]:bg-[#FDFAF6]"
                    key={type}
                    value={type}
                  >
                    {type === "ALL" ? "All Types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-[#FDFAF6]">
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Donation Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDonations.map((donation, index) => (
                <TableRow key={donation.email}>
                  <TableCell className="font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{donation.name}</TableCell>
                  <TableCell>{donation.email}</TableCell>
                  <TableCell>{donation.donationType}</TableCell>
                  <TableCell className="text-right">
                    ${donation.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {new Date(donation.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {donation.message || "—"}
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

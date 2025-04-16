"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import useProductStore from "@/stores/productStore";
import { ArrowLeft, Edit, Trash2, Upload, X } from "lucide-react";
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
import ProductVariantModal from "../_components/ProductModal";
import { DeleteConfirmationModal } from "@/app/_components/DeleteConfirmationModal";

// Zod Schema for Main Product
const formSchema = z.object({
  title: z.string().min(2, "Product title must be at least 2 characters."),
  description: z.string().optional(),
  rating: z.coerce.number().min(0).max(5),
  image: z.string().nonempty("Please upload an image"),
});

// Zod Schema for Product Variants
const variantSchema = z.object({
  sizes: z.string().nonempty("Please select a size"),
  color: z.string().nonempty("Please select a color"),
  price: z.coerce.number().min(0, "Price must be positive"),
  mrp: z.coerce.number().min(0, "MRP must be positive"),
  available: z.enum(["yes", "no"]),
});

export default function AddProductForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productVariants, setProductVariants] = useState<
    z.infer<typeof variantSchema>[]
  >([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<{
    variant: z.infer<typeof variantSchema> | null;
    index: number | null;
  }>({ variant: null, index: null });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      rating: 0,
      image: "",
    },
  });

  const { addProduct } = useProductStore();

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      if (!file || !file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        form.setValue("image", base64String);
        form.clearErrors("image");
      };
      reader.readAsDataURL(file);
    },
    [form],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 1000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  const handleVariantAdd = (variant: z.infer<typeof variantSchema>) => {
    if (currentVariant.index !== null) {
      // Update existing variant
      setProductVariants((prev) => {
        const updatedVariants = [...prev];
        updatedVariants[currentVariant.index!] = variant;
        return updatedVariants;
      });
      setCurrentVariant({ variant: null, index: null });
    } else {
      // Add new variant
      setProductVariants((prev) => [...prev, variant]);
    }
  };

  const handleEditVariant = (
    variant: z.infer<typeof variantSchema>,
    index: number,
  ) => {
    setCurrentVariant({ variant, index });
    setModalOpen(true);
  };

  const removeVariant = (indexToRemove: number) => {
    setProductVariants((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (productVariants.length === 0) {
      toast.error("Please add at least one product variant", {
        position: "top-right",
      });
      return;
    }

    // Combine main product details with variants
    const completeProductData = {
      ...values,
      variants: productVariants,
    };

    setIsSubmitting(true);

    // Add product to store
    addProduct(completeProductData);

    toast.success("Product Added Successfully!", {
      position: "top-right",
    });

    // Simulate an API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form after successful submission
      form.reset();
      setPreview(null);
      setProductVariants([]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="hover:bg-[#FDFAF6]"
          size="icon"
          asChild
        >
          <Link href="/products">
            <ArrowLeft style={{ width: "36px", height: "36px" }} />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Fill in the details for your new product.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Product Details */}
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Product Title</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="Enter product title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Rating</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Product rating from 0 to 5
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Uploader */}
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-lg">Product Image</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div
                            {...getRootProps()}
                            className={`flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed p-6 ${
                              isDragActive
                                ? "border-primary bg-primary/10"
                                : "border-border"
                            }`}
                          >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center gap-2">
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                {isDragActive
                                  ? "Drop the image here"
                                  : "Drag & drop an image here, or click to select"}
                              </p>
                            </div>
                          </div>

                          {preview && (
                            <div className="relative">
                              <div className="relative aspect-video h-48 w-full overflow-hidden rounded-md">
                                <Image
                                  src={preview}
                                  alt="Preview"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute right-2 top-2"
                                onClick={() => {
                                  setPreview(null);
                                  form.setValue("image", "");
                                }}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove image</span>
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage>
                        {fileRejections.length > 0 && (
                          <p>
                            Image must be less than 1MB and of type png, jpg, or
                            jpeg
                          </p>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                {/* Product Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description"
                          className="h-48 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Variants Section */}
              <div className="mx-auto mt-8 max-w-5xl space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        {" "}
                        <CardTitle>Product Variants</CardTitle>
                        <CardDescription>
                          Add different size and color variants for this
                          product.
                        </CardDescription>
                      </div>
                      <ProductVariantModal onVariantAdd={handleVariantAdd} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {productVariants.length > 0 ? (
                      <Table>
                        <TableHeader className="bg-[#FDFAF6]">
                          <TableRow>
                            <TableHead>S.No</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead>Sizes</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>MRP</TableHead>
                            <TableHead>Available</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {productVariants.map((variant, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{variant.color}</TableCell>
                              <TableCell>{variant.sizes}</TableCell>
                              <TableCell>₹{variant.price}</TableCell>
                              <TableCell>₹{variant.mrp}</TableCell>
                              <TableCell>
                                {variant.available === "yes" ? "Yes" : "No"}
                              </TableCell>
                              <TableCell className="space-x-2">
                                <ProductVariantModal
                                  defaultValues={variant}
                                  onVariantAdd={handleVariantAdd}
                                  triggerButton={
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() =>
                                        handleEditVariant(variant, index)
                                      }
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  }
                                />
                                <DeleteConfirmationModal
                                  onConfirm={() => removeVariant(index)}
                                  triggerButton={
                                    <Button variant="destructive" size="icon">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  }
                                  itemTitle={`${variant.color} - ${variant.sizes}`}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="rounded-md border bg-gray-50 py-8 text-center">
                        <p className="text-gray-500">
                          No variants added yet. Please add at least one
                          variant.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <Button
                  className="rounded-lg px-6 py-2 text-lg"
                  variant="outline"
                  type="button"
                  asChild
                >
                  <Link href="/products">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg px-6 py-2 text-lg"
                >
                  {isSubmitting ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

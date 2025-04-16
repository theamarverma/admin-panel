"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import Image from "next/image";
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
import ProductVariantModal from "../../_components/ProductModal";
import { DeleteConfirmationModal } from "@/app/_components/DeleteConfirmationModal";

// Fixed form schema - removed unnecessary fields that are now in variants
const formSchema = z.object({
  title: z.string().min(2, "Product title must be at least 2 characters."),
  description: z.string().optional(),
  rating: z.coerce.number().min(0).max(5),
  image: z.string().min(1, "Product image is required"),
});

// Zod Schema for Product Variants
const variantSchema = z.object({
  sizes: z.string().nonempty("Please select a size"),
  color: z.string().nonempty("Please select a color"),
  price: z.coerce.number().min(0, "Price must be positive"),
  mrp: z.coerce.number().min(0, "MRP must be positive"),
  available: z.enum(["yes", "no"]),
});

export default function EditProductForm({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();
  const { getProductById, updateProduct } = useProductStore();
  const product = getProductById(id);

  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [productVariants, setProductVariants] = useState<
    z.infer<typeof variantSchema>[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

  useEffect(() => {
    if (product) {
      // Reset the form values with existing product data
      form.reset({
        title: product.title,
        description: product.description || "",
        rating: product.rating,
        image: product.image,
      });

      // Set the variants state from the product
      if (product.variants && Array.isArray(product.variants)) {
        setProductVariants(product.variants);
      }

      // Set the image preview if it exists
      if (product.image) {
        setPreview(product.image);
      }
    }
  }, [product, form]);

  const handleVariantAdd = (variant: z.infer<typeof variantSchema>) => {
    setProductVariants((prev) => [...prev, variant]);
  };

  const handleEditVariant = (
    variant: z.infer<typeof variantSchema>,
    index: number,
  ) => {
    setCurrentVariant({ variant, index });
    setIsModalOpen(true);
  };

  const handleVariantUpdate = (
    updatedVariant: z.infer<typeof variantSchema>,
  ) => {
    if (currentVariant.index !== null) {
      setProductVariants((prev) => {
        const updatedVariants = [...prev];
        updatedVariants[currentVariant.index!] = updatedVariant;
        return updatedVariants;
      });
      // Reset editing state
      setCurrentVariant({ variant: null, index: null });
    }
  };

  const removeVariant = (indexToRemove: number) => {
    setProductVariants((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

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
      maxSize: 1000000, // 1MB
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Validation: Ensure at least one variant exists
    if (productVariants.length === 0) {
      toast.error("Please add at least one product variant");
      return;
    }

    // Combine main product details with variants
    const completeProductData = {
      ...values,
      variants: productVariants,
      id,
    };

    setIsSubmitting(true);
    try {
      updateProduct(completeProductData);
      toast.success("Product updated successfully 🎉");
      setTimeout(() => {
        router.push("/products");
      }, 1000);
    } catch (error) {
      toast.error("Failed to update product. Please try again.");
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-xl font-semibold text-gray-700">
          Product not found.
        </p>
        <Button asChild className="mt-4">
          <Link href="/products">Return to Products</Link>
        </Button>
      </div>
    );
  }

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
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Update Product</h1>
      </div>

      {/* Product Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Update the details for your product.
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Image</FormLabel>
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
                            <Input type="hidden" {...field} />
                          </div>
                          {preview && (
                            <div className="relative">
                              <div className="relative aspect-video h-60 w-full rounded-md">
                                <Image
                                  src={preview as string}
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
                          <p className="text-red-500">
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
                          className="h-60 bg-white"
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
                        <CardTitle>Product Variants</CardTitle>
                        <CardDescription>
                          Update different size and color variants for this
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
                                  onVariantAdd={handleVariantUpdate}
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
                </Card>{" "}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  asChild
                  variant="outline"
                  type="button"
                  className="rounded-lg px-6 py-2 text-base"
                >
                  <Link href="/products">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || productVariants.length === 0}
                  className="rounded-lg px-6 py-2 text-base"
                >
                  {isSubmitting ? "Updating..." : "Update Product"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

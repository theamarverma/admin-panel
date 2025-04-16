"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import Link from "next/link";
import { toast } from "react-toastify";
import useBlogStore from "@/stores/blogStore";

// Schema for each content block with required text and an optional image.
const contentBlockSchema = z.object({
  text: z.string().min(1, {
    message: "Content cannot be empty.",
  }),
  image: z.string().optional(),
});

// Main form schema now uses an array of content blocks.
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Blog title must be at least 2 characters.",
  }),
  date: z.string(),
  image: z.string().min(1, {
    message: "Please upload a blog image.",
  }),
  content: z
    .array(contentBlockSchema)
    .min(1, { message: "Please add at least one content block." }),
});

// Component for each content block
function ContentBlockField({
  index,
  remove,
  canRemove,
}: {
  index: number;
  remove: (index: number) => void;
  canRemove: boolean;
}) {
  // Use the form context to get setValue and control
  const { setValue, control } = useFormContext();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64String = event.target?.result as string;
          setPreviewImage(base64String);
          // Update the image value in the content block using setValue
          setValue(`content.${index}.image`, base64String);
        };
        reader.readAsDataURL(file);
      }
    },
    [index, setValue],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
  });

  return (
    <div className="relative rounded-md border p-4">
      <FormField
        control={control}
        name={`content.${index}.text`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Paragraph {index + 1}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={`Enter paragraph ${index + 1}`}
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormLabel>Optional Image</FormLabel>
      <div className="mt-4 flex justify-between">
        <div
          {...getRootProps()}
          className={`flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed p-4 ${
            isDragActive ? "border-primary bg-primary/10" : "border-border"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-1">
            <Upload className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? "Drop the image here"
                : "Drag & drop an image here, or click to select"}
            </p>
          </div>
        </div>
        {previewImage && (
          <div className="relative mt-2">
            <div className="relative aspect-video h-[20rem] w-full rounded-md">
              <Image
                src={previewImage}
                alt="Content Preview"
                width={400}
                height={600}
                className="h-full w-full object-contain"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => {
                setPreviewImage(null);
                setValue(`content.${index}.image`, "");
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </Button>
          </div>
        )}
      </div>

      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={() => remove(index)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove paragraph</span>
        </Button>
      )}
    </div>
  );
}

export default function AddBlogPage() {
  const router = useRouter();
  const { addBlog } = useBlogStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: "",

      content: [{ text: "", image: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "content",
  });

  // Main blog image dropzone
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64String = event.target?.result as string;
          setPreviewImage(base64String);
          form.setValue("image", base64String);
        };
        reader.readAsDataURL(file);
      }
    },
    [form],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addBlog(values);
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log(values);
      setIsSubmitting(false);
      toast.success("Blog Created");
      router.push("/blogs");
    }, 1000);
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
          <Link href="/blogs">
            <ArrowLeft style={{ width: "36px", height: "36px" }} />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Blog</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Information</CardTitle>
          <CardDescription>Create a new blog post.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Wrap the form with our custom Form component to provide context */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter blog title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog Image</FormLabel>
                    <FormControl className="flex justify-between">
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
                        {previewImage && (
                          <div className="relative">
                            <div className="relative aspect-video h-[20rem] rounded-md">
                              <Image
                                src={previewImage || "/placeholder.svg"}
                                alt="Preview"
                                height={300}
                                width={500}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute right-2 top-2"
                              onClick={() => {
                                setPreviewImage(null);
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <FormLabel>Blog Content</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ text: "", image: "" })}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Paragraph
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <ContentBlockField
                      key={field.id}
                      index={index}
                      remove={remove}
                      canRemove={fields.length > 1}
                    />
                  ))}
                </div>
                {form.formState.errors.content?.root && (
                  <p className="mt-2 text-sm font-medium text-destructive">
                    {form.formState.errors.content.root.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" asChild>
                  <Link href="/blogs">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Blog"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus } from "lucide-react";

// Zod Schema for Product Variants
const variantSchema = z.object({
  sizes: z.string().nonempty("Please select a size"),
  color: z.string().nonempty("Please select a color"),
  price: z.coerce.number().min(0, "Price must be positive"),
  mrp: z.coerce.number().min(0, "MRP must be positive"),
  available: z.enum(["yes", "no"]),
});

interface ProductVariantModalProps {
  onVariantAdd: (variant: z.infer<typeof variantSchema>) => void;
  defaultValues?: z.infer<typeof variantSchema>;
  triggerButton?: React.ReactNode;
}

export default function ProductVariantModal({
  onVariantAdd,
  defaultValues,
  triggerButton,
}: ProductVariantModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof variantSchema>>({
    resolver: zodResolver(variantSchema),
    defaultValues: defaultValues || {
      sizes: "",
      color: "",
      price: 0,
      mrp: 0,
      available: "yes",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const onSubmit = (values: z.infer<typeof variantSchema>) => {
    onVariantAdd(values);
    setIsOpen(false);
    form.reset();
  };

  // Custom handler for opening the dialog
  const handleOpenDialog = (e: React.MouseEvent) => {
    // Only prevent default - don't stop propagation
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button type="button" onClick={handleOpenDialog}>
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[425px]"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Edit Product Variant" : "Add Product Variant"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => (
                <FormItem className="space-x-2">
                  <FormLabel className="text-lg">Sizes</FormLabel>
                  <FormControl>
                    <select
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                      className="w-full rounded border bg-white p-2"
                    >
                      <option value="">Select available sizes</option>
                      <option value="s">S</option>
                      <option value="m">M</option>
                      <option value="l">L</option>
                      <option value="xl">XL</option>
                      <option value="xxl">XXL</option>
                      <option value="all">All Sizes</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="space-x-2">
                  <FormLabel className="text-lg">Color</FormLabel>
                  <FormControl>
                    <select
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                      className="w-full rounded border bg-white p-2"
                    >
                      <option value="">Select color</option>
                      <option value="black">Black</option>
                      <option value="white">White</option>
                      <option value="red">Red</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="yellow">Yellow</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Price</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      type="number"
                      min="0"
                      step="0.01"
                      {...field}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : Number.parseFloat(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mrp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">MRP</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      type="number"
                      min="0"
                      step="0.01"
                      {...field}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : Number.parseFloat(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>Maximum Retail Price</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="available"
              render={({ field }) => (
                <FormItem className="space-x-2">
                  <FormLabel className="text-lg">Available</FormLabel>
                  <FormControl>
                    <select
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                      className="w-full rounded border bg-white p-2"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => form.handleSubmit(onSubmit)()}
              >
                Save Variant
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

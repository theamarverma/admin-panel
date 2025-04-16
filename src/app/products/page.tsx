"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import useProductStore, { Product } from "@/stores/productStore";
import Image from "next/image";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ProductsPage() {
  // Only use deleteProduct from the store since filtering will be done on searchProducts.
  const { deleteProduct } = useProductStore();
  const [query, setQuery] = useState("");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const searchProducts = useProductStore((state) => state.searchProducts);

  // Filter products by title using the search query.
  const filteredProducts = searchProducts(query);

  const handleDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      toast.success(`Product "${productToDelete.title}" deleted successfully!`);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button asChild>
          <Link href="/products/add">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>Manage your products inventory.</CardDescription>
          <div className="relative flex items-center gap-4">
            <Input
              className="rounded-lg pl-10 text-black"
              type="text"
              value={query}
              placeholder="Search products by title..."
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product: Product) => (
                <Dialog key={product.id}>
                  <Card className="overflow-hidden">
                    <div className="h-[20rem ] relative aspect-square w-full">
                      <Image
                        src={product.image as string}
                        alt="Product Image"
                        width={400}
                        height={400}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{product.title}</h3>

                      <div className="mt-4 flex items-center gap-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <Link
                            className="flex gap-2"
                            href={`/products/edit/${product.id}`}
                          >
                            <Edit className="mr-1 h-3.5 w-3.5" />
                            Edit
                          </Link>
                        </Button>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={() => setProductToDelete(product)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </DialogTrigger>
                      </div>
                    </CardContent>
                  </Card>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the product &quot;{productToDelete?.title}&quot;
                        inventory.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button variant="destructive" onClick={handleDelete}>
                          Confirm Delete
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

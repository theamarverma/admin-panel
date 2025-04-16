import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  triggerButton?: React.ReactNode;
  itemTitle?: string;
}

export function DeleteConfirmationModal({
  onConfirm,
  triggerButton,
  itemTitle,
}: DeleteConfirmationModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {triggerButton || (
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            Delete
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            {itemTitle ? `"${itemTitle}"` : "this item"}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

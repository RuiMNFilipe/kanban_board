"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Task } from "@prisma/client";

type TaskModalProps = {
  modalTitle: string;
  onClose: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function ConfirmationModal({
  modalTitle,
  onClose,
  open,
  setOpen,
}: TaskModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button className="hover:cursor-pointer" type="submit">
            Confirm
          </Button>
          <Button
            className="hover:cursor-pointer"
            type="button"
            variant={"secondary"}
            onClick={() => {
              setOpen(false);
              onClose();
            }}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

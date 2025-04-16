"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TaskModalProps = {
  modalTitle: string;
  onClose: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm?: () => void;
};

export default function ConfirmationModal({
  modalTitle,
  onClose,
  open,
  setOpen,
  onConfirm,
}: TaskModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={onConfirm}
            className="hover:cursor-pointer"
            type="submit"
          >
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

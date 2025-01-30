"use client";

import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import ContactForm from "./ContactForm";

interface ModalContactProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalContact({ isOpen, onClose }: ModalContactProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent aria-describedby="contact-boba-form">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
        </DialogHeader>
        <DialogClose />
        <div className="p-4">
          <ContactForm onSuccess={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

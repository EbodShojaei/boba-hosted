"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import validator from "validator";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Alert } from "./ui/alert";
import { CheckCircleIcon, AlertTriangleIcon } from "lucide-react";

// Define the schema using Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  onSuccess?: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    setFeedback(null);

    // Client-side sanitization
    const sanitizedData = {
      name: validator.escape(data.name.trim()),
      email: validator.normalizeEmail(data.email.trim()) || data.email.trim(),
      message: validator.escape(data.message.trim()),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedData),
      });

      const result = await res.json();

      if (res.ok) {
        setFeedback({ type: "success", message: result.message });
        reset();
        if (onSuccess) onSuccess();
      } else {
        // If the server returns an array of errors
        if (Array.isArray(result.error)) {
          const errorMessage = result.error
            .map((err: { message: string }) => err.message)
            .join(" ");
          setFeedback({ type: "error", message: errorMessage });
        } else {
          setFeedback({
            type: "error",
            message: result.error || "Submission failed.",
          });
        }
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: "Submission failed. Please try again later.",
      });
      console.error("Contact form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Your Name"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
              required
            />
          </FormControl>
          <FormMessage>{errors.name?.message}</FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              type="email"
              placeholder="your.email@example.com"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
              required
            />
          </FormControl>
          <FormMessage>{errors.email?.message}</FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel>Message</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Your message..."
              {...register("message")}
              className={errors.message ? "border-red-500" : ""}
              required
            />
          </FormControl>
          <FormMessage>{errors.message?.message}</FormMessage>
        </FormItem>

        {feedback && (
          <Alert
            variant={feedback.type === "success" ? "default" : "destructive"}
            className={`flex items-center gap-2 p-4 rounded-md border ${
              feedback.type === "success"
                ? "border-green-500 bg-green-100"
                : "border-red-500 bg-red-100"
            }`}
            role="alert"
          >
            {feedback.type === "success" ? (
              <CheckCircleIcon className="h-5 w-5 flex-shrink-0 stroke-green-700" />
            ) : (
              <AlertTriangleIcon className="h-5 w-5 flex-shrink-0 stroke-red-700" />
            )}
            <span
              className={`text-sm ${
                feedback.type === "success" ? "text-green-700" : "text-red-700"
              }`}
            >
              {feedback.message}
            </span>
          </Alert>
        )}

        <Button className="mt-2" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

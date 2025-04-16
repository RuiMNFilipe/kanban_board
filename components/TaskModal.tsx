"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { taskTitleSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import createTaskAction from "@/actions/createTask";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Task } from "@prisma/client";

type TaskModalProps = {
  boardId: string;
  columnId: string;
  columnName: string;
  onClose: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  onTaskCreate: (task: Task) => void;
};

export default function TaskModal({
  boardId,
  columnId,
  columnName,
  onClose,
  open,
  setOpen,
  onTaskCreate,
}: TaskModalProps) {
  const form = useForm<z.infer<typeof taskTitleSchema>>({
    resolver: zodResolver(taskTitleSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof taskTitleSchema>) => {
    const formData = new FormData();
    formData.append("title", values.title);

    try {
      const result = await createTaskAction(formData, boardId, columnId);

      if (result.success) {
        onTaskCreate(result.newTask!);
        form.reset();
        setOpen(false);
        onClose();
      }

      console.log(result.error);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Adding task to column: {columnName}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="group">
              <Button className="group-hover:cursor-pointer" type="submit">
                Create
              </Button>
              <Button
                className="group-hover:cursor-pointer"
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

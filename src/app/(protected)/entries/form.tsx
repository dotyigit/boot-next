"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createEntrySchema, CreateEntryValues } from "./schema";
import { createEntry } from "./actions";

export default function EntryForm() {
  const form = useForm<CreateEntryValues>({
    resolver: zodResolver(createEntrySchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (values: CreateEntryValues) => {
    try {
      const response = await createEntry(values);
      //   if (response.success) {
      //     toast.success("Entry saved successfully");
      //     form.reset();
      //   }
    } catch (error) {
      toast.error("Failed to save entry");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Entry"}
        </Button>
      </CardFooter>
    </Card>
  );
}

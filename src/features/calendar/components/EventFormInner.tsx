import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { type EventFormSchema } from "../forms/event";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

export const EventFormInner = () => {
  const form = useFormContext<EventFormSchema>();
  const [open, setOpen] = useState(false);

  return (
    <>
      <FormField
        control={form.control}
        name="color"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Tandai Jadwal</FormLabel>
            <div className="flex items-center gap-2">
              <button
                className="h-8 w-8 rounded-md border border-gray-300"
                style={{ backgroundColor: field.value }}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(true);
                }}
              />
              <Input
                type="text"
                value={field.value}
                readOnly
                className="w-24 text-center"
              />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="p-4">
                <DialogHeader>
                  <DialogTitle>Pilih Warna</DialogTitle>
                </DialogHeader>

                <ColorPicker
                  color={useColor(field.value || "#FFD43A")[0]}
                  height={100}
                  hideInput={["rgb", "hsv"]}
                  onChange={(newColor) => {
                    field.onChange(newColor.hex);
                  }}
                />

                <div className="mt-2 flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Tutup</Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Event Title</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter event title" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} rows={3} placeholder="Enter event details" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Date</FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
                value={
                  field.value
                    ? new Date(field.value).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="startTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Time</FormLabel>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="endTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Time</FormLabel>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

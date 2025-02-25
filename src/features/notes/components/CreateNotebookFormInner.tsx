import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { CreateNotebookFormSchema } from "../forms/create-notebook";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ColorPicker, useColor } from "react-color-palette";
import { Button } from "~/components/ui/button";
import { useState } from "react";

export const CreateNotebookFormInner = () => {
  const form = useFormContext<CreateNotebookFormSchema>();
  const [open, setOpen] = useState(false);
  const [color, setColor] = useColor(form.watch("color") || "#FFD43A");

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel htmlFor="title">Judul</FormLabel>
            <FormControl>
              <Input id="title" {...field} placeholder="Masukkan Judul..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="color"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel htmlFor="color">Tandai Notebook</FormLabel>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-8 w-8 rounded-md border border-gray-300"
                style={{ backgroundColor: color.hex }}
                onClick={() => setOpen(true)}
              />
              <Input
                id="color"
                type="text"
                value={color.hex}
                readOnly
                className="w-24 text-center"
              />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent
                className="p-4"
                aria-describedby="color-picker-description"
              >
                <DialogHeader>
                  <DialogTitle>Pilih Warna</DialogTitle>
                </DialogHeader>

                <p id="color-picker-description" className="sr-only">
                  Pilih warna untuk menandai notebook Anda menggunakan penggeser
                  warna di bawah.
                </p>

                <ColorPicker
                  color={color}
                  height={100}
                  hideInput={["rgb", "hsv"]}
                  onChange={(newColor) => {
                    setColor(newColor); // Update local state
                    field.onChange(newColor.hex); // Update form field
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
    </>
  );
};

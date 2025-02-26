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

import "react-color-palette/css";

export const CreateNotebookFormInner = () => {
  const form = useFormContext<CreateNotebookFormSchema>();
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
              <div
                className="h-8 w-8 rounded-md border border-gray-300"
                style={{ backgroundColor: color.hex }}
              />
              <Input
                id="color"
                type="text"
                value={color.hex}
                readOnly
                className="w-24 text-center"
              />
            </div>

            <ColorPicker
              color={color}
              height={50}
              hideInput={["rgb", "hsv"]}
              onChange={(newColor) => {
                setColor(newColor); // Update local state
                field.onChange(newColor.hex); // Update form field
              }}
            />

            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

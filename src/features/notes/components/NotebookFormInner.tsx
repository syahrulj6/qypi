import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { NotebookFormSchema } from "../forms/notebook";
import { ColorPicker, useColor } from "react-color-palette";

import "react-color-palette/css";

export const NotebookFormInner = () => {
  const form = useFormContext<NotebookFormSchema>();
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
                setColor(newColor);
                field.onChange(newColor.hex);
              }}
            />

            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

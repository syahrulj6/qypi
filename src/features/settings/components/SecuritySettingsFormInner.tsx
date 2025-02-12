import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type SecuritySettingsFormSchema } from "../forms/security-settings";
import { useState } from "react";
import { Button } from "~/components/ui/button";

type SecuritySettingsFormInnerProps = {
  handleChangePassword: () => void;
};

export const SecuritySettingsFormInner = ({
  handleChangePassword,
}: SecuritySettingsFormInnerProps) => {
  const form = useFormContext<SecuritySettingsFormSchema>();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <FormField
        control={form.control}
        name="currentPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password Saat Ini</FormLabel>
            <FormControl>
              <Input {...field} type="password" disabled={!isEditing} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="newPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password Baru</FormLabel>
            <FormControl>
              <Input {...field} type="password" disabled={!isEditing} />
            </FormControl>
            <FormMessage />
            <div className="mt-2 flex gap-2">
              <Button
                variant="destructive"
                type="button"
                onClick={() => setIsEditing((prev) => !prev)}
              >
                {isEditing ? "Batal" : "Ganti Password?"}
              </Button>
              <Button
                type="button"
                disabled={!form.formState.isDirty}
                onClick={handleChangePassword}
              >
                Simpan Perubahan Password
              </Button>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

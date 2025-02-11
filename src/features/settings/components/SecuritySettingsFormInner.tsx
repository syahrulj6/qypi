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
  defaultValues: {
    email: string;
    password: string;
  };
};

export const SecuritySettingsFormInner = (
  props: SecuritySettingsFormInnerProps,
) => {
  const form = useFormContext<SecuritySettingsFormSchema>();
  const [changeEmailInput, setChangeEmailInput] = useState(true);
  const [changePasswordInput, setChangePasswordInput] = useState(true);

  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Anda</FormLabel>
            <FormControl>
              <Input {...field} disabled={changeEmailInput} />
            </FormControl>
            <FormMessage />
            <Button
              variant="destructive"
              type="button"
              onClick={() => setChangeEmailInput((prev) => !prev)}
            >
              {changeEmailInput ? "Ganti  Email?" : "Cancel"}
            </Button>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password Anda</FormLabel>
            <FormControl>
              <Input {...field} disabled={changePasswordInput} />
            </FormControl>
            <FormMessage />
            <Button
              variant="destructive"
              type="button"
              onClick={() => setChangePasswordInput((prev) => !prev)}
            >
              {changePasswordInput ? "Ganti Password?" : "Cancel"}
            </Button>
          </FormItem>
        )}
      />
    </>
  );
};

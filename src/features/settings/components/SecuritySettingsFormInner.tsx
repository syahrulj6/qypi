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
  handleChangeEmail: () => void;
  handleChangePassword: () => void;
};

export const SecuritySettingsFormInner = ({
  handleChangeEmail,
  handleChangePassword,
}: SecuritySettingsFormInnerProps) => {
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
            <div className="mt-2 flex gap-2">
              <Button
                variant="destructive"
                type="button"
                onClick={() => setChangeEmailInput((prev) => !prev)}
              >
                {changeEmailInput ? "Ganti Email?" : "Cancel"}
              </Button>
              <Button
                type="button"
                disabled={!form.formState.dirtyFields.email}
                onClick={handleChangeEmail}
              >
                Simpan Perubahan Email
              </Button>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ganti Password</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="password"
                disabled={changePasswordInput}
              />
            </FormControl>
            <FormMessage />
            <div className="mt-2 flex gap-2">
              <Button
                variant="destructive"
                type="button"
                onClick={() => setChangePasswordInput((prev) => !prev)}
              >
                {changePasswordInput ? "Ganti Password?" : "Cancel"}
              </Button>
              <Button
                type="button"
                disabled={!form.formState.dirtyFields.password}
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

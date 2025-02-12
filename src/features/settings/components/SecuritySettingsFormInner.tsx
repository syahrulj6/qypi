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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

type SecuritySettingsFormInnerProps = {
  handleChangePassword: () => void;
};

export const SecuritySettingsFormInner = ({
  handleChangePassword,
}: SecuritySettingsFormInnerProps) => {
  const form = useFormContext<SecuritySettingsFormSchema>();
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    disabled={
                      !form.formState.dirtyFields.currentPassword ||
                      !form.formState.dirtyFields.newPassword
                    }
                  >
                    Simpan Perubahan Password
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Konfirmasi Perubahan Password
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah Anda yakin ingin mengubah password? Perubahan ini
                      bersifat permanen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setIsDialogOpen(false);
                        handleChangePassword();
                      }}
                    >
                      Ya, Ubah Password
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

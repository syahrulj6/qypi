import DashboardLayout from "~/components/layout/DashboardLayout";
import { SettingsHeader } from "../components/SettingsHeader";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import {
  securitySettingsFormSchema,
  SecuritySettingsFormSchema,
} from "../forms/security-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { SecuritySettingsFormInner } from "../components/SecuritySettingsFormInner";
import { toast } from "sonner";
import { useRouter } from "next/router";

const SecuritySettingsPage = () => {
  const { data: profileData, isLoading } = api.profile.getProfile.useQuery();
  const router = useRouter();

  const form = useForm<SecuritySettingsFormSchema>({
    resolver: zodResolver(securitySettingsFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const changePasswordMutation = api.auth.changePassword.useMutation();

  const handleChangePassword = form.handleSubmit(async (values) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      toast.success("Password berhasil diubah! Silakan login ulang.");
      router.replace("/login");
      form.reset();
    } catch (error) {
      toast.error("Gagal mengubah password");
    }
  });

  return (
    <DashboardLayout>
      <SettingsHeader />
      <div className="mt-6 flex flex-col gap-4">
        <div className="grid flex-1 grid-cols-1 gap-y-4">
          {!isLoading && profileData && (
            <Form {...form}>
              <SecuritySettingsFormInner
                handleChangePassword={handleChangePassword}
              />
            </Form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SecuritySettingsPage;

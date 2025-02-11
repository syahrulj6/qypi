import DashboardLayout from "~/components/layout/DashboardLayout";
import { SettingsHeader } from "../components/SettingsHeader";
import { SessionRoute } from "~/components/layout/SessionRoute";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import {
  securitySettingsFormSchema,
  SecuritySettingsFormSchema,
} from "../forms/security-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { SecuritySettingsFormInner } from "../components/SecuritySettingsFormInner";
import { Button } from "~/components/ui/button";

const SecuritySettingsPage = () => {
  const { data: getProfileData, isLoading } = api.profile.getProfile.useQuery();
  const form = useForm<SecuritySettingsFormSchema>({
    resolver: zodResolver(securitySettingsFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (getProfileData) {
      form.reset({
        email: getProfileData.email ?? "",
      });
    }
  }, [getProfileData, form]);

  const handleChangeEmail = form.handleSubmit((values) => {
    console.log("Updating email:", values.email);
    // API call to update email
  });

  const handleChangePassword = form.handleSubmit((values) => {
    console.log("Updating password:", values.password);
    // API call to update password
  });

  return (
    <SessionRoute>
      <DashboardLayout>
        <SettingsHeader />
        <div className="mt-6 flex flex-col gap-4">
          <div className="grid flex-1 grid-cols-1 gap-y-4">
            {!isLoading && getProfileData && (
              <Form {...form}>
                <SecuritySettingsFormInner
                  handleChangeEmail={handleChangeEmail}
                  handleChangePassword={handleChangePassword}
                />
              </Form>
            )}
          </div>
        </div>
      </DashboardLayout>
    </SessionRoute>
  );
};

export default SecuritySettingsPage;

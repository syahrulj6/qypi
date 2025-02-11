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

  return (
    <SessionRoute>
      <DashboardLayout>
        <SettingsHeader />
        <div className="mt-6 flex flex-col gap-4">
          <div className="grid flex-1 grid-cols-1 gap-y-4">
            {/* TODO: Ui When Loading */}
            {!isLoading && getProfileData && (
              <Form {...form}>
                <SecuritySettingsFormInner
                  defaultValues={{
                    email: getProfileData?.email,
                    password: "",
                  }}
                />
              </Form>
            )}
          </div>
        </div>
        <div className="flex w-full justify-center gap-4">
          <Button
            className="w-full"
            disabled={!form.formState.isDirty}
            // onClick={form.handleSubmit(handleUpdateProfileSubmit)}
          >
            Simpan
          </Button>
        </div>
      </DashboardLayout>
    </SessionRoute>
  );
};

export default SecuritySettingsPage;

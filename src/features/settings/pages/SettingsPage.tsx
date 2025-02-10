import DashboardLayout from "~/components/layout/DashboardLayout";
import { SessionRoute } from "~/components/layout/SessionRoute";
import { SettingsHeader } from "../components/SettingsHeader";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { settingsFormSchema, SettingsFormSchema } from "../forms/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsFormInner } from "../components/SettingsFormInner";
import { Form } from "~/components/ui/form";
import { useEffect } from "react";

const SettingsPage = () => {
  const { data: getProfileData, isLoading } = api.profile.getProfile.useQuery();

  const form = useForm<SettingsFormSchema>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      username: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (getProfileData) {
      form.reset({
        username: getProfileData.username ?? "",
        bio: getProfileData.bio ?? "",
      });
    }
  }, [getProfileData, form]);

  // TODO: Update Profile

  return (
    <SessionRoute>
      <DashboardLayout>
        <SettingsHeader />
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-20">
              <AvatarFallback>P</AvatarFallback>
              <AvatarImage src={getProfileData?.profilePictureUrl!} />
            </Avatar>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-medium tracking-tight text-primary">
                {getProfileData?.username}
              </p>
              <p className="tracking-tight text-muted-foreground">
                {getProfileData?.bio}
              </p>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-y-4">
            {!isLoading && getProfileData && (
              <Form {...form}>
                <SettingsFormInner
                  defaultValues={{
                    bio: getProfileData?.bio,
                    username: getProfileData?.username,
                  }}
                />
              </Form>
            )}
          </div>
        </div>
      </DashboardLayout>
    </SessionRoute>
  );
};

export default SettingsPage;

import DashboardLayout from "~/components/layout/DashboardLayout";
import { SettingsHeader } from "../components/SettingsHeader";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { settingsFormSchema, SettingsFormSchema } from "../forms/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsFormInner } from "../components/SettingsFormInner";
import { Form } from "~/components/ui/form";
import { useEffect } from "react";
import { toast } from "sonner";
import { TRPCClientError } from "@trpc/client";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Skeleton } from "~/components/ui/skeleton";

const SettingsPage = () => {
  const { data: getProfileData, isLoading } = api.profile.getProfile.useQuery();

  const form = useForm<SettingsFormSchema>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      username: "",
      bio: "",
      email: "",
    },
  });

  useEffect(() => {
    if (getProfileData) {
      form.reset({
        username: getProfileData.username ?? "",
        bio: getProfileData.bio ?? "",
        email: getProfileData.email ?? "",
      });
    }
  }, [getProfileData, form]);

  const updateProfile = api.profile.updateProfile.useMutation({
    onSuccess: ({ bio, username }) => {
      form.reset({ bio: bio ?? "", username });
      toast.success("Berhasil update profile");
    },
    onError: (err) => {
      if (err instanceof TRPCClientError && err.message === "USERNAME_USED") {
        form.setError("username", { message: "Username sudah digunakan" });
      }
      toast.error("Gagal update profile");
    },
  });

  const handleUpdateProfileSubmit = (values: SettingsFormSchema) => {
    updateProfile.mutate({
      username:
        values.username !== getProfileData?.username
          ? values.username
          : undefined,
      bio: values.bio !== getProfileData?.bio ? values.bio : undefined,
    });
  };

  return (
    <DashboardLayout>
      <SettingsHeader />
      <div className="mt-6 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="size-24 rounded-full" />
            <Skeleton className="h-7" />
            <Skeleton className="h-7" />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href={"/profile"}>
              <Avatar className="size-20">
                <AvatarFallback>P</AvatarFallback>
                <AvatarImage src={getProfileData?.profilePictureUrl!} />
              </Avatar>
            </Link>

            <div className="flex flex-col gap-2">
              <p className="text-lg font-medium tracking-tight text-primary">
                {getProfileData?.username}
              </p>
              <p className="tracking-tight text-muted-foreground">
                {getProfileData?.bio}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-x-3 gap-y-4 md:grid md:grid-cols-2">
          {!isLoading && getProfileData && (
            <Form {...form}>
              <SettingsFormInner
                defaultValues={{
                  email: getProfileData?.email,
                  bio: getProfileData?.bio,
                  username: getProfileData?.username,
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
          onClick={form.handleSubmit(handleUpdateProfileSubmit)}
        >
          Simpan
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;

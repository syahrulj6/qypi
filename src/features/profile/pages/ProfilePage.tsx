import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SessionRoute } from "~/components/layout/SessionRoute";
import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { api } from "~/utils/api";
import { EditProfileFormInner } from "../components/EditProfileFormInner";
import {
  editProfileFormSchema,
  type EditProfileFormSchema,
} from "../forms/edit-profile";
import { ProfilePictureActions } from "../components/ProfilePictureActions";
import { useProfilePictureHandler } from "~/hooks/useProfilePictureHandler";
import { Skeleton } from "~/components/ui/skeleton"; // Import Skeleton

const ProfilePage = () => {
  const apiUtils = api.useUtils();
  const { data: getProfileData, isLoading } = api.profile.getProfile.useQuery();

  const form = useForm<EditProfileFormSchema>({
    resolver: zodResolver(editProfileFormSchema),
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

  const handleUpdateProfileSubmit = (values: EditProfileFormSchema) => {
    updateProfile.mutate({
      username:
        values.username !== getProfileData?.username
          ? values.username
          : undefined,
      bio: values.bio !== getProfileData?.bio ? values.bio : undefined,
    });
  };

  const {
    selectedImage,
    selectedProfilePicturePreview,
    handleOpenFileExplorer,
    handleRemoveSelectedImage,
    handleUpdateProfilePicture,
    handleDeleteProfilePicture,
    onPickProfilePicture,
    inputFileRef,
  } = useProfilePictureHandler(apiUtils);

  return (
    <SessionRoute>
      <PageContainer>
        <SectionContainer padded minFullscreen className="gap-y-6 py-8">
          <h1 className="text-3xl font-semibold">Profile Settings</h1>

          <Card>
            <CardContent className="flex gap-6 pt-6">
              {isLoading ? (
                <div className="flex flex-col gap-3">
                  <Skeleton className="size-24 rounded-full" />
                  <Skeleton className="h-7" />
                  <Skeleton className="h-7" />
                </div>
              ) : (
                <ProfilePictureActions
                  selectedImage={selectedImage}
                  profilePictureUrl={
                    selectedProfilePicturePreview ??
                    getProfileData?.profilePictureUrl ??
                    ""
                  }
                  handleOpenFileExplorer={handleOpenFileExplorer}
                  handleRemoveSelectedImage={handleRemoveSelectedImage}
                  handleUpdateProfilePicture={handleUpdateProfilePicture}
                  handleDeleteProfilePicture={handleDeleteProfilePicture}
                  inputFileRef={inputFileRef}
                  onPickProfilePicture={onPickProfilePicture}
                />
              )}

              <div className="grid flex-1 grid-cols-2 gap-y-4">
                {isLoading ? (
                  <>
                    <Skeleton className="col-span-2 h-4 w-20" />{" "}
                    <Skeleton className="col-span-2 h-8 w-24 md:w-36" />{" "}
                    <Skeleton className="h-4 w-16" />{" "}
                    <Skeleton className="col-span-2 h-20 w-full" />{" "}
                  </>
                ) : (
                  <Form {...form}>
                    <EditProfileFormInner
                      defaultValues={{
                        bio: getProfileData?.bio,
                        username: getProfileData?.username,
                      }}
                    />
                  </Form>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex w-full justify-end gap-4">
            <Button
              disabled={!form.formState.isDirty || isLoading}
              onClick={form.handleSubmit(handleUpdateProfileSubmit)}
            >
              Simpan
            </Button>
          </div>
        </SectionContainer>
      </PageContainer>
    </SessionRoute>
  );
};

export default ProfilePage;

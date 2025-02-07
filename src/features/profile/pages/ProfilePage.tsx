import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import {
  type ChangeEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SessionRoute } from "~/components/layout/SessionRoute";
import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Form } from "~/components/ui/form";
import { api } from "~/utils/api";
import { EditProfileFormInner } from "../components/EditProfileFormInner";
import {
  editProfileFormSchema,
  type EditProfileFormSchema,
} from "../forms/edit-profile";

const ProfilePage = () => {
  const [selectedImage, setSelectedImage] = useState<File | undefined | null>(
    null,
  );

  const apiUtils = api.useUtils();

  const form = useForm<EditProfileFormSchema>({
    resolver: zodResolver(editProfileFormSchema),
  });

  const { data: getProfileData } = api.profile.getProfile.useQuery();
  const updateProfile = api.profile.updateProfile.useMutation({
    onSuccess: async ({ bio, username }) => {
      form.reset({ bio: bio ?? "", username });
      toast.success("Berhasil update profile");
    },
    onError: (err) => {
      if (err instanceof TRPCClientError) {
        if (err.message === "USERNAME_USED") {
          form.setError("username", {
            message: "Username sudah digunakan",
          });
        }
      }

      toast.error("Gagal update profile");
    },
  });
  const updateProfilePicture = api.profile.updateProfilePicture.useMutation({
    onSuccess: async () => {
      toast.success("Berhasil ganti foto profil");
      setSelectedImage(null);
      await apiUtils.profile.getProfile.invalidate();
    },
    onError: async () => {
      toast.error("Gagal ganti foto profil");
    },
  });

  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleUpdateProfileSubmit = (values: EditProfileFormSchema) => {
    const payload: {
      username?: string;
      bio?: string;
    } = {};

    if (values.username !== getProfileData?.username) {
      payload.username = values.username;
    }

    if (values.bio !== getProfileData?.bio) {
      payload.bio = values.bio;
    }

    updateProfile.mutate({
      ...payload,
    });
  };

  const handleOpenFileExplorer = () => {
    inputFileRef.current?.click();
  };

  const handleRemoveSelectedImage = () => {
    setSelectedImage(null);
  };

  const onPickProfilePicture: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];

      if (file!.size > 10 * 1024 * 1024) {
        toast.error("Ukuran gambar maksimal 10MB");
        e.target.value = "";
        return;
      }

      setSelectedImage(file);
    }
  };

  const handleUpdateProfilePicture = async () => {
    if (!selectedImage) return;

    const reader = new FileReader();

    reader.onloadend = function () {
      const result = reader.result as string;
      const imageBase64 = result.substring(result.indexOf(",") + 1);

      updateProfilePicture.mutate(imageBase64, {
        onError: () => {
          toast.error("Terjadi kesalahan saat mengupload gambar, coba lagi!");
        },
      });
    };

    reader.readAsDataURL(selectedImage);
  };

  const deleteProfilePicture = api.profile.deleteProfilePicture.useMutation({
    onSuccess: async () => {
      toast.success("Foto profil berhasil dihapus!");
      await apiUtils.profile.getProfile.invalidate();
    },
    onError: () => {
      toast.error("Gagal menghapus foto profil");
    },
  });

  const handleDeleteProfilePicture = () => {
    deleteProfilePicture.mutate();
  };

  const selectedProfilePicturePreview = useMemo(() => {
    if (selectedImage) {
      return URL.createObjectURL(selectedImage);
    }
  }, [selectedImage]);

  useEffect(() => {
    if (getProfileData) {
      form.setValue("username", getProfileData.username ?? "");
      form.setValue("bio", getProfileData.bio ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProfileData]);

  return (
    <SessionRoute>
      <PageContainer>
        <SectionContainer padded minFullscreen className="gap-y-6 py-8">
          <h1 className="text-3xl font-semibold">Profile Settings</h1>

          <Card>
            <CardContent className="flex gap-6 pt-6">
              <div className="flex flex-col gap-2">
                <Avatar className="size-24">
                  <AvatarFallback>VF</AvatarFallback>
                  <AvatarImage
                    src={
                      selectedProfilePicturePreview ??
                      getProfileData?.profilePictureUrl ??
                      ""
                    }
                  />
                </Avatar>

                <Button
                  variant="secondary"
                  onClick={handleOpenFileExplorer}
                  size="sm"
                >
                  Ganti Foto
                </Button>
                {!selectedImage && (
                  <Button
                    variant="destructive"
                    onClick={handleDeleteProfilePicture}
                    size="sm"
                  >
                    Hapus Foto
                  </Button>
                )}
                {!!selectedImage && (
                  <>
                    <Button
                      onClick={handleRemoveSelectedImage}
                      variant="destructive"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateProfilePicture} size="sm">
                      Simpan
                    </Button>
                  </>
                )}
                <input
                  accept="image/*"
                  onChange={onPickProfilePicture}
                  className="hidden"
                  type="file"
                  ref={inputFileRef}
                />
              </div>

              <div className="grid flex-1 grid-cols-2 gap-y-4">
                {/* TODO: Skeleton when loading data */}
                {getProfileData && (
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
              disabled={!form.formState.isDirty}
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

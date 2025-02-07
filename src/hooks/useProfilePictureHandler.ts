import { useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "~/utils/api";

export const useProfilePictureHandler = (
  apiUtils: ReturnType<typeof api.useUtils>,
) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const updateProfilePicture = api.profile.updateProfilePicture.useMutation({
    onSuccess: async () => {
      toast.success("Berhasil mengganti foto profil");
      setSelectedImage(null);
      setPreviewUrl(null);
      await apiUtils.profile.getProfile.invalidate();
    },
    onError: () => {
      toast.error("Gagal mengganti foto profil");
    },
  });

  const deleteProfilePicture = api.profile.deleteProfilePicture.useMutation({
    onSuccess: async () => {
      toast.success("Foto profil berhasil dihapus!");
      setPreviewUrl(null);
      await apiUtils.profile.getProfile.invalidate();
    },
    onError: () => {
      toast.error("Gagal menghapus foto profil");
    },
  });

  return {
    selectedImage,
    selectedProfilePicturePreview: previewUrl,
    handleOpenFileExplorer: () => inputFileRef.current?.click(),
    handleRemoveSelectedImage: () => {
      setSelectedImage(null);
      setPreviewUrl(null);
    },
    handleUpdateProfilePicture: () => {
      if (!selectedImage) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          // Ambil base64 tanpa prefix "data:image/png;base64,"
          const base64String = reader.result.split(",")[1];
          updateProfilePicture.mutate(base64String);
        }
      };
      reader.readAsDataURL(selectedImage);
    },
    handleDeleteProfilePicture: () => deleteProfilePicture.mutate(),
    onPickProfilePicture: (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        toast.error("Ukuran gambar maksimal 10MB");
        return;
      }

      setSelectedImage(file);

      // Buat preview image
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    },
    inputFileRef,
  };
};

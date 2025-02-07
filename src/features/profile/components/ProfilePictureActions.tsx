import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";

type ProfilePictureActionsProps = {
  selectedImage: File | null;
  profilePictureUrl: string;
  handleOpenFileExplorer: () => void;
  handleRemoveSelectedImage: () => void;
  handleUpdateProfilePicture: () => void;
  handleDeleteProfilePicture: () => void;
  inputFileRef: React.RefObject<HTMLInputElement>;
  onPickProfilePicture: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ProfilePictureActions = ({
  selectedImage,
  profilePictureUrl,
  handleOpenFileExplorer,
  handleRemoveSelectedImage,
  handleUpdateProfilePicture,
  handleDeleteProfilePicture,
  inputFileRef,
  onPickProfilePicture,
}: ProfilePictureActionsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Avatar className="size-24">
        <AvatarFallback>VF</AvatarFallback>
        <AvatarImage src={profilePictureUrl} />
      </Avatar>

      <Button variant="secondary" onClick={handleOpenFileExplorer} size="sm">
        Ganti Foto
      </Button>

      {!selectedImage ? (
        <Button
          variant="destructive"
          onClick={handleDeleteProfilePicture}
          size="sm"
        >
          Hapus Foto
        </Button>
      ) : (
        <>
          <Button
            onClick={handleRemoveSelectedImage}
            variant="destructive"
            size="sm"
          >
            Batal
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
  );
};

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
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
import { api } from "~/utils/api";
import { toast } from "sonner";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string | null;
  endDate: Date;
  teamId: string;
  router: any;
  team: {
    lead?: {
      profilePictureUrl?: string | null;
    };
    members?: {
      user?: {
        profilePictureUrl?: string | null;
      };
    }[];
  };
  isCurrentUserLead: boolean;
}

export const ProjectCard = ({
  id,
  teamId,
  team,
  endDate,
  name,
  description,
  router,
  isCurrentUserLead,
}: ProjectCardProps) => {
  const deleteProject = api.project.deleteProject.useMutation();

  const leadProfilePicture = team.lead?.profilePictureUrl;

  const memberProfilePictures =
    team.members
      ?.filter(
        (member) => member.user?.profilePictureUrl !== leadProfilePicture,
      )
      .map((member) => member.user?.profilePictureUrl) || [];

  const profilePictures = [leadProfilePicture, ...memberProfilePictures].filter(
    Boolean,
  );

  const maxAvatars = 4;
  const remainingMembers = Math.max(0, profilePictures.length - maxAvatars);
  const avatarsToShow = profilePictures.slice(0, maxAvatars);

  const handleDeleteProject = () => {
    deleteProject.mutate(
      { projectId: id },
      {
        onSuccess: () => {
          toast.success("Project deleted successfully");
          router.push(`/dashboard/team/${teamId}`);
        },
        onError: (error) => {
          toast.error("Failed to delete project: " + error.message);
        },
      },
    );
  };

  return (
    <Card className="relative hover:cursor-pointer">
      {isCurrentUserLead && (
        <div className="absolute right-2 top-2 flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:bg-red-100 hover:text-red-500"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this project? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={handleDeleteProject}
                >
                  Delete Project
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
      <div onClick={() => router.push(`/dashboard/team/${teamId}/${id}`)}>
        <CardHeader>
          <CardTitle>Project end in</CardTitle>
          <CardDescription>{endDate.toDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <p className="text-muted-foreground">Project name:</p>
            <p className="font-semibold">{name}</p>
            <p className="text-muted-foreground">Project Description:</p>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap -space-x-3">
          {avatarsToShow.map((picture, index) => (
            <Avatar key={index} className="size-10 border-4 border-white">
              <AvatarFallback>{picture ? "" : "U"}</AvatarFallback>
              <AvatarImage src={picture ?? ""} className="rounded-full" />
            </Avatar>
          ))}
          {remainingMembers > 0 && (
            <Avatar className="size-10 border-4 border-white">
              <AvatarFallback>+{remainingMembers}</AvatarFallback>
            </Avatar>
          )}
        </CardFooter>
      </div>
    </Card>
  );
};

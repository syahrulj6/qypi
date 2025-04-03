import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { api } from "~/utils/api";
import TeamLayout from "../components/TeamLayout";
import { Button } from "~/components/ui/button";
import { Trash2, Pencil, ChevronLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ProjectSettingsSchema, projectSettingsSchema } from "../forms/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { Skeleton } from "~/components/ui/skeleton";
import { useSession } from "~/hooks/useSession";
import { ProjectSettingsFormInner } from "../components/ProjectSettingsFormInner";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

const ProjectSettingsPage = () => {
  const router = useRouter();
  const { teamId, projectId } = router.query;
  const { session } = useSession();
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const {
    data: projectData,
    isLoading: projectLoading,
    refetch: refetchProject,
  } = api.project.getProjectById.useQuery(
    { projectId: projectId as string },
    { enabled: !!projectId },
  );

  const { data: teamData, isLoading: teamLoading } =
    api.team.getTeamById.useQuery(
      { id: teamId as string },
      { enabled: !!teamId },
    );

  const updateProject = api.project.updateProject.useMutation();
  const deleteProject = api.project.deleteProject.useMutation();

  const isCurrentUserLead = teamData?.leadId === session?.user.id;

  const form = useForm<ProjectSettingsSchema>({
    resolver: zodResolver(projectSettingsSchema),
    defaultValues: {
      name: "",
      description: "",
      endDate: "",
    },
  });

  useEffect(() => {
    if (projectData) {
      form.reset({
        name: projectData.name,
        description: projectData.description || "",
        endDate: projectData.endDate?.toISOString().split("T")[0] || "",
      });
    }
  }, [projectData, form]);

  const handleUpdateProject = async (values: ProjectSettingsSchema) => {
    try {
      await updateProject.mutateAsync({
        projectId: projectId as string,
        name: values.name,
        description: values.description,
        endDate: values.endDate ? new Date(values.endDate) : undefined,
      });
      toast.success("Project updated successfully");
      refetchProject();
    } catch (error) {
      toast.error("Failed to update project");
    }
  };

  const handleDeleteProject = async () => {
    if (deleteConfirmation !== projectData?.name) {
      toast.error(
        "Project name does not match. Please type the project name exactly to confirm deletion",
      );
      return;
    }

    try {
      await deleteProject.mutateAsync({
        projectId: projectId as string,
      });
      toast.success("Project deleted successfully");
      router.push(`/dashboard/team/${teamId}/projects`);
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  if (projectLoading || teamLoading) {
    return (
      <DashboardLayout>
        <TeamLayout breadcrumbItems={[]}>
          <div className="mt-4 flex w-full flex-col gap-8">
            <Skeleton className="h-10 w-1/4" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-1/4" />
          </div>
        </TeamLayout>
      </DashboardLayout>
    );
  }

  if (!projectData || !teamData) {
    return (
      <DashboardLayout>
        <TeamLayout breadcrumbItems={[]}>
          <div className="mt-4 flex w-full items-center justify-center">
            <p>Project not found</p>
          </div>
        </TeamLayout>
      </DashboardLayout>
    );
  }

  const breadcrumbItems = [
    { href: "/dashboard/team", label: "Team" },
    { href: `/dashboard/team/${teamId}`, label: teamData.name },
    { href: `/dashboard/team/${teamId}/projects`, label: "Projects" },
    {
      href: `/dashboard/team/${teamId}/projects/${projectId}`,
      label: projectData.name,
    },
    { label: "Settings" },
  ];

  return (
    <DashboardLayout>
      <TeamLayout breadcrumbItems={breadcrumbItems}>
        <div className="mt-4 flex w-full flex-col gap-4">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/team/${teamId}/projects/${projectId}`}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to project
              </Link>
            </Button>
          </div>

          {/* General Settings */}
          <div className="rounded-lg border p-6">
            <h2 className="mb-6 text-lg font-semibold">General Settings</h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdateProject)}
                className="space-y-4"
              >
                <ProjectSettingsFormInner
                  isCurrentUserLead={isCurrentUserLead}
                />

                {isCurrentUserLead && (
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={
                        updateProject.isPending || !form.formState.isDirty
                      }
                    >
                      {updateProject.isPending ? (
                        <span className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Pencil className="mr-2 h-4 w-4" />
                      )}
                      Update Project
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </div>

          {isCurrentUserLead && (
            <div className="rounded-lg border border-red-500 p-6">
              <h2 className="mb-6 text-lg font-semibold text-red-500">
                Danger Zone
              </h2>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      the project and all its data.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="delete-confirmation">
                        Type{" "}
                        <span className="font-bold">{projectData.name}</span> to
                        confirm
                      </Label>
                      <Input
                        id="delete-confirmation"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteProject}
                      disabled={
                        deleteConfirmation !== projectData.name ||
                        deleteProject.isPending
                      }
                    >
                      {deleteProject.isPending ? (
                        <span className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Delete Project"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </TeamLayout>
    </DashboardLayout>
  );
};

export default ProjectSettingsPage;

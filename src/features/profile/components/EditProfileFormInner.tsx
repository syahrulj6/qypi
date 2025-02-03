import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api"; // Import your tRPC API hook
import { type EditProfileFormSchema } from "../forms/edit-profile";

type EditProfileFormInnerProps = {
  defaultValues: {
    username?: string;
    bio?: string | null;
  };
};

export const EditProfileFormInner = (props: EditProfileFormInnerProps) => {
  const form = useForm<EditProfileFormSchema>({
    defaultValues: {
      bio: props.defaultValues.bio ?? "",
      username: props.defaultValues.username ?? "",
    },
  });

  const { mutateAsync } = api.profile.updateProfile.useMutation();

  const onSubmit = async (data: EditProfileFormSchema) => {
    try {
      await mutateAsync(data);
      alert("Profile updated successfully");
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
};

import { useForm } from "react-hook-form";
import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Form } from "~/components/ui/form";
import { toast } from "sonner";
import { GuestRoute } from "~/components/layout/GuestRoute";
import { supabase } from "~/lib/supabase/client";
import { Button } from "~/components/ui/button";

type ResetFormInputs = {
  email: string;
};

const ResetPage = () => {
  const form = useForm<ResetFormInputs>();

  const onSubmit = async (data: ResetFormInputs) => {
    const { email } = data;
    const { error, data: resetPasswordData } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/update-password",
      });
    if (error) {
      toast.error("Failed to send reset password email. Please try again.");
    } else {
      toast("Reset password email sent successfully! Check your inbox.");
      console.log(resetPasswordData);
    }
  };

  return (
    <GuestRoute>
      <PageContainer>
        <SectionContainer
          padded
          className="flex min-h-[calc(100vh-144px)] flex-col justify-center"
        >
          <Card className="w-full max-w-[480px] self-center">
            <CardHeader className="flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold text-primary">
                Reset Password
              </h1>
              <p className="tracking-tight text-muted-foreground">
                Masukkan email anda untuk mereset password
              </p>
            </CardHeader>
            <CardContent>
              {/* Pass all form methods to the Form component */}
              <Form {...form}>
                {/* Now include your native form element with the submit handler */}
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...form.register("email", {
                        required: "Email is required",
                      })}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    {form.formState.errors.email && (
                      <span className="text-sm text-red-600">
                        {form.formState.errors.email.message}
                      </span>
                    )}
                    <Button size="lg">Submit</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </SectionContainer>
      </PageContainer>
    </GuestRoute>
  );
};

export default ResetPage;

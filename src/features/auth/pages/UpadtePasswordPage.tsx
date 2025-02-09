// UpdatePasswordPage.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Form } from "~/components/ui/form";
import { UpdatePasswordFormInner } from "../components/UpdatePasswordFormInner";
import { type ResetPasswordSchema, resetPasswordSchema } from "../forms/auth";
import { toast } from "sonner";
import { supabase } from "~/lib/supabase/client";
import { SessionRoute } from "~/components/layout/SessionRoute";

const UpdatePasswordPage = () => {
  const router = useRouter();
  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // On mount, attempt to extract the session from the URL and store it.
  useEffect(() => {
    async function initSession() {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error retrieving session from URL:", error);
      } else {
        console.log("Session retrieved:", data.session);
      }
    }
    initSession();
  }, [router]);

  const handleUpdatePassword = async (values: ResetPasswordSchema) => {
    // client should be authenticated from the URL.
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      console.error("Error updating password:", error);
      toast.error("Terjadi Error. Please coba lagi lain kali!.");
    } else {
      toast("Password berhasil diganti!");
      router.push("/");
      form.reset();
    }
  };

  return (
    <SessionRoute>
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
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <UpdatePasswordFormInner
                  isLoading={false}
                  onUpdatePasswordSubmit={handleUpdatePassword}
                  showPassword={true}
                />
              </Form>
            </CardContent>
          </Card>
        </SectionContainer>
      </PageContainer>
    </SessionRoute>
  );
};

export default UpdatePasswordPage;

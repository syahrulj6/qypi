import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Form } from "~/components/ui/form";
import { loginFormSchema, LoginFormSchema } from "../forms/login";
import { LoginFormInner } from "../components/LoginFormInner";

const LoginPage = () => {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
  });

  const handleRegisterSubmit = (values: LoginFormSchema) => {
    alert(`${values.email} Login!`);
  };

  return (
    <PageContainer>
      <SectionContainer
        padded
        className="flex min-h-[calc(100vh-144px)] w-full items-center justify-center"
      >
        <Card className="w-full max-w-[480px]">
          <CardHeader className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-primary">Masuk</h1>
            <p className="text-muted-foreground">
              Qepoin kreator favorite kamu
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <LoginFormInner onRegisterSubmit={handleRegisterSubmit} />
            </Form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between gap-x-4">
              <div className="h-[2px] w-full border-t-2" />
              <p className="flex-1 text-nowrap text-sm text-muted-foreground">
                Atau lanjut dengan
              </p>
              <div className="h-[2px] w-full border-t-2" />
            </div>

            <Button variant="secondary" className="w-full" size="lg">
              <FcGoogle />
              Masuk dengan Google
            </Button>

            <p>
              Belum punya akun?{" "}
              <Link href="/register" className="font-bold text-purple-600">
                P, Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </SectionContainer>
    </PageContainer>
  );
};

export default LoginPage;

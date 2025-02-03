import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase/client";
import { toast } from "sonner";

const VerifyEmailPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      const { code } = router.query; // Ambil kode verifikasi dari URL
      if (typeof code === "string") {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          toast.error(
            "Verifikasi email gagal. Link mungkin sudah kedaluwarsa.",
          );
        } else {
          toast.success("Verifikasi berhasil! Anda bisa login sekarang.");
          router.push("/login");
        }
      }

      setLoading(false);
    };

    if (router.isReady) {
      verifyEmail();
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-lg">
        {loading ? "Verifying email..." : "Redirecting..."}
      </p>
    </div>
  );
};

export default VerifyEmailPage;

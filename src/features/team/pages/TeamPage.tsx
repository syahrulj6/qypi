import { useRouter } from "next/router";
import TeamLayout from "../components/TeamLayout";
import DashboardLayout from "~/components/layout/DashboardLayout";

const TeamPage = () => {
  const router = useRouter();
  const pathSegments = router.asPath.split("/").filter(Boolean);

  const filteredSegments = pathSegments.filter(
    (segment) => segment !== "dashboard",
  );

  const breadcrumbLabels: Record<string, string> = {
    team: "Team",
  };

  const breadcrumbItems = filteredSegments.map((segment, index) => {
    const href = "/" + filteredSegments.slice(0, index + 1).join("/");
    return {
      href: index < filteredSegments.length - 1 ? href : undefined,
      label:
        breadcrumbLabels[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1),
    };
  });

  return (
    <DashboardLayout>
      <TeamLayout breadcrumbItems={breadcrumbItems}>
        <div className=""></div>
      </TeamLayout>
    </DashboardLayout>
  );
};

export default TeamPage;

import { Button } from "~/components/ui/button";

export const SettingsHeader = () => {
  // TODO: button is active
  return (
    <nav className="flex w-fit items-center gap-4">
      <Button>User</Button>
      <Button variant="secondary">Integrations</Button>
      <Button variant="secondary">Security</Button>
    </nav>
  );
};

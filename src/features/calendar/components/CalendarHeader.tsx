import { useState } from "react";

const calendar = [
  {
    id: 1,
    name: "Weekly",
    value: "weekly",
    isActive: true,
  },
  {
    id: 2,
    name: "Monthly",
    value: "monthly",
    isActive: false,
  },
  {
    id: 3,
    name: "Yearly",
    value: "yearly",
    isActive: false,
  },
];

export const CalendarHeader = () => {
  const [activeTab, setActiveTab] = useState("weekly");

  return (
    <div className="mt-2 flex gap-4 md:mt-4">
      {calendar.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 ${
            activeTab === tab.value
              ? "border-b-2 border-primary"
              : "text-muted-foreground transition-colors hover:text-current"
          }`}
          onClick={() => setActiveTab(tab.value)}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
};

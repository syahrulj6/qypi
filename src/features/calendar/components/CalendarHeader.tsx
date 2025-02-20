import React from "react";

const calendarTabs = [
  { id: 1, name: "Weekly", value: "weekly" },
  { id: 2, name: "Monthly", value: "monthly" },
  { id: 3, name: "Yearly", value: "yearly" },
];

export const CalendarHeader = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: any;
}) => {
  return (
    <div className="mt-2 flex gap-4 md:mt-2">
      {calendarTabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 ${
            activeTab === tab.value
              ? "border-b-2 border-primary font-semibold"
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

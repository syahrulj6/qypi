export type ChartActivityConfig = {
  count: {
    label: string;
    color: string;
  };
  INBOX_RECEIVED: {
    label: string;
    color: string;
  };
  INBOX_CREATED: {
    label: string;
    color: string;
  };
  NOTE_CREATED: {
    label: string;
    color: string;
  };
  NOTEBOOK_CREATED: {
    label: string;
    color: string;
  };
  EVENT_CREATED: {
    label: string;
    color: string;
  };
  TEAM_CREATED: {
    label: string;
    color: string;
  };
};

export const chartActivityConfig: ChartActivityConfig = {
  count: {
    label: "Activities",
    color: "#4D55CC",
  },
  INBOX_RECEIVED: {
    label: "Inbox Received",
    color: "#8884d8",
  },
  INBOX_CREATED: {
    label: "Inbox Sent",
    color: "#82ca9d",
  },
  NOTE_CREATED: {
    label: "Note Created",
    color: "#ffc658",
  },
  NOTEBOOK_CREATED: {
    label: "Notebook Created",
    color: "#afa642",
  },
  EVENT_CREATED: {
    label: "Event Created",
    color: "#ff8042",
  },
  TEAM_CREATED: {
    label: "Team Created",
    color: "#D84040",
  },
};

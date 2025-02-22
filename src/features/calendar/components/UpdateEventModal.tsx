import { useForm } from "react-hook-form";
import {
  updateEventSchema,
  type UpdateEventSchema,
} from "../forms/update-event";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { EventFormInner } from "./EventFormInner";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface UpdateEventModal {
  eventId: string;
  //   isOpen: boolean;
  //   onClose: () => void;
}

export const UpdateEventModal = ({
  //   isOpen,
  //   onClose,
  eventId,
}: UpdateEventModal) => {
  const queryClient = useQueryClient();
  const { data: getEventData, isLoading } = api.event.getEventById.useQuery({
    eventId,
  });

  const form = useForm<UpdateEventSchema>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "00:00",
      endTime: "00:00",
      color: "",
    },
  });

  useEffect(() => {
    if (getEventData) {
      form.reset({
        title: getEventData.title,
        color: getEventData.color ?? "",
        date: getEventData.date.getFullYear.toString(),
        startTime: getEventData.startTime.getTime.toString(),
        endTime: getEventData.endTime.getTime.toString(),
      });
    }
  }, [getEventData, form]);

  if (getEventData) return <div className="">{getEventData.title}</div>;
};

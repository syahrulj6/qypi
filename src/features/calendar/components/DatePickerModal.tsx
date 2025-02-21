import { useRef } from "react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { useOutsideClick } from "~/hooks/useOutsideClick";

interface DatePickerProps {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  setShowCalendar: (show: boolean) => void;
}

export const DatePicker = ({
  selected,
  onSelect,
  setShowCalendar,
}: DatePickerProps) => {
  const datePickerModalRef = useRef<HTMLDivElement>(null);
  useOutsideClick(datePickerModalRef, () => setShowCalendar(false));

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="relative w-[300px] rounded-lg border border-current bg-card p-4 shadow-lg"
        ref={datePickerModalRef}
      >
        <h3 className="mb-2 text-center text-lg font-semibold">
          Pilih tanggal
        </h3>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          className="rounded-md border shadow"
        />
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setShowCalendar(false)}>Save</Button>
        </div>
      </div>
    </div>
  );
};

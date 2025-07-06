import { useEffect, useRef, useState } from "react";
import { InputMask, type InputMaskChangeEvent } from "primereact/inputmask";
import { Calendar, type CalendarSelectEvent } from "primereact/calendar";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { parse, format, isValid } from "date-fns";

type InputDateMaskProps = {
  onChange: (data: {
    date: Date | null;
    isValidDate: boolean;
    dateString: string;
  }) => void;
};

function dateToMask(date: Date | null): string {
  if (!date) return "";
  return format(date, "dd/MM/yyyy");
}

function maskToDate(mask: string): Date | null {
  if (!mask || mask.includes("_")) {
    return null;
  }
  const date = parse(mask, "dd/MM/yyyy", new Date());
  return isValid(date) ? date : null;
}

export default function InputDateMask({ onChange }: InputDateMaskProps) {
  const op = useRef<OverlayPanel>(null);

  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    const isValidDate = date !== null && isValid(date);
    const dateString = isValidDate ? format(date, "yyyy-MM-dd") : "";
    onChange({ date, isValidDate, dateString });
  }, [date, onChange]);

  const handleDateChange = (e: CalendarSelectEvent) => {
    setDate(e.value as Date | null);
    if (e.value) {
      op.current?.hide();
    }
  };

  const handleInputMaskChange = (e: InputMaskChangeEvent) => {
    const newDate = maskToDate(e.value ?? "");
    setDate(newDate);
  };

  return (
    <div className="card flex justify-content-center gap-2">
      <InputMask
        mask="99/99/9999"
        placeholder="dd/mm/yyyy"
        value={dateToMask(date)}
        onChange={handleInputMaskChange}
      />

      <Button
        type="button"
        icon="pi pi-calendar"
        onClick={(e) => op.current?.toggle(e)}
      />
      <OverlayPanel ref={op}>
        <Calendar
          value={date}
          onSelect={handleDateChange}
          inline
          showButtonBar
        />
      </OverlayPanel>
    </div>
  );
}

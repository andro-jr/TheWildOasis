import React from "react";
import DateSelector from "./DateSelector";
import ReservationForm from "./ResevationForm";
import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import { Cabin } from "../_types";

interface CabinReservationProps {
  cabin: Cabin;
}

async function CabinReservation({ cabin }: CabinReservationProps) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);
  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />
      <ReservationForm cabin={cabin} />
    </div>
  );
}

export default CabinReservation;

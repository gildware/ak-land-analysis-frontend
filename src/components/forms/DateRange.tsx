import { Card, Datepicker } from "flowbite-react";
import { useLandStore } from "../../store/useLandStore";

const DateRange = () => {
  const startDate = useLandStore((s) => s.startDate);
  const endDate = useLandStore((s) => s.endDate);
  const setStartDate = useLandStore((s) => s.setStartDate);
  const setEndDate = useLandStore((s) => s.setEndDate);

  const today = new Date();

  const startDateObj = startDate ? new Date(startDate) : null;
  const endDateObj = endDate ? new Date(endDate) : null;

  return (
    <Card>
      <b>Date Range</b>

      <div className="flex flex-col gap-3">
        {/* Start Date */}
        <div className="flex flex-col gap-1">
          <small>Start Date</small>
          <Datepicker
            value={startDateObj}
            placeholder="Select start date"
            onChange={(date: any) =>
              setStartDate(date ? date.toISOString() : null)
            }
            maxDate={today}
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1">
          <small>End Date</small>
          <Datepicker
            value={endDateObj}
            placeholder="Select end date"
            onChange={(date: any) =>
              setEndDate(date ? date.toISOString() : null)
            }
            minDate={startDateObj ?? undefined}
            maxDate={today}
          />
        </div>
      </div>
    </Card>
  );
};

export default DateRange;

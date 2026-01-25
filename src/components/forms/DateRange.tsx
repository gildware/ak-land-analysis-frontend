import { Button } from "flowbite-react";
import { useLandStore } from "../../store/useLandStore";
import { useState } from "react";

type PresetKey = "1m" | "3m" | "6m" | "1y" | null;

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const DateRange = () => {
  const startDate = useLandStore((s) => s.startDate);
  const endDate = useLandStore((s) => s.endDate);
  const setStartDate = useLandStore((s) => s.setStartDate);
  const setEndDate = useLandStore((s) => s.setEndDate);

  const [activePreset, setActivePreset] = useState<PresetKey>(null);

  const applyPreset = (months: number, key: PresetKey) => {
    const end = new Date();
    const start = new Date();

    end.setHours(23, 59, 59, 999);
    start.setHours(0, 0, 0, 0);
    start.setMonth(start.getMonth() - months);

    setStartDate(start);
    setEndDate(end);
    setActivePreset(key);
  };

  return (
    <div>
      <span>
        <b> Date Range </b>(
        {startDate && endDate
          ? `${formatDate(startDate)} - ${formatDate(endDate)}`
          : "No date range selected"}
        )
      </span>

      {/* PRESET BUTTONS */}
      <div className="mt-2 flex flex-wrap gap-2">
        <Button
          size="xs"
          color={activePreset === "1m" ? "success" : "gray"}
          onClick={() => applyPreset(1, "1m")}
        >
          Last Month
        </Button>

        <Button
          size="xs"
          color={activePreset === "3m" ? "success" : "gray"}
          onClick={() => applyPreset(3, "3m")}
        >
          3 Months
        </Button>

        <Button
          size="xs"
          color={activePreset === "6m" ? "success" : "gray"}
          onClick={() => applyPreset(6, "6m")}
        >
          6 Months
        </Button>

        <Button
          size="xs"
          color={activePreset === "1y" ? "success" : "gray"}
          onClick={() => applyPreset(12, "1y")}
        >
          1 Year
        </Button>
      </div>

      {/* DISPLAY SELECTED DATES */}
      {/* <div className="mt-4 text-sm">
        {startDate && endDate ? (
          <div className="flex flex-col gap-1">
            <div>
              <b>Start:</b> {formatDate(startDate)}
            </div>
            <div>
              <b>End:</b> {formatDate(endDate)}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 italic">No date range selected</div>
        )}
      </div> */}
    </div>
  );
};

export default DateRange;

// import { Card, Datepicker } from "flowbite-react";
// import { useLandStore } from "../../store/useLandStore";

// const DateRange = () => {
//   const startDate = useLandStore((s) => s.startDate);
//   const endDate = useLandStore((s) => s.endDate);
//   const setStartDate = useLandStore((s) => s.setStartDate);
//   const setEndDate = useLandStore((s) => s.setEndDate);

//   const today = new Date();

//   const startDateObj = startDate ? new Date(startDate) : null;
//   const endDateObj = endDate ? new Date(endDate) : null;

//   return (
//     <Card>
//       <b>Date Range</b>

//       <div className="flex flex-col gap-3">
//         {/* Start Date */}
//         <div className="flex flex-col gap-1">
//           <small>Start Date</small>
//           <Datepicker
//             value={startDateObj}
//             placeholder="Select start date"
//             onChange={(date: any) =>
//               setStartDate(date ? date.toISOString() : null)
//             }
//             maxDate={today}
//           />
//         </div>

//         {/* End Date */}
//         <div className="flex flex-col gap-1">
//           <small>End Date</small>
//           <Datepicker
//             value={endDateObj}
//             placeholder="Select end date"
//             onChange={(date: any) =>
//               setEndDate(date ? date.toISOString() : null)
//             }
//             minDate={startDateObj ?? undefined}
//             maxDate={today}
//           />
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default DateRange;

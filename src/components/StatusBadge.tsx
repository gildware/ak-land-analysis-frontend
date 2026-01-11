import { Badge } from "flowbite-react";
import { HiCheckCircle, HiXCircle, HiClock, HiRefresh } from "react-icons/hi";
import type { ComponentType } from "react";

export type AnalysisStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "checking";

interface StatusBadgeProps {
  status: AnalysisStatus | string;
}

const STATUS_CONFIG = {
  pending: {
    color: "warning",
    label: "Pending",
    icon: HiClock,
  },
  checking: {
    color: "info",
    label: "Checking",
    icon: HiRefresh,
  },
  running: {
    color: "info",
    label: "Running",
    icon: HiRefresh,
  },
  completed: {
    color: "success",
    label: "Success",
    icon: HiCheckCircle,
  },
  failed: {
    color: "failure",
    label: "Failed",
    icon: HiXCircle,
  },
} satisfies Record<
  AnalysisStatus,
  {
    color: "warning" | "info" | "success" | "failure";
    label: string;
    icon: ComponentType<{ className?: string }>;
  }
>;

const DEFAULT_STATUS = {
  color: "warning" as const,
  label: "Unknown",
  icon: HiClock,
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const {
    color,
    label,
    icon: Icon,
  } = STATUS_CONFIG[status as AnalysisStatus] ?? DEFAULT_STATUS;

  return (
    <Badge color={color}>
      <span className="flex items-center gap-1 whitespace-nowrap">
        <Icon
          className={`h-4 w-4 shrink-0 ${
            status === "running" || status === "checking" ? "animate-spin" : ""
          }`}
        />
        <span className="leading-none">{label}</span>
      </span>
    </Badge>
  );
};

export default StatusBadge;

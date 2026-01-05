import { Tooltip } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

interface IndexButtonProps {
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const IndexButton = ({
  label,
  description,
  active,
  onClick,
  disabled = false,
}: IndexButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-10 w-28 items-center justify-center gap-2 rounded-lg border transition-colors duration-150 ${
        disabled
          ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
          : active
            ? "cursor-pointer border-green-600 bg-green-600 text-white"
            : "cursor-pointer border-gray-400 bg-white text-gray-800 hover:bg-gray-50"
      } `}
    >
      <span className="text-sm font-semibold">{label}</span>

      <Tooltip content={description} placement="bottom">
        <span
          onClick={(e) => e.stopPropagation()}
          className={`${
            disabled
              ? "pointer-events-none opacity-40"
              : "opacity-80 hover:opacity-100"
          }`}
        >
          <HiInformationCircle size={16} />
        </span>
      </Tooltip>
    </button>
  );
};

export default IndexButton;

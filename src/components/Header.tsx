import { Navbar, Button } from "flowbite-react";
import { HiMenu } from "react-icons/hi";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <Navbar fluid className="bg-black p-5 text-white">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold">APPLE KUL LAND ANALYSIS</span>
        </div>

        {/* Mobile menu */}
        <Button
          color="gray"
          size="sm"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <HiMenu className="h-5 w-5" />
        </Button>
      </div>
    </Navbar>
  );
}

import { Drawer } from "flowbite-react";
import Sidebar from "./Sidebar";

export default function SidebarDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Mobile: Bottom sheet */}
      <div className="sm:hidden">
        <Drawer
          open={open}
          onClose={onClose}
          position="bottom"
          className="h-[85vh]"
        >
          <div className="flex h-full flex-col">
            <div className="border-b px-4 py-3 text-lg font-semibold">
              Analysis
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <Sidebar />
            </div>
          </div>
        </Drawer>
      </div>

      {/* Tablet: Left drawer (90% width) */}
      <div className="hidden sm:block lg:hidden">
        <Drawer
          open={open}
          onClose={onClose}
          position="left"
          className="w-[90vw]"
        >
          <div className="flex h-full flex-col">
            <div className="border-b px-4 py-3 text-lg font-semibold">
              Analysis
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <Sidebar />
            </div>
          </div>
        </Drawer>
      </div>
    </>
  );
}

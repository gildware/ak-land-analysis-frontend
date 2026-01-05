import { Card, Select } from "flowbite-react";

const SatelliteSelector = () => {
  return (
    <Card>
      <h3 className="text-sm font-semibold">Select Satellite</h3>
      <Select disabled>
        <option>Sentinel-2</option>
      </Select>
    </Card>
  );
};

export default SatelliteSelector;

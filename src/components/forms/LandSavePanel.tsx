import { useState, type JSX } from "react";
import { useLandStore } from "../../store/useLandStore";
import { Button, TextInput } from "flowbite-react";

export default function LandSavePanel(): JSX.Element | null {
  const [name, setName] = useState("");

  const { draftGeometry, createLand, loading } = useLandStore();

  if (!draftGeometry) return null;

  const handleSave = async (): Promise<void> => {
    if (!name.trim()) return;

    await createLand({
      name,
      geometry: draftGeometry,
    });

    setName("");
  };

  return (
    <div className="land-save-panel">
      <div className="flex justify-between gap-2">
        <div>
          <TextInput
            id="landName"
            type="text"
            placeholder="Enter Land Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button color="dark" onClick={handleSave} disabled={loading}>
          Save Land
        </Button>
      </div>
    </div>
  );
}

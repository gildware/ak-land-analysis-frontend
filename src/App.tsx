import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import Dashboard from "./pages/Dashboard";
import { useLandStore } from "./store/useLandStore";
import { useEffect } from "react";

const App = () => {
  const loadLands = useLandStore((s) => s.loadLands);

  useEffect(() => {
    loadLands();
  }, []);
  return <Dashboard />;
};

export default App;

import { useEffect, useState } from 'react';
import { useVideoContext } from '../contexts/VideoContext';

type VideoFilterSliderProps = {
    videoIndex: "firstSource"  | "secondSource";
};

const VideoFilterSlider = ({ videoIndex }: VideoFilterSliderProps) => {
  const videoContext = useVideoContext();
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);

  // Funktion, um die Filtereinstellungen auf das Video anzuwenden
  const applyFilters = () => {
    // Hier kannst du die Filter auf das Video anwenden.
    // Wir verwenden die Video-Remote-Control, um die Filtereinstellungen anzupassen.
    if (videoContext[videoIndex].remote) {
      videoContext[videoIndex].remote.setFilters({
        brightness: brightness / 100, // Der Wert sollte zwischen 0 und 2 liegen (0 bedeutet keine Helligkeitsänderung).
        contrast: contrast / 100, // Der Wert sollte zwischen 0 und 2 liegen (1 bedeutet keine Kontraständerung).
      });
    }
  };

  // Effekt, um die Filter anzuwenden, wenn sich die Einstellungen ändern.
  useEffect(() => {
    applyFilters();
  }, [brightness, contrast]);

  return (
    <div>
      <div>
        <label htmlFor="brightnessSlider">Helligkeit</label>
        <input
          id="brightnessSlider"
          type="range"
          min="0"
          max="200"
          value={brightness}
          onChange={(e) => setBrightness(Number(e.target.value))}
        />
        <span>{brightness}%</span>
      </div>
      <div>
        <label htmlFor="contrastSlider">Kontrast</label>
        <input
          id="contrastSlider"
          type="range"
          min="0"
          max="200"
          value={contrast}
          onChange={(e) => setContrast(Number(e.target.value))}
        />
        <span>{contrast}%</span>
      </div>
    </div>
  );
};

export default VideoFilterSlider;

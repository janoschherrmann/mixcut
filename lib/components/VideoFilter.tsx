import { useEffect, useRef, useState } from 'react';
import { useVideoContext } from '../contexts/VideoContext';

type VideoFilterSliderProps = {
  videoIndex: "firstSource" | "secondSource";
};

const VideoFilterSlider = ({ videoIndex }: VideoFilterSliderProps) => {
  const videoContext = useVideoContext();
  const [isBlackAndWhite, setIsBlackAndWhite] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const applyBlackAndWhiteFilter = () => {
      if (isBlackAndWhite) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);

        if (imageData) {
          for (let i = 0; i < imageData.data.length; i += 4) {
            const gray = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            imageData.data[i] = gray;
            imageData.data[i + 1] = gray;
            imageData.data[i + 2] = gray;
          }
          ctx?.putImageData(imageData, 0, 0);
        }
      } else {
        // Wenn Schwarz-Weiß-Filter deaktiviert ist, zeige das Originalvideo an
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      requestAnimationFrame(applyBlackAndWhiteFilter);
    };

    const handleLoadedMetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    requestAnimationFrame(applyBlackAndWhiteFilter);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [isBlackAndWhite]);

  return (
    <div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isBlackAndWhite}
            onChange={() => setIsBlackAndWhite(!isBlackAndWhite)}
          />
          Schwarz/Weiß
        </label>
      </div>
      <video ref={videoRef} controls src={videoContext[videoIndex].file?.name} width="400" height="300" />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default VideoFilterSlider;

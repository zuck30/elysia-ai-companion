import React, { useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';

interface CameraFeedProps {
  isActive: boolean;
  onFrame: (image: string) => void;
  isHidden?: boolean;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ isActive, onFrame, isHidden = true }) => {
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    if (isActive && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onFrame(imageSrc);
      }
    }
  }, [isActive, onFrame]);

  useEffect(() => {
    const interval = setInterval(capture, 5000); // Capture every 5 seconds for analysis
    return () => clearInterval(interval);
  }, [capture]);

  return (
    <div className={isHidden ? "hidden" : "relative group"}>
      {isActive && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full h-full object-cover rounded-lg"
          videoConstraints={{ facingMode: "user" }}
        />
      )}
    </div>
  );
};

export default CameraFeed;

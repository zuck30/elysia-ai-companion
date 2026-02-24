import React, { useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, CameraOff } from 'lucide-react';

interface CameraFeedProps {
  isActive: boolean;
  onFrame: (image: string) => void;
  toggleCamera: () => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ isActive, onFrame, toggleCamera }) => {
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
    <div className="relative group">
      <div className={`w-48 h-36 rounded-lg overflow-hidden border-2 transition-colors ${isActive ? 'border-purple-500' : 'border-gray-700'}`}>
        {isActive ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <CameraOff className="text-gray-600" size={32} />
          </div>
        )}
      </div>
      <button
        onClick={toggleCamera}
        className="absolute bottom-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
      >
        {isActive ? <Camera size={16} /> : <CameraOff size={16} />}
      </button>
    </div>
  );
};

export default CameraFeed;

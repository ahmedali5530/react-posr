import { Button } from '@/components/common/input/button';
import React, { useState, useEffect } from 'react';
import { SecurityAction } from '@/providers/security.provider';

interface BiometricAuthProps {
  onSuccess: () => void;
  onCancel: () => void;
  currentAction?: SecurityAction | null;
}

export const BiometricAuth: React.FC<BiometricAuthProps> = ({ 
  onSuccess, 
  onCancel,
  currentAction
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate biometric scan
    const timer = setTimeout(() => {
      if (isScanning) {
        // Simulate successful scan after 2 seconds
        onSuccess();
        setIsScanning(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isScanning, onSuccess]);

  const handleStartScan = () => {
    setIsScanning(true);
    setError('');
  };

  const handleCancel = () => {
    setIsScanning(false);
    onCancel();
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          {isScanning ? (
            <div className="animate-pulse">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
          ) : (
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          )}
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isScanning ? 'Scanning...' : 'Biometric Authentication'}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          {isScanning 
            ? 'Please place your finger on the sensor' 
            : 'Use your fingerprint to authenticate'
          }
        </p>
        
        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}
      </div>

      <div className="flex space-x-3 pt-2">
        <Button
          type="button"
          onClick={handleCancel}
          variant='secondary'
          className="flex-1 lg"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleStartScan}
          disabled={isScanning}
          variant='primary'
          className="flex-1 lg"
          active
        >
          {isScanning ? 'Scanning...' : 'Start Scan'}
        </Button>
      </div>
    </div>
  );
};

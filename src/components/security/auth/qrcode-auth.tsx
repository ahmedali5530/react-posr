import { Button } from '@/components/common/input/button';
import React, { useState, useEffect } from 'react';
import { SecurityAction } from '@/providers/security.provider';
import QRCode from "react-qr-code";

interface QrCodeAuthProps {
  onSuccess: () => void;
  onCancel: () => void;
  currentAction?: SecurityAction | null;
}

export const QrCodeAuth: React.FC<QrCodeAuthProps> = ({
  onSuccess, 
  onCancel,
  currentAction
}) => {
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate biometric scan

  }, [onSuccess]);

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          QR Code Authentication
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Scan this QR Code with your manager App
        </p>

        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        <div className="mx-auto flex items-center justify-center mb-4">
          <QRCode value={`posr-auth://${JSON.stringify(currentAction.payload)}`}/>
        </div>
      </div>
    </div>
  );
};

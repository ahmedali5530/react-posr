import { Button } from '@/components/common/input/button';
import React, { useState, useEffect } from 'react';
import { SecurityAction } from '@/providers/security.provider';

interface PinAuthProps {
  onSuccess: () => void;
  onCancel: () => void;
  currentAction?: SecurityAction | null;
}

export const PinAuth: React.FC<PinAuthProps> = ({ 
  onSuccess, 
  onCancel, 
  currentAction
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // TODO: Authenticate against database
    // For now, just call onSuccess to allow authentication
    onSuccess();
    setPin('');
  };

  const handleKeyPress = (key: string) => {
    switch (key) {
      case 'Enter':
        handleSubmit({ preventDefault: () => {} } as React.FormEvent);
        break;
      case 'Escape':
        onCancel();
        break;
      case 'Backspace':
        handleDelete();
        break;
      default:
        if (/^[0-9]$/.test(key)) {
          handleNumberClick(key);
        }
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', (e) => handleKeyPress(e.key));
    return () => document.removeEventListener('keydown', (e) => handleKeyPress(e.key));
  }, []);

  const btnClasses = 'size-[85px] sm:size-[100px] md:size-[120px] p-0 text-neutral-900 active:scale-[0.95] transition-all duration-75 bg-neutral-100 active:text-neutral-100 active:bg-neutral-900 rounded-full text-3xl';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        {currentAction?.module && (
          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            <strong>Module:</strong> {currentAction.module}
          </div>
        )}
        
        {error && (
          <div className="my-4 alert alert-danger">{error}</div>
        )}
        
        {/* PIN Dots Display */}
        <div className="flex justify-center space-x-2 mb-6">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                i < pin.length 
                  ? 'bg-gray-900 border-gray-900' 
                  : 'bg-gray-100 border-gray-300'
              }`}
            >
              {i < pin.length && (
                <div className="w-3 h-3 bg-white rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Numeric Keypad */}
      <div className="flex justify-center ">
        <div className="wrapper w-[400px]">
          <div className="grid grid-cols-3 gap-2 sm:gap-5 place-items-center">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumberClick(num)}
                className={btnClasses}
              >
                {num}
              </button>
            ))}
            
            <button
              type="button"
              onClick={handleDelete}
              className="btn-login danger"
            >
              ←
            </button>
            
            <button
              type="button"
              onClick={() => handleNumberClick('0')}
              className={btnClasses}
            >
              0
            </button>
            
            <button
              type="button"
              onClick={handleClear}
              className="btn-login danger"
            >
              C
            </button>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          className="flex-1 lg"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 lg"
          variant="primary"
          active
        >
          Confirm
        </Button>
      </div>
    </form>
  );
};

import { Button } from '@/components/common/input/button';
import React, { useState } from 'react';
import { SecurityAction } from '@/providers/security.provider';

interface PasswordAuthProps {
  onSuccess: () => void;
  onCancel: () => void;
  currentAction?: SecurityAction | null;
}

export const PasswordAuth: React.FC<PasswordAuthProps> = ({ 
  onSuccess, 
  onCancel,
  currentAction
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // TODO: Authenticate against database
    // For now, just call onSuccess to allow authentication
    onSuccess();
    setPassword('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enter Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your password"
          autoFocus
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>

      <div className="flex space-x-3 pt-2">
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

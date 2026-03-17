import { Button } from '@/components/common/input/button';
import { Input } from '@/components/common/input/input';
import React, { useState } from 'react';
import { SecurityAction } from '@/providers/security.provider';

interface AdminCodeAuthProps {
  onSuccess: () => void;
  onCancel: () => void;
  currentAction?: SecurityAction | null;
}

export const AdminCodeAuth: React.FC<AdminCodeAuthProps> = ({ 
  onSuccess, 
  onCancel,
  currentAction
}) => {
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // TODO: Authenticate against database
    // For now, just call onSuccess to allow authentication
    onSuccess();
    setAdminCode('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enter Admin Code
        </label>
        <Input
          type="password"
          value={adminCode}
          onChange={(e) => setAdminCode(e.target.value)}
          placeholder="Enter administrator code"
          autoFocus
        />
        {error && (
          <p className="mt-1 text-sm text-danger-600">{error}</p>
        )}
      </div>

      <div className="alert alert-warning ">
        <strong>Note:</strong> This requires administrator privileges. Contact your system administrator if you don't have access.
      </div>

      <div className="flex space-x-3 pt-2">
        <Button
          type="button"
          onClick={onCancel}
          variant='secondary'
          className="flex-1 lg"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant='primary'
          className="flex-1 lg"
          active
        >
          Verify Admin
        </Button>
      </div>
    </form>
  );
};

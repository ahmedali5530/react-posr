import React from 'react';
import { useSecurity } from '@/hooks/useSecurity';

// Example 1: Using useSecurity hook with different auth types
export const ExampleAuthTypes: React.FC = () => {
  const { protectAction } = useSecurity();

  const handlePinAction = () => {
    console.log('PIN authenticated action executed!');
  };

  const handlePasswordAction = () => {
    console.log('Password authenticated action executed!');
  };

  const handleBiometricAction = () => {
    console.log('Biometric authenticated action executed!');
  };

  const handleAdminAction = () => {
    console.log('Admin code authenticated action executed!');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Different Authentication Types</h3>
      
      <button
        onClick={() => protectAction(handlePinAction, {
          description: "Verify with PIN to proceed",
          authType: 'pin'
        })}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
      >
        PIN Authentication
      </button>

      <button
        onClick={() => protectAction(handlePasswordAction, {
          description: "Verify with password to proceed",
          authType: 'password'
        })}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2"
      >
        Password Authentication
      </button>

      <button
        onClick={() => protectAction(handleBiometricAction, {
          description: "Verify with biometric to proceed",
          authType: 'biometric'
        })}
        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded mr-2"
      >
        Biometric Authentication
      </button>

      <button
        onClick={() => protectAction(handleAdminAction, {
          description: "Verify with admin code to proceed",
          authType: 'admin-code'
        })}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Admin Code Authentication
      </button>
    </div>
  );
};

// Example 2: Using useSecurity hook directly with callbacks
export const ExampleCustomSecurity: React.FC = () => {
  const { protectAction } = useSecurity();

  const handleCustomAction = () => {
    console.log('Custom action executed!');
    // Perform your custom action here
  };

  const handleClick = () => {
    protectAction(handleCustomAction, {
      description: "Perform this custom administrative action?",
      authType: 'admin-code',
      onSuccess: () => {
        console.log('Action completed successfully!');
      },
      onCancel: () => {
        console.log('Action was cancelled by user.');
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
    >
      Custom Protected Action
    </button>
  );
};

// Example 3: Multiple protected actions in one component
export const ExampleMultipleActions: React.FC = () => {
  const { protectAction } = useSecurity();

  const handleExport = () => {
    console.log('Exporting data...');
    // Export logic here
  };

  const handleImport = () => {
    console.log('Importing data...');
    // Import logic here
  };

  const handleReset = () => {
    console.log('Resetting settings...');
    // Reset logic here
  };

  const handleDelete = () => {
    console.log('Deleting critical data...');
    // Delete logic here
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Administrative Actions</h3>
      
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => protectAction(handleExport, {
            description: "Export all data? This may take a few moments.",
            authType: 'password'
          })}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Export Data
        </button>

        <button
          onClick={() => protectAction(handleImport, {
            description: "Import data? This will overwrite existing data.",
            authType: 'password'
          })}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Import Data
        </button>

        <button
          onClick={() => protectAction(handleReset, {
            description: "Reset all settings? This action cannot be undone.",
            authType: 'admin-code'
          })}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          Reset Settings
        </button>

        <button
          onClick={() => protectAction(handleDelete, {
            description: "Delete critical data? This cannot be undone.",
            authType: 'admin-code'
          })}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete Data
        </button>
      </div>
    </div>
  );
};

// Example 4: Form submission with security
export const ExampleSecureForm: React.FC = () => {
  const { protectFormSubmit } = useSecurity();

  const handleFormSubmit = () => {
    console.log('Form submitted successfully!');
    // Handle your form submission here
  };

  const secureSubmitHandler = protectFormSubmit(handleFormSubmit, {
    description: "Submit this sensitive form? Please verify your identity.",
    authType: 'pin'
  });

  return (
    <form onSubmit={secureSubmitHandler} className="space-y-4">
      <h3 className="text-lg font-semibold">Secure Form</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sensitive Field
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter sensitive data"
        />
      </div>
      
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Form
      </button>
    </form>
  );
};

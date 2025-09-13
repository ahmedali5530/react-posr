import React, { useState } from 'react';
import { Input } from './components/common/input/input';

export const KeyboardTest = () => {
  const [textValue, setTextValue] = useState('');
  const [numberValue, setNumberValue] = useState('');

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Keyboard Test</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Text Input with Keyboard</h2>
          <Input
            type="text"
            placeholder="Touch to open keyboard"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            enableKeyboard={true}
            label="Text Input"
          />
          <p className="text-sm text-gray-600 mt-1">Current value: {textValue}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Number Input with Keyboard</h2>
          <Input
            type="number"
            placeholder="Touch to open numeric keyboard"
            value={numberValue}
            onChange={(e) => setNumberValue(e.target.value)}
            enableKeyboard={true}
            label="Number Input"
          />
          <p className="text-sm text-gray-600 mt-1">Current value: {numberValue}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Regular Input (No Keyboard)</h2>
          <Input
            type="text"
            placeholder="Regular input without keyboard"
            label="Regular Input"
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Test Instructions:</h3>
        <ul className="text-sm space-y-1">
          <li>• Touch the text input to see alphanumeric keyboard with caps lock</li>
          <li>• Touch the number input to see numeric keyboard</li>
          <li>• Test caps lock functionality on text keyboard</li>
          <li>• Test backspace, space, and close buttons</li>
          <li>• Verify keyboard closes when clicking the close button</li>
          <li>• Check that values update correctly when keyboard closes</li>
        </ul>
      </div>
    </div>
  );
};

export default KeyboardTest;
import {forwardRef, InputHTMLAttributes, ReactNode, Ref, useCallback, useMemo, useState} from "react";
import {NumericFormat} from "react-number-format";
import {cn} from "@/lib/utils.ts";
import {nanoid} from "nanoid";
import {Modal} from "@/components/common/react-aria/modal.tsx";
import {Button} from "@/components/common/input/button.tsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: "lg"
  selectable?: boolean;
  hasError?: boolean;
  label?: ReactNode;
  error?: any;
  enableKeyboard?: boolean;
  disableDirectInput?: boolean;
}

export const Input = forwardRef((props: InputProps, ref: Ref<any>) => {
  const {selectable, inputSize, hasError, label, error, enableKeyboard, disableDirectInput, ...rest} = props;
  const onClick = useCallback((event: any) => {
    if (selectable !== false) {
      event.currentTarget.select();
    }
  }, [selectable]);

  // Keyboard functionality
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardValue, setKeyboardValue] = useState(props.value?.toString() || '');
  const [isCaps, setIsCaps] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const letters: {
    [index: string]: { normal: string | ReactNode, shift: string | ReactNode }
  } = {
    'a': {normal: 'a', shift: 'A'}, 'b': {normal: 'b', shift: 'B'}, 'c': {normal: 'c', shift: 'C'},
    'd': {normal: 'd', shift: 'D'}, 'e': {normal: 'e', shift: 'E'}, 'f': {normal: 'f', shift: 'F'},
    'g': {normal: 'g', shift: 'G'}, 'h': {normal: 'h', shift: 'H'}, 'i': {normal: 'i', shift: 'I'},
    'j': {normal: 'j', shift: 'J'}, 'k': {normal: 'k', shift: 'K'}, 'l': {normal: 'l', shift: 'L'},
    'm': {normal: 'm', shift: 'M'}, 'n': {normal: 'n', shift: 'N'}, 'o': {normal: 'o', shift: 'O'},
    'p': {normal: 'p', shift: 'P'}, 'q': {normal: 'q', shift: 'Q'}, 'r': {normal: 'r', shift: 'R'},
    's': {normal: 's', shift: 'S'}, 't': {normal: 't', shift: 'T'}, 'u': {normal: 'u', shift: 'U'},
    'v': {normal: 'v', shift: 'V'}, 'w': {normal: 'w', shift: 'W'}, 'x': {normal: 'x', shift: 'X'},
    'y': {normal: 'y', shift: 'Y'}, 'z': {normal: 'z', shift: 'Z'},
    '`': {normal: '`', shift: '~'}, '1': {normal: '1', shift: '!'}, '2': {normal: '2', shift: '@'},
    '3': {normal: '3', shift: '#'}, '4': {normal: '4', shift: '$'}, '5': {normal: '5', shift: '%'},
    '6': {normal: '6', shift: '^'}, '7': {normal: '7', shift: '&'}, '8': {normal: '8', shift: '*'},
    '9': {normal: '9', shift: '('}, '0': {normal: '0', shift: ')'}, '-': {normal: '-', shift: '_'},
    '=': {normal: '=', shift: '+'}, '[': {normal: '[', shift: '{'}, ']': {normal: ']', shift: '}'},
    ';': {normal: ';', shift: ':'}, "'": {normal: "'", shift: '"'}, ',': {normal: ',', shift: '<'},
    '.': {normal: '.', shift: '>'}, '/': {normal: '/', shift: '?'}, "\\": {normal: "\\", shift: '|'},
    '*bs': {normal: '⌫', shift: '⌫'},
    '*caps': {normal: 'caps', shift: 'CAPS'}, '*space': {normal: 'Space', shift: 'Space'},
    '*clear': {normal: 'C', shift: 'C'}
  };

  const numericLayout = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['.', '0',],
    ['*clear', '*bs']
  ];

  const alphaLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '*bs'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['*caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
    ['*space', '*clear']
  ];

  const keyboardLayout = props.type === 'number' ? numericLayout : alphaLayout;

  const handleKeyPress = useCallback((key: string) => {
    if (key === '*bs') {
      setKeyboardValue(prev => prev.slice(0, -1));
    } else if (key === '*caps') {
      setIsCaps(!isCaps);
    } else if (key === '*space') {
      setKeyboardValue(prev => prev + ' ');
    } else if (key === '*clear') {
      setKeyboardValue('');
    } else if (key === '.') {
      // For decimal numbers, only add if not already present
      if (props.type === 'number' && !keyboardValue.includes('.')) {
        setKeyboardValue(prev => prev + key);
      } else if (props.type !== 'number') {
        setKeyboardValue(prev => prev + key);
      }
    } else {
      // Regular character input
      const char = letters[key] ? letters[key][isCaps ? 'shift' : 'normal'] : key;
      setKeyboardValue(prev => prev + char);
    }

    if (props.onChange) {
      const event = {target: {value: keyboardValue}} as any;
      props.onChange(event);
    }

  }, [keyboardValue, isCaps, props.onChange, letters]);

  const handleInputFocus = useCallback(() => {
    if (enableKeyboard && !isClosing) {
      setKeyboardValue(props.value?.toString() || '');
      setShowKeyboard(true);
    }
  }, [enableKeyboard, props.value, isClosing]);

  const handleKeyboardClose = useCallback(() => {
    setIsClosing(true);
    setShowKeyboard(false);
    // Optionally sync final value on close (kept disabled to avoid triggering focus loops via external state updates)
    if (props.onChange) {
      const event = { target: { value: keyboardValue } } as any;
      props.onChange(event);
    }
    // Reset closing flag after minimal delay to prevent immediate reopen on input focus
    setTimeout(() => setIsClosing(false), 1);
  }, [keyboardValue, props.onChange]);

  const id = nanoid();

  const formattedHelp = useMemo(() => {
    return error && <InputError error={error}/>
  }, [error,]);

  if (props.type === 'number') {
    return (
      <>
        {label && <label htmlFor={id}>{label}</label>}
        <NumericFormat
          name={props.name}
          value={enableKeyboard ? keyboardValue : props.value as any}
          defaultValue={props.defaultValue as any}
          onChange={enableKeyboard ? undefined : props.onChange}
          autoComplete="off"
          className={
            cn(
              'input',
              inputSize === 'lg' && 'lg',
              props.className && props.className,
              hasError && 'error'
            )
          }
          getInputRef={ref}
          onClick={onClick}
          readOnly={enableKeyboard ? true : props.readOnly}
          disabled={props.disabled}
          placeholder={props.placeholder}
          autoFocus={props.autoFocus}
          onFocus={enableKeyboard ? handleInputFocus : props.onFocus}
          onBlur={props.onBlur}
          id={id}
        />
        {formattedHelp}
        {enableKeyboard && showKeyboard && (
          <Modal
            open={showKeyboard}
            onClose={handleKeyboardClose}
            size="lg"
            shouldCloseOnEsc
            shouldCloseOnOverlayClick
            title={<>&nbsp;</>}
            shouldCenter
            bottomSheet
          >
            <div className="container p-4">
              <div className="mb-4">
                <input
                  type={props.type}
                  className="form-control w-full"
                  placeholder={props.placeholder}
                  value={keyboardValue}
                  readOnly
                />
              </div>
              <div className="flex gap-y-2 flex-col">
                {keyboardLayout.map((row: string[], rowIndex: number) => (
                  <div key={rowIndex} className="flex gap-2 flex-row justify-center">
                    {row.map((key, keyIndex) => (
                      <Button
                        key={`${rowIndex}-${keyIndex}`}
                        className={
                          cn(
                            "btn btn-keyboard",
                            key === '*clear' && '!bg-danger-500 text-white',
                            key === '*bs' && '!bg-danger-500 text-white',
                            key === '*space' && '!w-[250px]'
                          )
                        }
                        onClick={() => handleKeyPress(key)}
                        size="lg"
                      >
                        {letters[key] ? letters[key][isCaps ? 'shift' : 'normal'] : key}
                      </Button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Modal>
        )}
      </>
    );
  } else {
    return (
      <>
        {label && <label htmlFor={id}>{label}</label>}
        <input
          type="text"
          onClick={onClick}
          autoComplete="off"
          {...rest}
          value={enableKeyboard ? keyboardValue : rest.value}
          onChange={enableKeyboard ? undefined : rest.onChange}
          onFocus={enableKeyboard ? handleInputFocus : rest.onFocus}
          readOnly={enableKeyboard ? true : rest.readOnly}
          className={
            cn(
              'input',
              inputSize === 'lg' && 'lg',
              props.className && props.className,
              hasError && 'error'
            )
          }
          ref={ref}
          id={id}
        />
        {formattedHelp}
        {enableKeyboard && showKeyboard && (
          <Modal
            open={showKeyboard}
            onClose={handleKeyboardClose}
            size="lg"
            shouldCloseOnEsc
            shouldCloseOnOverlayClick
            title={<>&nbsp;</>}
            shouldCenter
            bottomSheet
          >
            <div className="container p-4">
              <div className="mb-4">
                <input
                  type={props.type}
                  className="form-control w-full"
                  placeholder={props.placeholder}
                  value={keyboardValue}
                  readOnly
                />
              </div>
              <div className="flex gap-y-2 flex-col">
                {keyboardLayout.map((row: string[], rowIndex: number) => (
                  <div key={rowIndex} className="flex gap-2 flex-row justify-center">
                    {row.map((key, keyIndex) => (
                      <button
                        className={
                          cn(
                            "btn btn-keyboard",
                            key === '*clear' && '!bg-danger-500 text-white',
                            key === '*space' && '!w-[250px]',
                            key === '*bs' && '!bg-danger-500 text-white',
                          )
                        }
                        key={`${rowIndex}-${keyIndex}`}
                        onClick={() => handleKeyPress(key)}
                      >
                        {letters[key] ? letters[key][isCaps ? 'shift' : 'normal'] : key}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Modal>
        )}
      </>
    );
  }
});

export const InputError = ({
  error
}: { error?: ReactNode }) => {
  return (
    <div className="text-danger-500 text-sm">{error}</div>
  );
}

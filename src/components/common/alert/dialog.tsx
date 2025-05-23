import React from "react";
import {useAtom} from "jotai/index";
import {appAlert} from "@/store/jotai.ts";
import {Modal} from "@/components/common/react-aria/modal.tsx";
import colors from 'tailwindcss/colors';


export const Alert = () => {
  const [state, setState] = useAtom(appAlert);

  const closeDialog = async () => {
    setState(prev => ({
      ...prev,
      opened: false,
      message: '',
    }))
  }

  const color = () => {
    switch (state.type) {
      case "success":
        return colors.green[400];
      case "error":
        return colors.red[400];
      case "warning":
        return colors.yellow[400];
      case "info":
        return colors.blue[400];
      default:
        return colors.white;
    }
  }

  return (
    <Modal
      title={state.type}
      shouldCloseOnOverlayClick
      open={state.opened}
      size="sm"
      onClose={closeDialog}
      shouldCenter
      backgroundColor={color()}
    >
      <p className="p-5 text-center text-2xl">{state.message}</p>
    </Modal>
  );
};
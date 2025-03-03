import React, {createContext, useState, useContext, CSSProperties} from "react";
import {useAtom} from "jotai/index";
import {appAlert} from "@/store/jotai.ts";
import {Modal} from "@/components/common/react-aria/modal.tsx";


export const Alert = () => {
  const [state, setState] = useAtom(appAlert);

  const closeDialog = async () => {
    setState(prev => ({
      ...prev,
      opened: false,
      message: '',
    }))
  }

  return (
    <Modal
      title={state.type}
      shouldCloseOnOverlayClick
      open={state.opened}
      size="sm"
      onClose={closeDialog}
    >
      <p>{state.message}</p>
    </Modal>
  );
};
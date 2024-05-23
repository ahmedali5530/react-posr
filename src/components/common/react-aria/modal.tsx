import React, { FunctionComponent, PropsWithChildren, ReactNode, useEffect, useState, } from "react";
import { Dialog, Heading, Modal as ReactAriaModal, ModalOverlay } from 'react-aria-components';
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/lib/utils.ts";

interface ModalProps extends PropsWithChildren {
  open?: boolean;
  onClose?: () => void;
  title?: ReactNode;
  shouldCloseOnOverlayClick?: boolean;
  shouldCloseOnEsc?: boolean;
  hideCloseButton?: boolean;
  transparentContainer?: boolean;
  header?: ReactNode;
  size?: "full" | "bottom-sheet" | "sm" | "md" | "lg";
  backdrop?: boolean;
}

export const Modal: FunctionComponent<ModalProps> = (props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if( typeof props.open !== "undefined" ) {
      setOpen(props.open);
    }
  }, [props.open]);

  const close = (isOpen: boolean) => {
    if(!isOpen) {
      setOpen(false);
      props.onClose!();
    }
  };

  return (
    <>
      <ModalOverlay
        isDismissable={props.shouldCloseOnOverlayClick === undefined ? true : props.shouldCloseOnOverlayClick}
        isKeyboardDismissDisabled={props.shouldCloseOnEsc === undefined ? true : props.shouldCloseOnEsc}
        isOpen={open}
        onOpenChange={close}
      >
        <ReactAriaModal
          isOpen={open}
          isDismissable={props.shouldCloseOnOverlayClick === undefined ? true : props.shouldCloseOnOverlayClick}
          isKeyboardDismissDisabled={props.shouldCloseOnEsc === undefined ? true : props.shouldCloseOnEsc}
          onOpenChange={close}
        >
          <Dialog
            className={cn(
              'react-aria-Dialog',
              props.size === "full" && "modal-full",
              props.size === "bottom-sheet" && "modal-bottom-sheet",
              props.size === "sm" && "modal-sm",
              props.size === 'lg' && 'modal-lg',
              (!props.size || props.size === "md") && 'modal-md',
              !props.backdrop && 'no-backdrop'
            )}
          >
            <div style={{
              backgroundColor: 'rgb(255, 255, 255)',
              backdropFilter: 'blur(10px)'
            }} className="rounded-lg">
              {!props.hideCloseButton && (
                <button
                  onClick={() => close(false)}
                  className="bg-neutral-100 absolute top-2 right-2 hover:bg-neutral-200 active:bg-neutral-300 w-12 h-12 rounded inline-flex justify-center items-center"
                  type="button">
                  <FontAwesomeIcon icon={faTimes} size="lg"/>
                </button>
              )}

              <div className="p-5 border-b-2 border-neutral-200">
                <Heading slot="title" className="text-2xl">{props?.title}</Heading>
                {props.header && props.header}
              </div>
              <div
                className="pb-5 modal-container px-5 py-3"
              >
                {props.children}
              </div>
            </div>
          </Dialog>
        </ReactAriaModal>
      </ModalOverlay>
    </>
  );
};

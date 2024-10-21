'use client';

import { Dialog, VisuallyHidden } from "@radix-ui/themes";
import React, { useState } from "react";
import { BraindropData } from "./braindropCard";
import BrainDropEditor from "./braindropEditor";

export default function BrainDropDialog(props: {
  children: React.ReactNode,
  brainDropData: BraindropData,
  isFlipped: boolean,
  onUpdate: () => void
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Root open={isOpen}>
      <div onClick={() => { setIsOpen(true) }}>
        {props.children}
      </div>
      <div onClick={(e) => {
        setIsOpen(false);
      }}>
        <Dialog.Content
          size="3"
          height="600px"
          width="450px"
          aria-describedby="undefined"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <VisuallyHidden>
            <Dialog.Description />
          </VisuallyHidden>
          <VisuallyHidden>
            <Dialog.Title aria-describedby="undefined" >BrainDrop</Dialog.Title>
          </VisuallyHidden>
          <BrainDropEditor data={props.brainDropData} onUpdate={props.onUpdate} />
        </Dialog.Content>
      </div>
    </Dialog.Root>
  );
}
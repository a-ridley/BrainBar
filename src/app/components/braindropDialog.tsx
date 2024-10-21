'use client';

import { Dialog, Flex } from "@radix-ui/themes";
import BraindropFront from "./braindropFront";
import React from "react";
import { BraindropData } from "./braindropCard";
import styles from "./brainDropDialog.module.scss";
import BraindropBack from "./braindropBack";
import BrainDropEditor from "./braindropEditor";

export default function BrainDropDialog(props: {
  children: React.ReactNode,
  brainDropData: BraindropData,
  isFlipped: boolean
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {props.children}
      </Dialog.Trigger>
      <Dialog.Content
        size="3"
        height="600px"
        width="450px"
      >
        {/* <Dialog.Title>BrainDrop</Dialog.Title> */}
        <BrainDropEditor ideaText={props.brainDropData.ideaText} ideaDescription={props.brainDropData.ideaDescription} />
      </Dialog.Content>
    </Dialog.Root>
  );
}
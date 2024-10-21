'use client';
import styles from "./braindropCard.module.scss";
import { Card, IconButton } from "@radix-ui/themes";
import BraindropFront from "./braindropFront";
import BraindropBack from "./braindropBack";
import { useState } from "react";
import { SizeIcon } from "@radix-ui/react-icons";
import BrainDropDialog from "./braindropDialog";

export interface BraindropData {
  id: string
  date: Date
  ideaText: string
  imgUrl: string
  ideaDescription: string
  voiceMemoUrl: string
}

interface BrainDropCardProps {
  data: BraindropData
}

// This is where the edit button belongs because it doesn't matter if youre looking at front or back

export default function BraindropCard(props: BrainDropCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
    console.log(isFlipped);
  }

  return (
    <Card
      size="3"
      className={styles.braindropCard}
      onClick={() => { toggleFlip() }}
    >
      <div onClick={(e) => { e.stopPropagation() }}>
        <BrainDropDialog brainDropData={props.data} isFlipped={isFlipped}>
          <IconButton
            style={{
              position: "absolute",
              top: "0px",
              right: "0px",
              transform: "translateY(10px) translateX(-10px)"
            }}
            variant="ghost"
            color="gray"
          >
            <SizeIcon width="18" height="18" color="black" />
          </IconButton>
        </BrainDropDialog>
      </div>
      {isFlipped ? <BraindropBack ideaDescription={props.data.ideaDescription} /> : <BraindropFront ideaText={props.data.ideaText} />}
    </Card>
  );
}

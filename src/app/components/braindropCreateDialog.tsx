import { Box, Button, Dialog, Flex, IconButton, Inset, Text, TextArea, TextField } from "@radix-ui/themes";
import styles from "./brainDropEditor.module.scss"
import { useEffect, useState } from "react";
import { CardStackPlusIcon } from "@radix-ui/react-icons";

interface BrainDropCreateProps {
  onCreate: () => void
}

const uploadBrainDropText = async (ideaText: string, ideaDescription: string) => {
  const textData = await fetch("/api/braindrop/text", {
    method: "PUT", body: JSON.stringify({
      ideaText,
      ideaDescription
    })
  });
}

export default function BrainDropCreate(props: BrainDropCreateProps) {
  const [ideaText, setIdeaText] = useState("");
  const [ideaDescription, setIdeaDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Root open={isOpen}>
      <IconButton variant="ghost" color="gray" size="4" onClick={() => { setIsOpen(true) }}>
        <CardStackPlusIcon color="black" width="28" height="28" />
      </IconButton>
      <div onClick={() => {
        setIsOpen(false);
      }}>
        <Dialog.Content
          size="3"
          height="600px"
          width="450px"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Idea
              </Text>
              <TextArea
                size="2"
                radius="full"
                placeholder="Enter your rhyme/idea."
                value={ideaText}
                onChange={(e) => {
                  const ideaText = e.target.value;
                  setIdeaText(ideaText);
                }}
              >
              </TextArea>
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Description
              </Text>
              <TextArea
                size="2"
                radius="full"
                placeholder="Description of the idea."
                value={ideaDescription}
                onChange={(e) => {
                  const ideaDescription = e.target.value;
                  setIdeaDescription(ideaDescription);
                }}
              >
              </TextArea>
            </label>
            <Button
              onClick={() => {
                uploadBrainDropText(ideaText, ideaDescription).then(() => {
                  props.onCreate();
                  setIsOpen(false);
                  setIdeaText("");
                  setIdeaDescription("");
                })
              }}
            >
              Create
            </Button>
          </Flex>
        </Dialog.Content>
      </div>
    </Dialog.Root>

  );
}
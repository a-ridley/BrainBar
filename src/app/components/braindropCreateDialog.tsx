import { Box, Button, Dialog, Flex, IconButton, Inset, Text, TextArea, TextField, VisuallyHidden } from "@radix-ui/themes";
import styles from "./brainDropEditor.module.scss"
import { useEffect, useState } from "react";
import { CardStackPlusIcon } from "@radix-ui/react-icons";
import { SingleImageUpload } from "./singleImageUpload";
import { uploadBrainDropImage } from "../services/braindropFetchServices";

interface BrainDropCreateProps {
  onCreate: () => void
}

const uploadBrainDropText = async (ideaText: string, ideaDescription: string) => {
  const textDataResponse = await fetch("/api/braindrop/text", {
    method: "PUT", body: JSON.stringify({
      ideaText,
      ideaDescription
    })
  });

  const textData = await textDataResponse.json();

  return textData;
}

export default function BrainDropCreate(props: BrainDropCreateProps) {
  const [file, setFile] = useState<File | null>(null);
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
          aria-describedby="undefied"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <VisuallyHidden>
            <Dialog.Description />
          </VisuallyHidden>
          <VisuallyHidden>
            <Dialog.Title aria-describedby="undefied" >BrainDrop</Dialog.Title>
          </VisuallyHidden>
          <Flex direction="column" gap="3">
            <SingleImageUpload
              onChange={f => {
                setFile(f);
              }}
            />
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
              onClick={async () => {
                try {
                  // First, upload the text and then use the returned id to upload the image
                  const response = await uploadBrainDropText(ideaText, ideaDescription);
                  const textId = response.id;

                  if (file) {
                    await uploadBrainDropImage(textId, file);
                  }
                  props.onCreate();
                  setIsOpen(false);
                  setIdeaText("");
                  setIdeaDescription("");
                  setFile(null);
                } catch (error) {
                  console.error("Error uploading braindrop:", error);
                }
              }}
            >
              Create
            </Button>
          </Flex>
        </Dialog.Content>
      </div>
    </Dialog.Root >

  );
}
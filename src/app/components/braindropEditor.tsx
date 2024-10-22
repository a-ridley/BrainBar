import { useState } from "react";
import { Box, Flex, IconButton, Inset, Text, TextArea } from "@radix-ui/themes";
import { SingleImageUpload } from "./singleImageUpload";
import { BraindropData } from "./braindropCard";
import styles from "./braindropEditor.module.scss"
import { CheckIcon, Cross2Icon, Pencil1Icon } from "@radix-ui/react-icons";

interface BrainDropEditorProps {
  data: BraindropData
  onUpdate: () => void
}

const uploadBrainDropText = async (textId: string, ideaText: string, ideaDescription: string) => {
  const braindropId = textId.split('/')[1].split('.')[0] // get id from text/{id}.json
  await fetch("/api/braindrop/text", {
    method: "POST", body: JSON.stringify({
      ideaText,
      ideaDescription,
      id: braindropId
    })
  });
}
const uploadBrainDropImage = async (textId: string, file: File) => {
  const braindropId = textId.split('/')[1].split('.')[0] // get id from text/{id}.json
  const formData = new FormData();
  formData.append("id", braindropId);
  formData.append("imageFile", file);

  await fetch("/api/braindrop/image", {
    method: "PUT", body: formData
  });
}

export default function BrainDropEditor(props: BrainDropEditorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [ideaText, setIdeaText] = useState(props.data.ideaText);
  const [ideaDescription, setIdeaDescription] = useState(props.data.ideaDescription);

  return (
    <>
      {isEditing ? (
        <Flex direction="column" gap="3" >
          <SingleImageUpload
            onChange={f => {
              setFile(f);
            }}
          />
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
          <IconButton
            color="red"
            style={{ width: "100%" }}
            onClick={() => {
              setIsEditing(false);
            }}
          >
            <Cross2Icon color="white" />
          </IconButton>
          <IconButton
            color="grass"
            style={{ width: "100%" }}
            onClick={async () => {
              if (file) {
                await uploadBrainDropImage(props.data.id, file);
              }
              await uploadBrainDropText(props.data.id, ideaText, ideaDescription);

              props.onUpdate();
              setIsEditing(false);
            }}
          >
            <CheckIcon />
          </IconButton>
        </Flex>) : (
        <Box>
          <Inset clip="padding-box" side="top" pb="current">
            <img
              src={props.data.imgUrl}
              alt="Bold typography"
              className={styles.img}
            />
          </Inset>

          <Box position="relative">
            <IconButton
              style={{
                position: "absolute",
                top: "0px",
                right: "0px",
                transform: "translateY(-10px)"
              }}
              variant="ghost"
              color="gray"
              onClick={() => { setIsEditing(true) }}
            >
              <Pencil1Icon width="18" height="18" color="black">
              </Pencil1Icon>
            </IconButton>

            <Text as="div" size="2" mt="2" weight="bold">
              Description
            </Text>
            <Text as="p" size="3">
              {props.data.ideaDescription}
            </Text>

            <Text as="div" size="2" mt="3" weight="bold">
              Idea
            </Text>
            <Text as="p" size="3">
              {props.data.ideaText}
            </Text>
          </Box>
        </Box>
      )
      }
    </>

  );
}
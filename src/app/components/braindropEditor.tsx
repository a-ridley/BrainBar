import { useState } from "react";
import { Box, Button, Flex, Inset, Text, TextArea } from "@radix-ui/themes";
import { SingleImageUpload } from "./singleImageUpload";
import { BraindropData } from "./braindropCard";
import styles from "./brainDropEditor.module.scss"

interface BrainDropEditorProps {
  data: BraindropData
  onUpdate: () => void
}

const uploadBrainDropText = async (textId: string, ideaText: string, ideaDescription: string) => {
  const braindropId = textId.split('/')[1].split('.')[0] // get id from text/{id}.json
  const textData = await fetch("/api/braindrop/text", {
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
  const [isEditing, setIsEditing] = useState(true);
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
              if (file) {
                await uploadBrainDropImage(props.data.id, file);
              }
              await uploadBrainDropText(props.data.id, ideaText, ideaDescription);

              props.onUpdate();
            }}
          >Save</Button>
        </Flex>) : (
        <Box>
          <Inset clip="padding-box" side="top" pb="current">
            <img
              src="https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
              alt="Bold typography"
              className={styles.img}
            />
          </Inset>
          <Text as="p" size="3" align={"left"} mt="2">
            {props.data.ideaText}
          </Text>

          <Text as="p" size="3" mt="3">
            {props.data.ideaDescription}
          </Text>
        </Box>
      )
      }
    </>

  );
}
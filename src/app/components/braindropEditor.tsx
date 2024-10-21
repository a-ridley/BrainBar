import { Box, Button, Flex, Inset, Text, TextArea, TextField } from "@radix-ui/themes";
import styles from "./brainDropEditor.module.scss"
import { useEffect, useState } from "react";

interface BrainDropEditorProps {
  ideaText: string,
  ideaDescription: string
}

const uploadBrainDropText = async (ideaText: string, ideaDescription: string) => {
  const textData = await fetch("/api/braindrop/text", {
    method: "PUT", body: JSON.stringify({
      ideaText,
      ideaDescription
    })
  });
}

export default function BrainDropEditor(props: BrainDropEditorProps) {
  const [isEditing, setIsEditing] = useState(true);
  const [ideaText, setIdeaText] = useState(props.ideaText);
  const [ideaDescription, setIdeaDescription] = useState(props.ideaDescription);

  useEffect(() => {

  }, [])

  return (
    <>
      {isEditing ? (
        <Flex direction="column" gap="3" >
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
          <Button onClick={() => {uploadBrainDropText(ideaText, ideaDescription)}}>Save</Button>
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
            {props.ideaText}
          </Text>

          <Text as="p" size="3" mt="3">
            {props.ideaDescription}
          </Text>
        </Box>
      )
      }
    </>

  );
}
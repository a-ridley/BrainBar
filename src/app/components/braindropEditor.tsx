import { useEffect, useState } from "react";
import { Box, Button, Flex, IconButton, Inset, Text, TextArea } from "@radix-ui/themes";
import { SingleImageUpload } from "./singleImageUpload";
import { BraindropData } from "./braindropCard";
import styles from "./brainDropEditor.module.scss"
import { CheckIcon, Cross1Icon, Cross2Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { getImageByKey } from "../services/braindropFetchServices";
import { BrainDropImage } from "../api/lib/s3Service";

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
  const [isEditing, setIsEditing] = useState(false);
  const [ideaText, setIdeaText] = useState(props.data.ideaText);
  const [ideaDescription, setIdeaDescription] = useState(props.data.ideaDescription);

  const [imgDataJson, setImgDataJson] = useState<BrainDropImage | undefined>(undefined);


  useEffect(() => {
    const imageKey = props.data.id.replace("text/", "image/");
    getImageByKey(imageKey).then((data) => {
      setImgDataJson(data)
    })
  }, []);

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
          <IconButton 
            color="red"
            style={{width: "100%"}}
            onClick={() => {
              setIsEditing(false);
            }}
          >
            <Cross2Icon color="white"/>
          </IconButton>
          <IconButton
            color="grass"
            style={{width: "100%"}}
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
          <IconButton
            style={{
              position: "absolute",
              top: "0px",
              right: "0px",
              transform: "translateY(10px) translateX(-10px)"
            }}
            variant="ghost"
            color="gray"
            onClick={() => {setIsEditing(true)}}
          >
            <Pencil1Icon width="18" height="18" color="black">
            </Pencil1Icon>
          </IconButton>
          <Inset clip="padding-box" side="top" pb="current">
            <img
              src={imgDataJson?.url}
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
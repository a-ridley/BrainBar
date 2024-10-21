import { Box, Inset, Text } from "@radix-ui/themes";
import styles from "./braindropBack.module.scss"
import { useEffect, useState } from "react";
import { BrainDropImage } from "../api/lib/s3Service";

interface BraindropBackProps {
  ideaDescription: string
}

const getImage = async () => {
  const imageData = await fetch("/api/braindrop/image");
  const imgDataJson = await imageData.json() as BrainDropImage[];
  return imgDataJson;
}

export default function BraindropBack(props: BraindropBackProps) {
  const [imgDataJson, setImgDataJson] = useState<any[]>([]);

  useEffect(() => {
    getImage().then((data) => {
      setImgDataJson(data)
    })
  }, []);

  console.log({ imgDataJson });
  return (
    <Box>
      <Inset clip="padding-box" side="top" pb="current">
        <img
          src={imgDataJson[0]?.url}
          alt="Bold typography"
          className={styles.img}
        />
      </Inset>
      <Text as="p" size="3" truncate={true}>
        {props.ideaDescription}
      </Text>
    </Box>
  )
}
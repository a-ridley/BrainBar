"use client";

import Header from "./components/header";
import BraindropCard, { BraindropData } from "./components/braindropCard";
import BrainDropGrid from "./components/braindropGrid";
import { BrainDropText } from "./api/lib/s3Service";
import { useCallback, useEffect, useState } from "react";
import BrainDropCreate from "./components/braindropCreateDialog";
import { Box, Flex } from "@radix-ui/themes";
import { getImages } from "./services/braindropFetchServices";

const getTexts = async () => {
  const textData = await fetch("/api/braindrop/text");
  const textDataJson = await textData.json() as BrainDropText[];
  return textDataJson;
}

export default function Home() {
  const [listOfBraindrops, setListOfBraindrops] = useState<BraindropData[]>([]);
  const updateListOfBraindrops = useCallback(() => {
    const getImagesPromise = getImages()
    getTexts().then(async (texts) => {
      const images = await getImagesPromise.catch(() => []); // if image fails, then use an empty array
      setListOfBraindrops(texts.map((braindrop) => {
        return {
          id: braindrop.key,
          date: braindrop.lastModified,
          ideaText: braindrop.ideaText,
          ideaDescription: braindrop.ideaDescription,
          imgUrl: images.find(img => img.key === braindrop.key.replace('text/', 'image/'))?.url ?? ""
        }
      }))
    })
  }, [])

  useEffect(() => {
    updateListOfBraindrops();
  }, [updateListOfBraindrops]);

  return (
    <Box
      px={{
        initial: "10px",
        md: "100px"
      }}
      py={{
        initial: "10px",
        md: "20px"
      }}
    >
      <Header heading={"BrainBar"} description={"A space to store your memorable rap bars."} />
      <Flex justify="end">
        <BrainDropCreate onCreate={() => {
          updateListOfBraindrops();
        }} />
      </Flex>
      <Flex justify="center">
        <BrainDropGrid>
          {
            listOfBraindrops.map(item => {
              return <BraindropCard key={item.id} data={item} onUpdate={() => {
                updateListOfBraindrops();
              }} />
            })
          }
        </BrainDropGrid>
      </Flex>
    </Box>
  );
}

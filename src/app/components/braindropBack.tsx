import { Box, Inset, Text } from "@radix-ui/themes";
import styles from "./braindropBack.module.scss"

interface BraindropBackProps {
  ideaDescription: string,
  textKey: string
  imgUrl: string
}

export default function BraindropBack(props: BraindropBackProps) {
  // console.log({ imgDataJson });
  return (
    <Box>
      <Inset clip="padding-box" side="top" pb="current">
        <img
          src={props.imgUrl}
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
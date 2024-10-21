import { Box, Text } from "@radix-ui/themes";
import styles from "./braindropFront.module.scss";

type Props = {
  ideaText: string
}

export default function BraindropFront({ideaText}: Props) {
  return (
    <Box display={"inline-block"}>
      <Text as="p" size="3" align={"left"} mt="2">
        {ideaText}
      </Text>
    </Box>
  );
}
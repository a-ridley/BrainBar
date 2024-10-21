import * as Separator from "@radix-ui/react-separator";
import styles from "./header.module.scss";
import { Heading, Text } from "@radix-ui/themes";

type Props = {
  heading: string,
  description: string
}

export default function Header({ heading, description }: Props) {

  return (
    <div style={{ width: "100%"}}>
      <Heading size="9">
        {heading}
      </Heading>
      <Text>{description}</Text>
      <Separator.Root className={styles.root}  style={{ margin: "15px 0" }} />
    </div>
  );
}
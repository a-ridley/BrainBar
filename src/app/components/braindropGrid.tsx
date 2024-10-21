import { Grid } from "@radix-ui/themes";

// TODO: In other places I use type ={} stay consistent..
interface GridProps {
  children: React.ReactNode;
}

export default function BrainDropGrid({ children }: GridProps) {
  return (
    <Grid columns="4" gap="5" maxWidth="1080px">
      {children}
    </Grid>
  );
}
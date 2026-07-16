import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

type Props = {
  /**
   * Card title.
   */
  title: string;

  /**
   * Value to display.
   */
  value: string | number;
};

export default function SummaryCard({
  title,
  value,
}: Props) {
  return (
    <Card
      sx={{
        height: "100%",
      }}
    >
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
        >
          {title}
        </Typography>

        <Typography
          variant="h5"
          fontWeight={600}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
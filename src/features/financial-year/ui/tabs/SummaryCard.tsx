import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";

type Props = {
  title: string;
  value: React.ReactNode;
};

export default function SummaryCard({ title, value }: Props) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            {title}
          </Typography>

          <Divider />

          <Typography variant="h6">{value}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

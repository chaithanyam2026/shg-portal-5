import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";

import { PWA_APP_NAME } from "@/lib/pwa/app-metadata";

import LoginForm from "./LoginForm";

type Props = {
  callbackUrl?: string;
};

export default function LoginCard({ callbackUrl }: Props) {
  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 3,
            sm: 4,
          },
        }}
      >
        <Stack spacing={3}>
          <Stack
            spacing={1}
            sx={{
              textAlign: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 700,
              }}
            >
              {PWA_APP_NAME}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Sign in to continue
            </Typography>
          </Stack>

          <Divider />

          <LoginForm callbackUrl={callbackUrl} />
        </Stack>
      </CardContent>
    </Card>
  );
}

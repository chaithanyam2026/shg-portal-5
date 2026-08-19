import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";

import AppLogo from "@/components/layout/AppLogo";
import { PWA_SPLASH_SUBTITLE } from "@/lib/pwa/app-metadata";

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
            spacing={2}
            sx={{
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <AppLogo
              href={undefined}
              height={120}
              priority
              showTitle
              title={PWA_SPLASH_SUBTITLE}
              titleLayout="column"
            />

            {/* <Typography variant="body2" color="text.secondary">
              Sign in to continue
            </Typography> */}
          </Stack>

          <Divider />

          <LoginForm callbackUrl={callbackUrl} />
        </Stack>
      </CardContent>
    </Card>
  );
}

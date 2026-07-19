import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";

import LoginForm from "./LoginForm";

export default function LoginCard() {
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
              SHG Portal
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Sign in to continue
            </Typography>
          </Stack>

          <Divider />

          <LoginForm />
        </Stack>
      </CardContent>
    </Card>
  );
}

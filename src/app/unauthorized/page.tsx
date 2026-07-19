import Link from "next/link";

import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";

export const metadata = {
  title: "Unauthorized",
};

export default function UnauthorizedPage() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          p: {
            xs: 3,
            sm: 5,
          },
          borderRadius: 3,
        }}
      >
        <Stack
          spacing={3}
          sx={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 700,
              }}
              gutterBottom
            >
              Authentication Required
            </Typography>

            <Typography variant="body1" color="text.secondary">
              You must sign in before accessing this page.
            </Typography>
          </Box>

          <Button component={Link} href="/login" variant="contained" size="large" fullWidth>
            Go to Login
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

import Link from "next/link";

import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";

export const metadata = {
  title: "Forbidden",
};

export default function ForbiddenPage() {
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
              gutterBottom
              sx={{
                fontWeight: 700,
              }}
            >
              Access Denied
            </Typography>

            <Typography variant="body1" color="text.secondary">
              You do not have permission to access this page.
            </Typography>
          </Box>

          <Button component={Link} href="/" variant="contained" size="large" fullWidth>
            Go to Dashboard
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

import { Box, Container } from "@mui/material";

import LoginCard from "./LoginCard";

export default function LoginContainer() {
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
      <Box
        sx={{
          width: "100%",
        }}
      >
        <LoginCard />
      </Box>
    </Container>
  );
}

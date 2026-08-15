import { Box, Container } from "@mui/material";

import LoginCard from "./LoginCard";

type Props = {
  callbackUrl?: string;
};

export default function LoginContainer({ callbackUrl }: Props) {
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
        <LoginCard callbackUrl={callbackUrl} />
      </Box>
    </Container>
  );
}

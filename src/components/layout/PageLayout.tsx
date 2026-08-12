import type { ReactNode } from "react";

import { Container, type ContainerProps } from "@mui/material";

type Props = {
  children: ReactNode;

  maxWidth?: ContainerProps["maxWidth"];
};

/**
 * Standard page content wrapper for dashboard pages.
 */
export default function PageLayout({ children, maxWidth = "lg" }: Props) {
  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        width: "100%",
        py: 3,
      }}
    >
      {children}
    </Container>
  );
}

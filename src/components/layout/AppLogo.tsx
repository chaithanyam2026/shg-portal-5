import Image from "next/image";
import Link from "next/link";

import { Box, Stack, Typography } from "@mui/material";

import { APP_LOGO_ALT, APP_LOGO_PATH } from "@/lib/pwa/brand-assets";
import { PWA_APP_NAME } from "@/lib/pwa/app-metadata";

type Props = {
  href?: string;
  height?: number;
  priority?: boolean;
  showTitle?: boolean;
  titleLayout?: "row" | "column";
};

export default function AppLogo({
  href = "/",
  height = 44,
  priority = false,
  showTitle = false,
  titleLayout = "row",
}: Props) {
  const image = (
    <Box
      sx={{
        position: "relative",
        height,
        width: "auto",
        aspectRatio: "1 / 1",
        minWidth: height,
        flexShrink: 0,
      }}
    >
      <Image
        src={APP_LOGO_PATH}
        alt={APP_LOGO_ALT}
        fill
        priority={priority}
        sizes={`${height}px`}
        style={{
          objectFit: "contain",
        }}
      />
    </Box>
  );

  const content = (
    <Stack
      direction={titleLayout === "column" ? "column" : "row"}
      spacing={titleLayout === "column" ? 1 : 1.5}
      sx={{
        alignItems: titleLayout === "column" ? "center" : "center",
        textAlign: titleLayout === "column" ? "center" : "left",
      }}
    >
      {image}

      {showTitle && (
        <Typography
          component="span"
          variant={titleLayout === "column" ? "subtitle2" : "h6"}
          sx={{
            fontWeight: 700,
            color: "text.primary",
            lineHeight: 1.2,
          }}
        >
          {PWA_APP_NAME}
        </Typography>
      )}
    </Stack>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={href}
      aria-label={APP_LOGO_ALT}
      style={{
        display: "inline-flex",
        alignItems: "center",
        textDecoration: "none",
      }}
    >
      {content}
    </Link>
  );
}

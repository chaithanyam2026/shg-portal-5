"use client";

import { useRouter } from "next/navigation";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  Button,
} from "@mui/material";

type Props = {
  fallbackHref?: string;

  label?: string;
};

export default function BackButton({
  fallbackHref = "/",
  label = "Back",
}: Props) {
  const router =
    useRouter();

  function handleClick() {
    if (
      typeof window !==
        "undefined" &&
      window.history.length > 1
    ) {
      router.back();
      return;
    }

    router.push(
      fallbackHref,
    );
  }

  return (
    <Button
      startIcon={
        <ArrowBackIcon />
      }
      variant="text"
      color="inherit"
      onClick={handleClick}
      sx={{
        minWidth: "auto",
        px: 1,
      }}
    >
      {label}
    </Button>
  );
}
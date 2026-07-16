"use client";

import {
  Button,
  Stack,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import { useRouter } from "next/navigation";

type Props = {
  backHref: string;
};

export default function AttendanceRegisterPrintToolbar({
  backHref,
}: Props) {
  const router =
    useRouter();

  function print() {
    window.print();
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="flex-end"
      className="no-print"
      sx={{
        mb: 2,
      }}
    >
      <Button
        startIcon={
          <ArrowBackIcon />
        }
        variant="outlined"
        onClick={() =>
          router.push(
            backHref,
          )
        }
      >
        Back
      </Button>

      <Button
        startIcon={
          <PictureAsPdfIcon />
        }
        variant="outlined"
        onClick={print}
      >
        Download PDF
      </Button>

      <Button
        startIcon={
          <PrintIcon />
        }
        variant="contained"
        onClick={print}
      >
        Print
      </Button>
    </Stack>
  );
}
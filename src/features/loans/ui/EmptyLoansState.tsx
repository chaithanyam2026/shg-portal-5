import Link from "next/link";

import { Alert, Button, Stack } from "@mui/material";

export default function EmptyLoansState() {
  return (
    <Stack
      spacing={3}
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Alert severity="info">No loans have been created yet.</Alert>

      <Button component={Link} href="/loans/new" variant="contained">
        Create Loan
      </Button>
    </Stack>
  );
}

export default function EmptyLoansState() {
  return (
    <Stack
      spacing={3}
      alignItems="center"
    >
      <Alert severity="info">
        No loans have been created yet.
      </Alert>

      <Button
        component={Link}
        href="/loans/new"
        variant="contained"
      >
        Create Loan
      </Button>
    </Stack>
  );
}
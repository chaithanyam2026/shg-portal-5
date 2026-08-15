"use client";

import Link from "next/link";

import { Alert, Button, Card, CardContent, Stack, Typography } from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";

export default function AccountProfileUnavailable() {
  return (
    <Stack spacing={3}>
      <PageHeader title="My Profile" backHref="/" />

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Alert severity="info">
              Your account is not linked to a member profile. Contact an administrator if you need
              to update member details.
            </Alert>

            <Typography color="text.secondary">
              You can still change your login password from the account settings.
            </Typography>

            <Button component={Link} href="/account/change-password" variant="outlined" sx={{ alignSelf: "flex-start" }}>
              Change Password
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

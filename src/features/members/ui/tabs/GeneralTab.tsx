"use client";

import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";

import type { MemberDetails } from "../../types";

import { formatDate } from "@/lib/utils/format";

type Props = {
  member: MemberDetails;
};

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Typography variant="body1">{value || "-"}</Typography>
    </Stack>
  );
}

export default function GeneralTab({ member }: Props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Member Details
        </Typography>

        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <DetailItem label="Member Code" value={member.memberCode} />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <DetailItem label="Name" value={member.name} />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <DetailItem label="Phone" value={member.phone} />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <DetailItem label="Status" value={member.status} />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <DetailItem
              label="Joined Date"
              value={member.joinedDate ? formatDate(member.joinedDate) : "-"}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <DetailItem label="Address" value={member.address} />
          </Grid>

          <Grid
            size={{
              xs: 12,
            }}
          >
            <DetailItem label="Remarks" value={member.remarks} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

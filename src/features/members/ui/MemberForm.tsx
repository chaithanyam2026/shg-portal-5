"use client";

import { useState } from "react";

import Link from "next/link";

import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { CreateMemberInput } from "../validation";
import { toDateInputValue } from "@/lib/utils/date";

type MemberFormValues = {
  memberCode: string;
  name: string;
  phone: string;
  address: string;
  joinDate: string;
  remarks: string;
  username: string;
  password: string;
};

type Props = {
  loading?: boolean;
  onSubmit(values: CreateMemberInput): Promise<void>;
};

const defaultValues: MemberFormValues = {
  memberCode: "",
  name: "",
  phone: "",
  address: "",
  joinDate: toDateInputValue(),
  remarks: "",
  username: "",
  password: "",
};

export default function MemberForm({ loading = false, onSubmit }: Props) {
  const [values, setValues] = useState<MemberFormValues>(defaultValues);

  function update<K extends keyof MemberFormValues>(key: K, value: MemberFormValues[K]) {
    setValues((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      memberCode: values.memberCode.trim(),
      name: values.name.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      joinDate: new Date(values.joinDate),
      remarks: values.remarks.trim(),
      username: values.username.trim(),
      password: values.password,
    });
  }

  return (
    <Card>
      <CardContent>
        <Stack component="form" spacing={3} onSubmit={handleSubmit}>
          <Typography variant="h6">Member Details</Typography>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
          >
            <TextField
              label="Member Code"
              required
              fullWidth
              value={values.memberCode}
              onChange={(event) => update("memberCode", event.target.value.toUpperCase())}
            />

            <TextField
              label="Joined Date"
              type="date"
              required
              fullWidth
              value={values.joinDate}
              onChange={(event) => update("joinDate", event.target.value)}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Stack>

          <TextField
            label="Name"
            required
            fullWidth
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
          />

          <TextField
            label="Phone"
            required
            fullWidth
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
          />

          <TextField
            label="Address"
            fullWidth
            multiline
            minRows={2}
            value={values.address}
            onChange={(event) => update("address", event.target.value)}
          />

          <TextField
            label="Remarks"
            fullWidth
            multiline
            minRows={2}
            value={values.remarks}
            onChange={(event) => update("remarks", event.target.value)}
          />

          <Divider />

          <Typography variant="h6">Login Account</Typography>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
          >
            <TextField
              label="Username"
              required
              fullWidth
              autoComplete="username"
              value={values.username}
              onChange={(event) => update("username", event.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              required
              fullWidth
              autoComplete="new-password"
              value={values.password}
              onChange={(event) => update("password", event.target.value)}
            />
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "flex-end",
            }}
          >
            <Button component={Link} href="/members" variant="outlined" disabled={loading}>
              Cancel
            </Button>

            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Creating..." : "Create Member"}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

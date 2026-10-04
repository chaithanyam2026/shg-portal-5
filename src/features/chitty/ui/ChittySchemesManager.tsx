"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Controller, useForm, type Resolver } from "react-hook-form";

import { formatDate } from "@/lib/utils/format";

import { CHITTY_STATUSES, type ChittyStatus } from "../domain";
import type { ChittySchemeOption } from "../types";
import { CreateChittySchema, type CreateChittyInput } from "../validation";

type Props = {
  initialSchemes: ChittySchemeOption[];
};

export default function ChittySchemesManager({ initialSchemes }: Props) {
  const [schemes, setSchemes] = useState(initialSchemes);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savingId, setSavingId] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateChittyInput>({
    resolver: zodResolver(CreateChittySchema) as unknown as Resolver<CreateChittyInput>,
    defaultValues: {
      name: "",
      code: "",
      startDate: "",
      status: CHITTY_STATUSES.ACTIVE,
    },
  });

  async function onCreate(data: CreateChittyInput) {
    try {
      setError("");
      setSuccess("");

      const response = await fetch("/api/chitty/schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message ?? "Unable to create chitty.");
      }

      setSchemes((current) =>
        [...current, body].sort((left, right) => {
          if (left.status !== right.status) {
            return left.status === "ACTIVE" ? -1 : 1;
          }

          return left.startDate.localeCompare(right.startDate);
        }),
      );
      reset();
      setSuccess("Chitty created.");
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to create chitty.");
    }
  }

  async function updateStatus(scheme: ChittySchemeOption, status: ChittyStatus) {
    try {
      setSavingId(scheme.id);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/chitty/schemes/${scheme.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message ?? "Unable to update chitty.");
      }

      setSchemes((current) =>
        current.map((item) => (item.id === scheme.id ? { ...item, status: body.status } : item)),
      );
      setSuccess("Chitty updated.");
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update chitty.");
    } finally {
      setSavingId("");
    }
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Stack component="form" spacing={2} onSubmit={handleSubmit(onCreate)}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
          )}
        />
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Code"
              error={Boolean(errors.code)}
              helperText={errors.code?.message}
            />
          )}
        />
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              label="Start date"
              slotProps={{ inputLabel: { shrink: true } }}
              error={Boolean(errors.startDate)}
              helperText={errors.startDate?.message}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{ alignSelf: "flex-start" }}
        >
          Create chitty
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schemes.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No chitties yet.
                </TableCell>
              </TableRow>
            )}
            {schemes.map((scheme) => (
              <TableRow key={scheme.id}>
                <TableCell>{scheme.name}</TableCell>
                <TableCell>{scheme.code}</TableCell>
                <TableCell>{formatDate(scheme.startDate)}</TableCell>
                <TableCell>
                  <TextField
                    select
                    size="small"
                    value={scheme.status}
                    disabled={savingId === scheme.id}
                    onChange={(event) => updateStatus(scheme, event.target.value as ChittyStatus)}
                  >
                    <MenuItem value={CHITTY_STATUSES.ACTIVE}>Active</MenuItem>
                    <MenuItem value={CHITTY_STATUSES.CLOSED}>Closed</MenuItem>
                  </TextField>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

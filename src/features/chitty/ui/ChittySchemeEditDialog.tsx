"use client";

import { useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm, type Resolver } from "react-hook-form";

import { CHITTY_STATUSES } from "../domain";
import type { ChittySchemeOption } from "../types";
import { CreateChittySchema, type CreateChittyInput } from "../validation";

import NumberField from "./NumberField";

type Props = {
  scheme: ChittySchemeOption | null;
  onClose: () => void;
  onSaved: (scheme: ChittySchemeOption) => void;
};

export default function ChittySchemeEditDialog({ scheme, onClose, onSaved }: Props) {
  const [error, setError] = useState("");
  const savingRef = useRef(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateChittyInput>({
    resolver: zodResolver(CreateChittySchema) as unknown as Resolver<CreateChittyInput>,
    defaultValues: {
      name: "",
      code: "",
      startDate: "",
      weeklyAmount: 0,
      isAuction: false,
      status: CHITTY_STATUSES.ACTIVE,
    },
    values: scheme
      ? {
          name: scheme.name,
          code: scheme.code,
          startDate: scheme.startDate,
          weeklyAmount: scheme.weeklyAmount,
          isAuction: scheme.isAuction,
          status: scheme.status,
        }
      : undefined,
  });

  async function onSubmit(data: CreateChittyInput) {
    if (!scheme || savingRef.current) {
      return;
    }

    savingRef.current = true;

    try {
      setError("");

      const response = await fetch(`/api/chitty/schemes/${scheme.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message ?? "Unable to update chitty.");
      }

      onSaved(body);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update chitty.");
    } finally {
      savingRef.current = false;
    }
  }

  return (
    <Dialog
      open={Boolean(scheme)}
      onClose={isSubmitting ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Edit chitty</DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          id="edit-chitty-form"
          spacing={2}
          sx={{ pt: 1 }}
          onSubmit={handleSubmit(onSubmit)}
        >
          {error && <Alert severity="error">{error}</Alert>}
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
          <Controller
            name="weeklyAmount"
            control={control}
            render={({ field }) => (
              <NumberField
                label="Weekly amount"
                value={field.value}
                onChange={field.onChange}
                error={Boolean(errors.weeklyAmount)}
                helperText={errors.weeklyAmount?.message}
                slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
              />
            )}
          />
          <Controller
            name="isAuction"
            control={control}
            render={({ field }) => (
              <FormControl>
                <FormLabel>Is auction</FormLabel>
                <RadioGroup
                  row
                  value={field.value ? "yes" : "no"}
                  onChange={(event) => field.onChange(event.target.value === "yes")}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Status"
                error={Boolean(errors.status)}
                helperText={errors.status?.message}
              >
                <MenuItem value={CHITTY_STATUSES.ACTIVE}>Active</MenuItem>
                <MenuItem value={CHITTY_STATUSES.CLOSED}>Closed</MenuItem>
              </TextField>
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" form="edit-chitty-form" variant="contained" disabled={isSubmitting}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

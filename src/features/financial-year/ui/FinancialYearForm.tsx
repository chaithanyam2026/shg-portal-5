"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { CreateFinancialYearInput, CreateFinancialYearSchema } from "../validation";

export default function FinancialYearForm() {
  const router = useRouter();

  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFinancialYearInput>({
    resolver: zodResolver(CreateFinancialYearSchema),
    defaultValues: {
      name: "",
      startDate: undefined,
      endDate: undefined,
      remarks: "",
    },
  });

  async function onSubmit(data: CreateFinancialYearInput) {
    try {
      setServerError("");
      setIsSubmitting(true);

      const response = await fetch("/api/financial-years", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Failed to create financial year.");
      }

      router.push(`/financial-years/${result._id}`);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("Unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        {serverError && <Alert severity="error">{serverError}</Alert>}

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Financial Year Name"
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />

        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              required
              value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
              onChange={(event) => field.onChange(event.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
            />
          )}
        />

        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <TextField
              label="End Date"
              type="date"
              fullWidth
              required
              value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
              onChange={(event) => field.onChange(event.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.endDate}
              helperText={errors.endDate?.message}
            />
          )}
        />

        <Controller
          name="remarks"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Remarks"
              fullWidth
              multiline
              minRows={4}
              error={!!errors.remarks}
              helperText={errors.remarks?.message}
            />
          )}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            {isSubmitting ? "Creating..." : "Create Financial Year"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

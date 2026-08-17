"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm, type Resolver } from "react-hook-form";

import {
  UpdateFinancialYearInput,
  UpdateFinancialYearFormInput,
  UpdateFinancialYearSchema,
} from "../../validation";

import { toDateInputValue } from "@/lib/utils/date";
import type { FinancialYearDetails } from "../../types";

type Props = {
  financialYear: FinancialYearDetails;
  canEdit?: boolean;
};

export default function GeneralForm({
  financialYear,
  canEdit = true,
}: Props) {
  const router = useRouter();

  const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
  } = useForm<
    UpdateFinancialYearFormInput,
    unknown,
    UpdateFinancialYearInput
  >({
    resolver: zodResolver(UpdateFinancialYearSchema) as unknown as Resolver<
      UpdateFinancialYearFormInput,
      unknown,
      UpdateFinancialYearInput
    >,

    defaultValues: {
      name: financialYear.name,

      startDate: toDateInputValue(financialYear.startDate),

      endDate: toDateInputValue(financialYear.endDate),

      remarks: financialYear.remarks,
    },
  });

  async function onSubmit(
    data: UpdateFinancialYearInput,
  ) {
    setError("");

    const response = await fetch(
      `/api/financial-years/${financialYear._id}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(data),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      setError(
        result.message ??
        "Unable to update financial year.",
      );

      return;
    }

    router.refresh();
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack spacing={3}>
            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  disabled={!canEdit}
                  error={!!errors.name}
                  helperText={
                    errors.name?.message
                  }
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
                  disabled={!canEdit}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value,
                    )
                  }
                  error={
                    !!errors.startDate
                  }
                  helperText={
                    errors.startDate
                      ?.message
                  }
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
                  disabled={!canEdit}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value,
                    )
                  }
                  error={!!errors.endDate}
                  helperText={
                    errors.endDate
                      ?.message
                  }
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
                  multiline
                  minRows={4}
                  fullWidth
                  disabled={!canEdit}
                  error={
                    !!errors.remarks
                  }
                  helperText={
                    errors.remarks
                      ?.message
                  }
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={
                !canEdit ||
                !isDirty ||
                isSubmitting
              }
              startIcon={
                isSubmitting ? (
                  <CircularProgress
                    size={18}
                    color="inherit"
                  />
                ) : undefined
              }
            >
              Save Changes
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}

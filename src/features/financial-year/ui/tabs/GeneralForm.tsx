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
import { Controller, useForm } from "react-hook-form";

import {
  UpdateFinancialYearFormInput,
  UpdateFinancialYearSchema,
} from "../../validation";

import type { FinancialYearDetails } from "../../types";

type Props = {
  financialYear: FinancialYearDetails;
};

export default function GeneralForm({
  financialYear,
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
  } = useForm<UpdateFinancialYearFormInput>({
    resolver: zodResolver(UpdateFinancialYearSchema),

    defaultValues: {
      name: financialYear.name,

      startDate: financialYear.startDate,

      endDate: financialYear.endDate,

      remarks: financialYear.remarks,
    },
  });

  async function onSubmit(
    values: UpdateFinancialYearFormInput,
  ) {
    setError("");

    const data =
      UpdateFinancialYearSchema.parse(values);

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
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={
                    field.value
                      ? new Date(field.value)
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
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
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={
                    field.value
                      ? new Date(field.value)
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
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
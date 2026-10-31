"use client";

import { useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
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

import ChittySchemeEditDialog from "./ChittySchemeEditDialog";
import NumberField from "./NumberField";

type Props = {
  initialSchemes: ChittySchemeOption[];
};

type SchemePatch = {
  status?: ChittyStatus;
  weeklyAmount?: number;
  isAuction?: boolean;
};

function WeeklyAmountCell({
  amount,
  disabled,
  onCommit,
}: {
  amount: number;
  disabled: boolean;
  onCommit: (amount: number) => Promise<boolean>;
}) {
  const [value, setValue] = useState(amount);
  const valueRef = useRef(amount);

  return (
    <NumberField
      size="small"
      value={value}
      disabled={disabled}
      onChange={(next) => {
        valueRef.current = next;
        setValue(next);
      }}
      onBlur={() => {
        void onCommit(valueRef.current).then((saved) => {
          if (!saved) {
            valueRef.current = amount;
            setValue(amount);
          }
        });
      }}
      slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
      sx={{ minWidth: 120 }}
    />
  );
}

function sortSchemes(schemes: ChittySchemeOption[]) {
  return [...schemes].sort((left, right) => {
    if (left.status !== right.status) {
      return left.status === "ACTIVE" ? -1 : 1;
    }

    return left.startDate.localeCompare(right.startDate);
  });
}

export default function ChittySchemesManager({ initialSchemes }: Props) {
  const [schemes, setSchemes] = useState(initialSchemes);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savingId, setSavingId] = useState("");
  const [editing, setEditing] = useState<ChittySchemeOption | null>(null);

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
      weeklyAmount: 0,
      isAuction: false,
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

      setSchemes((current) => sortSchemes([...current, body]));
      reset();
      setSuccess("Chitty created.");
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to create chitty.");
    }
  }

  async function updateScheme(scheme: ChittySchemeOption, patch: SchemePatch): Promise<boolean> {
    try {
      setSavingId(scheme.id);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/chitty/schemes/${scheme.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message ?? "Unable to update chitty.");
      }

      setSchemes((current) => current.map((item) => (item.id === scheme.id ? body : item)));
      setSuccess("Chitty updated.");
      return true;
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update chitty.");
      return false;
    } finally {
      setSavingId("");
    }
  }

  async function commitWeeklyAmount(scheme: ChittySchemeOption, weeklyAmount: number) {
    const amount = Math.round(weeklyAmount * 100) / 100;

    if (amount === scheme.weeklyAmount) {
      return true;
    }

    if (amount <= 0) {
      setError("Weekly amount is required.");
      setSuccess("");
      return false;
    }

    return updateScheme(scheme, { weeklyAmount: amount });
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
              <TableCell>Weekly amount</TableCell>
              <TableCell>Is auction</TableCell>
              <TableCell>Status</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {schemes.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
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
                  <WeeklyAmountCell
                    key={`${scheme.id}-${scheme.weeklyAmount}`}
                    amount={scheme.weeklyAmount}
                    disabled={savingId === scheme.id}
                    onCommit={(weeklyAmount) => commitWeeklyAmount(scheme, weeklyAmount)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    select
                    size="small"
                    value={scheme.isAuction ? "yes" : "no"}
                    disabled={savingId === scheme.id}
                    onChange={(event) =>
                      void updateScheme(scheme, { isAuction: event.target.value === "yes" })
                    }
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    select
                    size="small"
                    value={scheme.status}
                    disabled={savingId === scheme.id}
                    onChange={(event) =>
                      void updateScheme(scheme, { status: event.target.value as ChittyStatus })
                    }
                  >
                    <MenuItem value={CHITTY_STATUSES.ACTIVE}>Active</MenuItem>
                    <MenuItem value={CHITTY_STATUSES.CLOSED}>Closed</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    disabled={savingId === scheme.id}
                    onClick={() => setEditing(scheme)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ChittySchemeEditDialog
        scheme={editing}
        onClose={() => setEditing(null)}
        onSaved={(scheme) => {
          setSchemes((current) =>
            sortSchemes(current.map((item) => (item.id === scheme.id ? scheme : item))),
          );
          setEditing(null);
          setError("");
          setSuccess("Chitty updated.");
        }}
      />
    </Stack>
  );
}

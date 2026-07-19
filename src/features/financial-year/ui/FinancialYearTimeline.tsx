"use client";

import { Stack, Step, StepLabel, Stepper } from "@mui/material";

import type { FinancialYearStatus } from "@/models/FinancialYear";

const STEPS = ["DRAFT", "IN_PROGRESS", "VALIDATED", "APPROVED", "CLOSED"] as const;

type Props = {
  status: FinancialYearStatus;
};

export default function FinancialYearTimeline({ status }: Props) {
  const activeStep = STEPS.indexOf(status);

  return (
    <Stack>
      <Stepper activeStep={activeStep} alternativeLabel>
        {STEPS.map((step) => (
          <Step key={step}>
            <StepLabel>{step.replace("_", " ")}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}

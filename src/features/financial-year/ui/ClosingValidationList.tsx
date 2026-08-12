"use client";

import {
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
// import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";

import type { ClosingValidation } from "../domain";

type Props = {
  validation: ClosingValidation;
};

export default function ClosingValidationList({ validation }: Props) {
  const successCount = validation.items.filter((item) => item.valid).length;

  const failedCount = validation.items.length - successCount;

  return (
    <Stack spacing={2}>
      <Alert severity={validation.valid ? "success" : "error"}>
        <AlertTitle>{validation.valid ? "Validation Successful" : "Validation Failed"}</AlertTitle>

        {validation.valid
          ? "All validation checks passed. The financial year can be closed."
          : `${failedCount} validation check(s) failed. Resolve the issues below before closing the financial year.`}
      </Alert>

      <Paper variant="outlined">
        <List disablePadding>
          {validation.items.map((item, index) => (
            <ListItem
              key={item.code}
              divider={index < validation.items.length - 1}
              alignItems="flex-start"
            >
              <ListItemIcon>
                {item.valid ? (
                  <CheckCircleOutlinedIcon color="success" />
                ) : (
                  <ErrorOutlinedIcon color="error" />
                )}
              </ListItemIcon>

              <ListItemText
                primary={<Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>}
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {item.message}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Typography variant="caption" color="text.secondary">
        Passed: {successCount} / {validation.items.length}
        {" • "}
        Failed: {failedCount}
      </Typography>
    </Stack>
  );
}

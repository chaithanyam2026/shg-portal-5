// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Stack,
  Typography,
} from "@mui/material";

type Props = {
  label: string;
  valid: boolean;
  message?: string;
};

export default function ValidationItem({
  label,
  valid,
  message,
}: Props) {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="flex-start"
    >
      {valid ? (
        <CheckCircleIcon
          color="success"
          fontSize="small"
          sx={{ mt: 0.25 }}
        />
      ) : (
        <CancelIcon
          color="error"
          fontSize="small"
          sx={{ mt: 0.25 }}
        />
      )}

      <Stack spacing={0.5}>
        <Typography variant="body2">
          {label}
        </Typography>

        {message && (
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {message}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}
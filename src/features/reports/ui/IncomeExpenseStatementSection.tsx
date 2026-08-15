"use client";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";

import type { IncomeExpenseStatementSection as StatementSection } from "../domain/income-expense-statement";

type Props = {
  title: string;
  section: StatementSection;
  emptyMessage: string;
};

export function IncomeExpenseStatementSection({ title, section, emptyMessage }: Props) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="h6">{title}</Typography>

            <Typography sx={{ fontWeight: 700 }}>{formatCurrency(section.total)}</Typography>
          </Stack>

          {section.items.length === 0 ? (
            <Typography color="text.secondary">{emptyMessage}</Typography>
          ) : (
            <Stack spacing={1}>
              {section.items.map((item) => (
                <Accordion
                  key={item.key}
                  disableGutters
                  elevation={0}
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    "&:before": {
                      display: "none",
                    },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack
                      direction="row"
                      sx={{
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        pr: 1,
                      }}
                    >
                      <Typography sx={{ fontWeight: 600 }}>{item.label}</Typography>

                      <Typography sx={{ fontWeight: 600 }}>{formatCurrency(item.amount)}</Typography>
                    </Stack>
                  </AccordionSummary>

                  <AccordionDetails sx={{ pt: 0 }}>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Amount</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {item.details.map((detail, index) => (
                            <TableRow key={`${item.key}-${index}`}>
                              <TableCell sx={{ whiteSpace: "nowrap" }}>
                                {formatDate(detail.date)}
                              </TableCell>

                              <TableCell>{detail.description}</TableCell>

                              <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                                {formatCurrency(detail.amount)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

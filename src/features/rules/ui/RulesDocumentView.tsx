import { Chip, Paper, Stack, Typography } from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";
import { formatDate } from "@/lib/utils/date";
import { formatDateTime } from "@/lib/utils/format";

import type { ClubRulesDocument, RuleStatus } from "../domain";

type Props = {
  rules: ClubRulesDocument;
};

function statusLabel(status: RuleStatus): string {
  return status === "APPROVED" ? "Approved" : "Draft";
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25} sx={{ minWidth: 160 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}

export default function RulesDocumentView({ rules }: Props) {
  return (
    <Stack spacing={3}>
      <PageHeader title={rules.title} subtitle={rules.description} showBack={false} />

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
            <Chip
              size="small"
              label={statusLabel(rules.status)}
              color={rules.status === "APPROVED" ? "success" : "default"}
            />
            <Typography variant="body2" color="text.secondary">
              Version {rules.version}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={3} useFlexGap sx={{ flexWrap: "wrap" }}>
            <MetaItem label="Effective from" value={formatDate(rules.effectiveFrom)} />
            <MetaItem
              label="Effective until"
              value={rules.effectiveUntil ? formatDate(rules.effectiveUntil) : "—"}
            />
            <MetaItem label="Created by" value={rules.createdBy} />
            <MetaItem label="Created at" value={formatDateTime(rules.createdAt)} />
            <MetaItem label="Approved by" value={rules.approvedBy ?? "—"} />
            <MetaItem label="Approved at" value={formatDateTime(rules.approvedAt)} />
            <MetaItem label="Updated by" value={rules.updatedBy} />
            <MetaItem label="Updated at" value={formatDateTime(rules.updatedAt)} />
          </Stack>
        </Stack>
      </Paper>

      {rules.sections.map((section) => (
        <Paper key={section.id} variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" component="h2" sx={{ mb: 1.5 }}>
            {section.title}
          </Typography>

          <Stack component="ol" spacing={1.5} sx={{ m: 0, pl: 2.5 }}>
            {section.rules.map((rule) => (
              <Typography key={rule.id} component="li" variant="body2">
                {rule.text}
              </Typography>
            ))}
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

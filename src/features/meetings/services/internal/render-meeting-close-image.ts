import sharp from "sharp";

import { formatCurrency } from "@/lib/utils/currency";

import {
  WHATSAPP_TEMPLATE,
  type MeetingCloseMemberLine,
  type MeetingCloseMessageContent,
} from "../../domain/whatsapp-template";

const PAD = 32;
const ROW_HEIGHT = 46;
const HEADER_HEIGHT = 62;
const FONT = "Helvetica, Arial, sans-serif";

type Column = {
  header: string[];
  width: number;
  align: "start" | "end";
};

export type MeetingCloseImageInput = {
  memberName: string;
  memberIndex: number;
  meetingDate: string;
  closingTime: string;
  content: MeetingCloseMessageContent;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function clip(value: string, max: number): string {
  const trimmed = value.trim();

  if (trimmed.length <= max) {
    return trimmed;
  }

  return `${trimmed.slice(0, max - 1)}…`;
}

function headerLines(label: string): string[] {
  if (label.length <= 16) {
    return [label];
  }

  const splitAt = label.lastIndexOf(" ");

  if (splitAt <= 0) {
    return [label];
  }

  return [label.slice(0, splitAt), label.slice(splitAt + 1)];
}

function columns(): Column[] {
  const labels = WHATSAPP_TEMPLATE.labels;

  return [
    { header: ["Member"], width: 250, align: "start" },
    { header: headerLines(labels.attendance), width: 140, align: "start" },
    { header: headerLines(labels.contributionPaid), width: 180, align: "end" },
    { header: headerLines(labels.loanRepayment), width: 170, align: "end" },
    { header: headerLines(labels.absentFinePaid), width: 160, align: "end" },
    { header: headerLines(labels.pendingContribution), width: 180, align: "end" },
    { header: headerLines(labels.pendingAbsentFine), width: 170, align: "end" },
  ];
}

function memberCells(member: MeetingCloseMemberLine): string[] {
  return [
    clip(member.name, 22),
    member.attendanceLabel,
    formatCurrency(member.contributionPaid),
    formatCurrency(member.loanRepayment),
    formatCurrency(member.absentFinePaid),
    formatCurrency(member.pendingContribution),
    formatCurrency(member.pendingAbsentFine),
  ];
}

function sumMembers(
  members: MeetingCloseMemberLine[],
  key: keyof Pick<
    MeetingCloseMemberLine,
    | "contributionPaid"
    | "loanRepayment"
    | "absentFinePaid"
    | "pendingContribution"
    | "pendingAbsentFine"
  >,
): number {
  return members.reduce((total, member) => total + member[key], 0);
}

function totalCells(content: MeetingCloseMessageContent): string[] {
  const members = content.members;

  return [
    WHATSAPP_TEMPLATE.labels.total,
    "",
    formatCurrency(sumMembers(members, "contributionPaid")),
    formatCurrency(sumMembers(members, "loanRepayment")),
    formatCurrency(sumMembers(members, "absentFinePaid")),
    formatCurrency(sumMembers(members, "pendingContribution")),
    formatCurrency(sumMembers(members, "pendingAbsentFine")),
  ];
}

function amountSummary(lines: MeetingCloseMessageContent["incomes"]): {
  total: number;
  details: string | null;
} {
  const total = lines.reduce((sum, line) => sum + line.amount, 0);
  const details =
    lines.length === 0
      ? null
      : lines.map((line) => `${line.categoryLabel} ${formatCurrency(line.amount)}`).join(", ");

  return { total, details };
}

function footerLines(content: MeetingCloseMessageContent): string[] {
  const labels = WHATSAPP_TEMPLATE.labels;
  const income = amountSummary(content.incomes);
  const expense = amountSummary(content.expenses);
  const lines = [
    `${labels.totalIncome}: ${formatCurrency(income.total)}`,
    `${labels.totalExpense}: ${formatCurrency(expense.total)}`,
  ];

  if (income.details) {
    lines.push(`${labels.income}: ${income.details}`);
  }

  if (expense.details) {
    lines.push(`${labels.expense}: ${expense.details}`);
  }

  lines.push(`${labels.cashInHand}: ${formatCurrency(content.cashInHand)}`);
  lines.push(`${labels.bankBalance}: ${formatCurrency(content.bankBalance)}`);

  return lines;
}

function text(options: {
  x: number;
  y: number;
  value: string;
  size: number;
  fill: string;
  weight?: number;
  anchor?: "start" | "end" | "middle";
}): string {
  return `<text x="${options.x}" y="${options.y}" font-family="${FONT}" font-size="${options.size}" font-weight="${options.weight ?? 400}" fill="${options.fill}" text-anchor="${options.anchor ?? "start"}">${escapeXml(options.value)}</text>`;
}

function buildSvg(input: MeetingCloseImageInput): string {
  const tableColumns = columns();
  const tableWidth = tableColumns.reduce((sum, column) => sum + column.width, 0);
  const width = tableWidth + PAD * 2;
  const lines = footerLines(input.content);
  const titleHeight = 108;
  const footerHeight = 28 + lines.length * 30;
  const memberRowsHeight = (input.content.members.length + 1) * ROW_HEIGHT;
  const height = PAD + titleHeight + HEADER_HEIGHT + memberRowsHeight + footerHeight + PAD;
  const tableTop = PAD + titleHeight;

  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect width="${width}" height="${height}" fill="#f4f7f5"/>`,
    `<rect x="16" y="16" width="${width - 32}" height="${height - 32}" rx="16" fill="#ffffff"/>`,
    text({
      x: PAD,
      y: PAD + 36,
      value: `Hi ${clip(input.memberName, 40)},`,
      size: 30,
      fill: "#14532d",
      weight: 700,
    }),
    text({
      x: PAD,
      y: PAD + 68,
      value: `Meeting date: ${input.meetingDate}`,
      size: 18,
      fill: "#3f4a42",
    }),
    text({
      x: PAD,
      y: PAD + 94,
      value: `Closing time: ${input.closingTime}`,
      size: 18,
      fill: "#3f4a42",
    }),
  ];

  let cursor = PAD;

  parts.push(
    `<rect x="${PAD}" y="${tableTop}" width="${tableWidth}" height="${HEADER_HEIGHT}" fill="#14532d"/>`,
  );

  for (const column of tableColumns) {
    const anchor = column.align === "end" ? "end" : "start";
    const x = column.align === "end" ? cursor + column.width - 14 : cursor + 14;
    const linesY = column.header.length === 1 ? tableTop + HEADER_HEIGHT / 2 + 6 : tableTop + 26;

    column.header.forEach((line, index) => {
      parts.push(
        text({
          x,
          y: linesY + index * 20,
          value: line,
          size: 15,
          fill: "#ffffff",
          weight: 700,
          anchor,
        }),
      );
    });

    cursor += column.width;
  }

  input.content.members.forEach((member, index) => {
    const rowTop = tableTop + HEADER_HEIGHT + index * ROW_HEIGHT;
    const highlighted = index === input.memberIndex;
    const fill = highlighted ? "#dcfce7" : index % 2 === 0 ? "#ffffff" : "#f3f6f4";

    parts.push(
      `<rect x="${PAD}" y="${rowTop}" width="${tableWidth}" height="${ROW_HEIGHT}" fill="${fill}"/>`,
    );
    parts.push(
      `<line x1="${PAD}" y1="${rowTop + ROW_HEIGHT}" x2="${PAD + tableWidth}" y2="${rowTop + ROW_HEIGHT}" stroke="#e5ebe7"/>`,
    );

    let cellX = PAD;
    const cells = memberCells(member);

    cells.forEach((value, cellIndex) => {
      const column = tableColumns[cellIndex];
      const anchor = column.align === "end" ? "end" : "start";
      const x = column.align === "end" ? cellX + column.width - 14 : cellX + 14;

      parts.push(
        text({
          x,
          y: rowTop + ROW_HEIGHT / 2 + 6,
          value,
          size: 16,
          fill: "#1f2933",
          weight: highlighted && cellIndex === 0 ? 700 : 400,
          anchor,
        }),
      );

      cellX += column.width;
    });
  });

  const totalTop = tableTop + HEADER_HEIGHT + input.content.members.length * ROW_HEIGHT;
  parts.push(
    `<rect x="${PAD}" y="${totalTop}" width="${tableWidth}" height="${ROW_HEIGHT}" fill="#e7f0ea"/>`,
  );

  let totalX = PAD;
  totalCells(input.content).forEach((value, cellIndex) => {
    const column = tableColumns[cellIndex];
    const anchor = column.align === "end" ? "end" : "start";
    const x = column.align === "end" ? totalX + column.width - 14 : totalX + 14;

    if (value) {
      parts.push(
        text({
          x,
          y: totalTop + ROW_HEIGHT / 2 + 6,
          value,
          size: 16,
          fill: "#14532d",
          weight: 700,
          anchor,
        }),
      );
    }

    totalX += column.width;
  });

  lines.forEach((line, index) => {
    parts.push(
      text({
        x: PAD,
        y: totalTop + ROW_HEIGHT + 36 + index * 30,
        value: line,
        size: 18,
        fill: "#1f2933",
        weight: 700,
      }),
    );
  });

  parts.push("</svg>");

  return parts.join("");
}

export async function renderMeetingCloseImage(input: MeetingCloseImageInput): Promise<Buffer> {
  return sharp(Buffer.from(buildSvg(input)))
    .png()
    .toBuffer();
}

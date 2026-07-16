"use client";

import Link from "next/link";

import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";

type Props = {
  title: string;

  description: string;

  href: string;
};

export default function ReportCard({
  title,
  description,
  href,
}: Props) {
  return (
    <Card>
      <CardActionArea
        component={Link}
        href={href}
      >
        <CardContent>
          <Typography
            variant="h6"
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
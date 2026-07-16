import Link from "next/link";

import {
    Alert,
    Box,
    Button,
    Container,
    Stack,
    Typography,
} from "@mui/material";

import {
    listFinancialYears,
} from "@/features/financial-year/services";
import connectMongo from "@/lib/db/mongodb";

import FinancialYearList from "@/features/financial-year/ui/FinancialYearList";
import PageHeader from "@/components/layout/PageHeader";

export const dynamic = "force-dynamic";

export default async function FinancialYearsPage() {
    try {
        await connectMongo();

        const financialYears = await listFinancialYears();

        return (
            <Container
                maxWidth="md"
                sx={{
                    py: 2,
                }}
            >
                <Stack spacing={3}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                    >
                        <Box>
                            <PageHeader
                                title="Financial Years"
                                showBack={false}
                            />

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Manage financial years for your SHG.
                            </Typography>
                        </Box>

                        <Link
                            href="/financial-years/new"
                            style={{ textDecoration: "none" }}
                        >
                            <Button
                                variant="contained"
                            >
                                New
                            </Button>
                        </Link>
                    </Stack>

                    <FinancialYearList
                        financialYears={financialYears}
                    />
                </Stack>
            </Container>
        );
    } catch (error) {
        console.error(error);

        return (
            <Container
                maxWidth="md"
                sx={{
                    py: 2,
                }}
            >
                <Alert severity="error">
                    Failed to load financial years.
                </Alert>
            </Container>
        );
    }
}
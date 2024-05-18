"use client";

import { fetchCompanyInfo } from "@/app/actions";
import DiscoveryFramework from "@/components/DiscoveryFramework/DiscoveryFramework";
import { Autocomplete, Backdrop, Box, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState, useTransition } from "react";

export default function DiscoveryFrameworkCompany({ companies }: { companies: any[] }) {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (companyId) {
      startTransition(async () => {
        const comapnyInfo: any = await fetchCompanyInfo(companyId);
        const { logo, primaryColor, secondaryColor, modules } = comapnyInfo;
        const companyDiscoveryFramework = modules.filter((module: any) => module.title === "Discovery Framework")[0];

        if (!companyDiscoveryFramework.data.answers) {
          companyDiscoveryFramework.data.answers = [
            ["", "", "", ""],
            ["", "", "", ""],
          ];
        }

        if (!companyDiscoveryFramework.data.default) {
          companyDiscoveryFramework.data.default = {
            title: {
              text: "",
              size: 16,
            },
            subtitle: {
              text: "",
              size: 16,
            },
            content: {
              left: {
                thoughts: ["", ""],
                feelings: ["", ""],
                actions: ["", ""],
                results: ["", ""],
              },
              right: {
                thoughts: ["", ""],
                feelings: ["", ""],
                actions: ["", ""],
                results: ["", ""],
              },
            },
          };
        }

        setData({
          logo,
          primaryColor,
          secondaryColor,
          answers: companyDiscoveryFramework.data.answers,
          company: companyDiscoveryFramework.data.default,
          companyId,
        });
      });
    } else {
      setData(null);
    }
  }, [companyId]);

  return (
    <Box width="1024px">
      <Autocomplete
        options={companies.map((company) => company.name)}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option}>
              {option}
            </li>
          );
        }}
        renderInput={(params) => <TextField {...params} label="Select Company" />}
        onChange={(event: any, newValue: string | null) => {
          const selectedCompany = companies.find((company) => company.name === newValue);
          const selectedCompanyId = selectedCompany ? selectedCompany.id : null;
          setCompanyId(selectedCompanyId);
        }}
        sx={{ mb: 2 }}
      />

      {data && !isPending && <DiscoveryFramework data={data} editMode={true} superAdmin={true} />}

      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isPending}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

import { Box, Container, Paper, TextField } from "@mui/material";
import StoreTable from "../components/table";
import { useEffect, useState } from "preact/hooks";
import type { Store } from "../types/stores";

export default function SetRetail() {
  const [rows, setRows] = useState<Store[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/data/store.json")
      .then((res) => res.json())
      .then((data) => setRows(data))
      .catch(console.error);
  }, []);

  const filteredRows = rows.filter((row) => {
    const query = search
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return (
      row.store_name.toLowerCase().normalize("NFD").includes(query) ||
      row.address.toLowerCase().normalize("NFD").includes(query) ||
      row.store_code.toString().includes(query) ||
      row.workstation_ip.toString().includes(query) ||
      row.utm_ip.toString().includes(query) ||
      row.company.toLowerCase().normalize("NFD").includes(query) 
    );
  });

  return (
    <Container
      sx={{
        margin: "0 auto",
        p: 5,
        height: "100vh",
        maxWidth: "1280px",
      }}
    >
      <Box
        component={Paper}
        sx={{
          mb: 3,
          p: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <TextField
          label="Поиск магазина (rsa id, ip, адрес)"
          variant="filled"
          size="medium"
          fullWidth
          value={search}
          autoFocus
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <StoreTable rows={filteredRows} />
      </Box>
    </Container>
  );
}

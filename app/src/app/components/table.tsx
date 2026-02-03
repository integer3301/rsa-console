import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useMemo, useState } from "preact/hooks";
import type { Store } from "../types/stores";

type StoreTableProps = {
  rows: Store[];
};

const getLinks = (row: Store) => ({
  st: `http://${row.workstation_ip}:8090`,
  scm: `http://manager:password@${row.workstation_ip}:8092`,
  utm: `http://${row.utm_ip}/app`,
});

export default function StoreTable({ rows }: StoreTableProps) {
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [activeProtocol, setActiveProtocol] = useState<"MRC" | "RDP" | null>(
    null
  );

  const displayedRows = useMemo(() => {
    if (!selectedStore) return rows;
    return rows.filter((r) => r.store_code === selectedStore);
  }, [rows, selectedStore]);

  const toggleStore = (storeCode: number) => {
    setSelectedStore((prev) => (prev === storeCode ? null : storeCode));
  };

  const handleClick = (row: Store) => {
    if (activeProtocol === "MRC") {
      window.location.href = `dw://${row.workstation_ip}`;
    } else if (activeProtocol === "RDP") {
      window.location.href = `rdp://${row.workstation_ip}`;
    } else {
      toggleStore(row.store_code);
    }
  };

  const handleProtocolChange = (protocol: "MRC" | "RDP") => {
    setActiveProtocol((prev) => (prev === protocol ? null : protocol));
  };

  return (
    <>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <p>Магазины: {displayedRows.length}</p>

        <FormControlLabel
          control={
            <Checkbox
              checked={activeProtocol === "MRC"}
              onChange={() => handleProtocolChange("MRC")}
            />
          }
          label="MRC"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={activeProtocol === "RDP"}
              onChange={() => handleProtocolChange("RDP")}
            />
          }
          label="RDP"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {["N", "РСА", "Адрес", "SETRETAIL", "SET MANAGER", "UTM"].map(
                (title) => (
                  <TableCell key={title} sx={{ fontWeight: 600 }}>
                    {title}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {displayedRows.map((row, index) => {
              const links = getLinks(row);

              return (
                <TableRow key={row.store_code}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.store_name}</TableCell>

                  <TableCell>
                    <Link
                      component="button"
                      onClick={() => handleClick(row)}
                      sx={{ cursor: "pointer" }}
                    >
                      {row.store_name} — {row.address}
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Link href={links.st} target="_blank" underline="hover">
                      {row.workstation_ip}:8090
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Link href={links.scm} target="_blank" underline="hover">
                      {row.workstation_ip}:8092
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Link href={links.utm} target="_blank" underline="hover">
                      {row.utm_ip}
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedStore  && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => setSelectedStore(null)}
          >
            назад
          </Button>
        </Box>
      )}
    </>
  );
}

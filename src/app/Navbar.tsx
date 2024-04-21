import * as React from "react";
import NextLink from "next/link";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Link,
} from "@mui/material/";

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Link
            component={NextLink}
            href="/"
            underline="none"
            color="background.default"
          >
            sustainascan
          </Link>
          <IconButton
            aria-label="scan"
            component={NextLink}
            href="/scanner"
            style={{ right: 0 }}
          >
            <QrCodeScannerRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

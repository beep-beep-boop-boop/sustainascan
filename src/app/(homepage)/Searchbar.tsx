"use client";

import { ChangeEventHandler } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface Props {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export default function Searchbar({ value, onChange }: Props) {
  return (
    <div>
      <TextField
        fullWidth
        hiddenLabel
        id="filled-hidden-label-normal"
        defaultValue="Search"
        variant="filled"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

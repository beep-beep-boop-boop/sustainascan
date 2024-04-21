"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";

import tester from "./soap.jpg";
import { search } from "./actions";
import Searchbar from "./Searchbar";

interface Props {
  initialProducts: Awaited<ReturnType<typeof search>>;
}

export default function Items({ initialProducts }: Props) {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    startTransition(async () => {
      const products = await search(searchQuery);
      setProducts(products);
    });
  }, [searchQuery]);

  useEffect(() => {
    console.log(isPending);
  }, [isPending]);

  return (
    <>
      <Searchbar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(360px, 1fr))"
        gap="1px"
        bgcolor={"#f5f5f5"}
      >
        {products.map((data) => (
          <Card key={data.id} variant="outlined" sx={{ border: "none" }}>
            <CardActionArea
              href={`/product/${data.id}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CardMedia>
                <Image
                  src={tester}
                  width={200}
                  height={200}
                  alt="product_img"
                  objectFit="fill"
                  style={{
                    margin: "10%",
                    boxSizing: "border-box",
                  }}
                />
              </CardMedia>
              <CardContent>
                <Typography gutterBottom variant="body1" component="div">
                  {data.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {data.brand}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </>
  );
}

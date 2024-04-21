"use server";

import { db } from "@/lib/database/db";

export async function search(query?: string) {
  const products = await db.query.products.findMany({
    columns: {
      id: true,
      greenSealURL: true,
      upc: true,
      name: true,
      description: true,
      imageUrl: true,
      productUrl: true,
      certifiedSince: true,
      companyName: true,
      companyLink: true,
      brand: true,
    },
    with: {
      category: {
        columns: {
          name: true,
        },
      },
    },
    ...(query && {
      where: (products, { sql }) =>
        sql`to_tsvector(name || ' ' || description || ' ' || brand ) @@ to_tsquery(${query})`,
    }),
    limit: 200,
  });

  return products;
}

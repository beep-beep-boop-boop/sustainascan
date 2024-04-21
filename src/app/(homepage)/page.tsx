import { db } from "../../lib/database/db";

// import BasicSelect from "./BasicSelect";
import Items from "./Items";
import { search } from "./actions";

async function queryCategories() {
  const categories = await db.query.categories.findMany({
    columns: {
      id: true,
      name: true,
    },
  });

  return categories;
}

//  where: (categories, { eq }) => eq(categories.id, cat),

export default async function Page(): Promise<JSX.Element> {
  const categories = await queryCategories();
  //var products = await queryProductsCategory("");

  return (
    <main>
      {/* <BasicSelect
        categories={categories}
        //onCategoryChange={queryProductsCategory}
      /> */}

      <Items initialProducts={await search()} />
    </main>
  );
}

"use client"
import { useRouter } from "next/navigation";
import { useContext } from "react";
 // Import your Product model
// import db from '../utils/db'; // Import your database connection
// import { xCircleIcon } from '@heroicons/react/outline'; // Import xCircleIcon
import { useEffect } from "react";

const PAGE_SIZE = 2;
const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$50 to $100',
    value: '50-100',
  },
  {
    name: '$1 to $200',
    value: '1-200',
  },
];
const ratings = [1, 2, 3, 4, 5];

export default function Search(props) {
  const { searchParams } = new URL(req.url);
  const router = useRouter();
  // const {
  //   query = 'all',
  //   category = 'all',
  //   brand = 'all',
  //   price = 'all',
  //   rating = 'all',
  //   sort = 'featured',
  //   page = 1,
  // } = router.query;
  const { products, countProducts, categories, brands, pages } = props;

  const filterSearch = (filters) => {
    const updatedQuery = { ...router.query, ...filters };
    router.push({
      pathname: router.pathname,
      query: updatedQuery,
    });
  };

  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };
  const pageHandler = (e) => {
    filterSearch({ page });
  };
  const brandHandler = (e) => {
    filterSearch({ brand: e.target.value });
  };
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };
  const ratingHandler = (e) => {
    filterSearch({ rating: e.target.value });
  };

  useEffect(() => {
    console.log(router.query);
  }, [router.query]);

  const { state, dispatch } = useContext(Store);

  return (
    <Layout title="search">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <div className="my-3">
            <h2>Categories</h2>
            <select
              className="w-full"
              value={category}
              onChange={categoryHandler}>
              <option value="all">ALL</option>
              {categories &&
                categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>
          <div className="my-3">
            <h2>Brands</h2>
            <select
              className="w-full"
              value={brand}
              onChange={brandHandler}>
              <option value="all">ALL</option>
              {brands &&
                brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
            </select>
          </div>
          <div className="my-3">
            <h2>Prices</h2>
            <select
              className="w-full"
              value={price}
              onChange={priceHandler}>
              <option value="all">ALL</option>
              {prices &&
                prices.map((price) => (
                  <option key={price.value} value={price.value}>
                    {price.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="my-3">
            <h2>Ratings</h2>
            <select
              className="w-full"
              value={rating}
              onChange={ratingHandler}>
              <option value="all">ALL</option>
              {ratings &&
                ratings.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Star{rating > 1 && "s"} & up
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="mb-2 flex items-center justify border-b-2 pb-2">
            <div className="flex items-center">
              {query !== "all" && query !== "" && ":" + query}
              {category !== "all" && ":" + category}
              {brand !== "all" && ":" + brand}
              {price !== "all" && "Price" + price}
              {rating !== "all" && "Rating" + rating + "& up"}
              &nbsp;
              {(query !== "all" && query !== "") ||
              category !== "all" ||
              brand !== "all" ||
              rating !== "all" ||
              price !== "all" ? (
                <button onClick={() => router.push("/search")}>
                  <xCircleIcon className="h-5 w-5" />
                </button>
              ) : null}
            </div>
          </div>
          <div>
            Sort by{" "}
            <select value={sort} onChange={sortHandler}>
              <option value="featured">Featured</option>
              <option value="lowest">Price: Low to High</option>
              <option value="highest">Price: High to Low</option>
              <option value="toprated">Customer reviews</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
        <div>
          <ul className="flex">
            {products.length > 0 &&
              [...Array(pages).keys()].map((pageNumber) => (
                <li key={pageNumber}>
                  <button
                    className={`default-button m-2 ${
                      page == pageNumber + 1 ? "font-bold" : ""
                    }`}
                    onClick={() => pageHandler(pageNumber + 1)}>
                    {pageNumber + 1}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || "";
  const brand = query.brand || "";
  const price = query.price || "";
  const rating = query.rating || "";
  const sort = query.sort || "";
  const searchQuery = query.query || "";

  const queryFilter =
    searchQuery && searchQuery !== "all"
      ? {
          name: {
            $regex: searchQuery,
            $options: "i",
          },
        }
      : {};
  const categoryFilter = category && category !== "all" ? { category } : {};
  const brandFilter = brand && brand !== "all" ? { brand } : {};
  const ratingFilter = rating !== "all" ? { rating: { $gte: Number(rating) } } : {};
  const priceFilter =
    price && price !== "all"
      ? {
          price: {
            $gte: Number(price.split("-")[0]),
            $lte: Number(price.split("-")[1]),
          },
        }
      : {};
  const order =
    sort === "featured"
      ? { featured: -1 }
      : sort === "lowest"
      ? { price: 1 }
      : sort === "highest"
      ? { price: -1 }
      : sort === "toprated"
      ? { rating: -1 }
      : sort === "newest"
      ? { createAt: -1 }
      : { _id: 1 };

  await db.connect();
  const categories = await Product.distinct("category");
  const brands = await Product.distinct("brand");

  const productDocs = await Product.find(
    {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...brandFilter,
      ...ratingFilter,
    },
    "-reviews"
  )
    .sort(order)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...brandFilter,
    ...ratingFilter,
  });

  await db.disconnect();

  const products = productDocs.map((product) => db.convertDocToObj(product));

  return {
    props: {
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
      categories,
      brands,
    },
  };
}

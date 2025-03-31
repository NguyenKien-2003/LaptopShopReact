import React, { useState, useEffect } from "react";
import Slideshow from "./SlideShow";
import ProductList from "./ProductList";
import TopProductList from "./TopProductList";
import ProductCategory from "./ProductCategory";
import { getAllCategories } from "../../../services/category.service";
import { toast } from "react-toastify";

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<
    { id: number; name: string; status: boolean }[]
  >([]);

  useEffect(() => {
    const getAllProductVariant = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data.content); // Lưu toàn bộ danh mục vào state
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Không thể tải danh sách danh mục.");
      }
    };

    getAllProductVariant();
  }, []);

  return (
    <div className="px-28">
      <Slideshow />
      <TopProductList />
      <ProductList />
      {categories
        .slice()
        .sort((a, b) => a.id - b.id)
        .map((category) => (
          <ProductCategory
            key={category.id}
            id={category.id}
            name={category.name}
            status={category.status}
          />
        ))}
    </div>
  );
};

export default HomePage;

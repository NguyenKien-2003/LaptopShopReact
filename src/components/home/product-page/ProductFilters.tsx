import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Badge,
  Paper,
} from "@mui/material";
import {
  ExpandMore,
  FilterList,
  MonetizationOn,
  BusinessCenter,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Brand } from "../../../models/Brand";
import { getAllBrands } from "../../../services/brand.service";
import { Category } from "../../../models/Category";
import { getAllCategories } from "../../../services/category.service";

interface ProductFiltersProps {
  onFilterChange: (filters: {
    minPrice: string;
    maxPrice: string;
    brandIds: string;
    categoryIds: string;
  }) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState<string>("");
  const [selectedBrandIds, setSelectedBrandIds] = useState<number[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expanded, setExpanded] = useState<string | false>("pricePanel");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const fetchAllBrands = async () => {
    try {
      const response = await getAllBrands("", 0, 10, "", "");
      setBrands(response.data.content);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const response = await getAllCategories("", "true", 0, 10, "", "");
      setCategories(response.data.content);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const convertPriceRange = (priceRange: string) => {
    switch (priceRange) {
      case "below-10M":
        return { minPrice: "0", maxPrice: "9999999" };
      case "10M-20M":
        return { minPrice: "10000000", maxPrice: "20000000" };
      case "20M-30M":
        return { minPrice: "20000000", maxPrice: "30000000" };
      case "30M-40M":
        return { minPrice: "20000000", maxPrice: "30000000" };
      case "above-40M":
        return { minPrice: "40000000", maxPrice: "1000000000" };
      default:
        return { minPrice: "0", maxPrice: "1000000000" };
    }
  };

  const getPriceRangeLabel = (range: string) => {
    switch (range) {
      case "below-10M":
        return "Dưới 10.000.000₫";
      case "10M-20M":
        return "10.000.000₫ - 20.000.000₫";
      case "20M-30M":
        return "20.000.000₫ - 30.000.000₫";
      case "30M-40M":
        return "30.000.000₫ - 40.000.000₫";
      case "above-40M":
        return "Trên 40.000.000₫";
      default:
        return "";
    }
  };

  const handleApplyFilters = () => {
    const { minPrice, maxPrice } = convertPriceRange(priceRange);
    onFilterChange({
      minPrice,
      maxPrice,
      brandIds: selectedBrandIds.map(String).join(","),
      categoryIds: selectedCategoryIds.map(String).join(","),
    });
  };

  const handleCancelFilters = () => {
    setPriceRange("");
    setSelectedBrandIds([]);
    setSelectedCategoryIds([]);
    onFilterChange({
      minPrice: "0",
      maxPrice: "1000000000",
      brandIds: "",
      categoryIds: "",
    });
  };

  const handleRemoveBrandFilter = (brandId: number) => {
    setSelectedBrandIds((prev) => prev.filter((id) => id !== brandId));
  };

  const handleRemoveCategoryFilter = (categoryId: number) => {
    setSelectedCategoryIds((prev) => prev.filter((id) => id !== categoryId));
  };

  const totalActiveFilters = (priceRange ? 1 : 0) + selectedBrandIds.length + selectedCategoryIds.length;

  useEffect(() => {
    fetchAllBrands();
    fetchAllCategories();
  }, []);

  return (
    <Paper
      elevation={3}
      className="transition-all duration-300 hover:shadow-lg"
      sx={{
        width: "20%",
        minWidth: 324,
        borderRadius: 2,
        overflow: "hidden",
        marginLeft: 1,
      }}
    >
      <Box className="bg-red-50 p-4 flex items-center justify-between">
        <Typography variant="h6" className="font-bold flex items-center">
          <FilterList className="mr-2" />
          Bộ lọc
          {totalActiveFilters > 0 && (
            <Badge
              badgeContent={totalActiveFilters}
              color="error"
              className="ml-2"
            />
          )}
        </Typography>
      </Box>

      <Divider />

      <Box className="p-4">
        {(priceRange || selectedBrandIds.length > 0) && (
          <Box className="mb-4 flex flex-wrap gap-2">
            {priceRange && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Chip
                  label={`Giá: ${getPriceRangeLabel(priceRange)}`}
                  onDelete={() => setPriceRange("")}
                  color="primary"
                  variant="outlined"
                  className="shadow-sm"
                />
              </motion.div>
            )}

            {selectedBrandIds.map((brandId) => {
              const brand = brands.find((b) => b.id === brandId);
              return brand ? (
                <motion.div
                  key={brand.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Chip
                    label={`${brand.name}`}
                    onDelete={() => handleRemoveBrandFilter(brand.id)}
                    color="success"
                    variant="outlined"
                    className="shadow-sm"
                  />
                </motion.div>
              ) : null;
            })}

            {selectedCategoryIds.map((categoryId) => {
              const category = categories.find((c) => c.id === categoryId);
              return category ? (
                <motion.div
                  key={category.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Chip
                    label={`${category.name}`}
                    onDelete={() => handleRemoveBrandFilter(category.id)}
                    color="info"
                    variant="outlined"
                    className="shadow-sm"
                  />
                </motion.div>
              ) : null;
            })}
          </Box>
        )}

        <Accordion
          expanded={expanded === "pricePanel"}
          onChange={handleChange("pricePanel")}
          className="shadow-none border border-gray-200 rounded-md mb-3"
        >
          <AccordionSummary expandIcon={<ExpandMore />} className="bg-gray-50">
            <Typography className="flex items-center font-semibold">
              <MonetizationOn className="mr-2 text-red-600" />
              Khoảng giá
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset" className="w-full">
              <RadioGroup
                name="price-range"
                value={priceRange}
                onChange={(event) => setPriceRange(event.target.value)}
              >
                {[
                  { value: "below-10M", label: "Dưới 10 triệu VNĐ" },
                  { value: "10M-20M", label: "10 triệu VNĐ - 20 triệu VNĐ" },
                  { value: "20M-30M", label: "20 triệu VNĐ - 30 triệu VNĐ" },
                  { value: "30M-40M", label: "30 triệu VNĐ - 40 triệu VNĐ" },
                  { value: "above-40M", label: "Trên 40 triệu VNĐ" },
                ].map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio color="error" />}
                    label={option.label}
                    className={`transition-all duration-200 hover:bg-red-50 rounded-md px-2 ${
                      priceRange === option.value ? "bg-red-100" : ""
                    }`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === "brandPanel"}
          onChange={handleChange("brandPanel")}
          className="shadow-none border border-gray-200 rounded-md"
        >
          <AccordionSummary expandIcon={<ExpandMore />} className="bg-gray-50">
            <Typography className="flex items-center font-semibold">
              <BusinessCenter className="mr-2 text-red-600" />
              Hãng sản xuất
              {selectedBrandIds.length > 0 && (
                <Badge
                  badgeContent={selectedBrandIds.length}
                  color="error"
                  className="ml-2"
                />
              )}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset" className="w-full">
              <FormGroup>
                {brands.map((brand) => (
                  <FormControlLabel
                    key={brand.id}
                    control={
                      <Checkbox
                        checked={selectedBrandIds.includes(brand.id)}
                        onChange={(event) => {
                          const newBrands = event.target.checked
                            ? [...selectedBrandIds, brand.id]
                            : selectedBrandIds.filter((b) => b !== brand.id);
                          setSelectedBrandIds(newBrands);
                        }}
                        color="error"
                      />
                    }
                    label={brand.name}
                    className={`transition-all duration-200 hover:bg-red-50 rounded-md ${
                      selectedBrandIds.includes(brand.id) ? "bg-red-100" : ""
                    }`}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === "categoryPanel"}
          onChange={handleChange("categoryPanel")}
          className="shadow-none border border-gray-200 rounded-md"
        >
          <AccordionSummary expandIcon={<ExpandMore />} className="bg-gray-50">
            <Typography className="flex items-center font-semibold">
              <BusinessCenter className="mr-2 text-red-600" />
              Loại laptop
              {selectedCategoryIds.length > 0 && (
                <Badge
                  badgeContent={selectedCategoryIds.length}
                  color="error"
                  className="ml-2"
                />
              )}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset" className="w-full">
              <FormGroup>
                {categories.map((category) => (
                  <FormControlLabel
                    key={category.id}
                    control={
                      <Checkbox
                        checked={selectedCategoryIds.includes(category.id)}
                        onChange={(event) => {
                          const newCategories = event.target.checked
                            ? [...selectedCategoryIds, category.id]
                            : selectedCategoryIds.filter((c) => c !== category.id);
                          setSelectedCategoryIds(newCategories);
                        }}
                        color="error"
                      />
                    }
                    label={category.name}
                    className={`transition-all duration-200 hover:bg-red-50 rounded-md ${
                      selectedCategoryIds.includes(category.id) ? "bg-red-100" : ""
                    }`}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box className="p-4 bg-gray-50 flex flex-col sm:flex-row justify-center gap-2">
        <Button
          variant="contained"
          color="error"
          onClick={handleApplyFilters}
          className="transition-transform duration-200 hover:scale-105"
          fullWidth
          startIcon={<FilterList />}
        >
          Áp dụng
        </Button>

        {(priceRange || selectedBrandIds.length || selectedCategoryIds.length > 0) && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancelFilters}
            className="transition-transform duration-200 hover:scale-105"
            fullWidth
          >
            Hủy
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default ProductFilters;

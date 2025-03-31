import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllVariantByColor,
  getProductVariantResponseAndRelated,
  getVariantByColor,
  getVariantByColorAndSize,
} from "../../../services/product.service";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import VoucherDialog from "../dialogs/VoucherDialog";
import { ProductDetailAndRelated } from "../../../models/response/ProductDetailAndRelated";
import { FaCartPlus, FaCircle } from "react-icons/fa6";
import { Voucher } from "../../../models/Voucher";
import { useCart } from "../../../contexts/CartContext";
import { toast, ToastContainer } from "react-toastify";
import { addCartNow, addToCart } from "../../../services/cart.service";
import { Variant } from "../../../models/Variant";
import DiscountLabel from "../../common/DiscountLabel";
import { CgDetailsMore } from "react-icons/cg";
import ProductDialog from "./ProductDialog";
import Swal from "sweetalert2";
import { createOrderNow } from "../../../services/order.service";
import { getProfile, isAuthenticated } from "../../../services/auth.service";
import {
  getMyAddress,
  getMyPrimaryAddress,
} from "../../../services/address.service";
import AddressSelection from "./AddressSelection";
import { Address } from "../../../models/Address";
import AddressDialog from "../dialogs/AddressDialog";
import axios from "axios";
import { add } from "lodash";
import { motion } from "framer-motion";
import { NONAME } from "dns";

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const param = useParams();
  const [mainImage, setMainImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [voucherDialogOpen, setVoucherDialogOpen] = useState(false);
  const [isShowVoucherDialog, setIsShowVoucherDialog] =
    useState<boolean>(false);
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const { addItemToCart } = useCart();
  const [productDetail, setProductDetail] = useState<Variant | null>(null);
  const [productRelated, setProductRelated] = useState<Variant[]>([]);
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [isOpenProductDialog, setOpenProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [paymentType, setPaymentType] = useState<string>("transfer");

  const [isWantChange, setIsWantChange] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [provinces, setProvinces] = useState<{ name: string; code: number }[]>(
    []
  );
  const [districts, setDistricts] = useState<{ name: string; code: number }[]>(
    []
  );
  const [wards, setWards] = useState<{ name: string; code: number }[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);

  const [listSizeAvailable, setListSizeAvailable] = useState<number[]>([]);
  const [validColors, setValidColors] = useState<string[]>([]);

  const ntc = require("ntcjs");

  const totalAmount = (productDetail?.price ?? 0) * quantity;
  const discountAmount =
    totalAmount - (productDetail?.priceAfterDiscount ?? 0) * quantity;

  let voucherDiscount = 0;
  if (voucher) {
    if (voucher.discountAmount > 100) {
      voucherDiscount = voucher.discountAmount;
    } else {
      voucherDiscount =
        (totalAmount - discountAmount) * (voucher.discountAmount / 100);
    }
  }

  const totalReducedAmount = discountAmount + voucherDiscount;
  const paymentAmount =
    totalAmount - totalReducedAmount < 0 ? 0 : totalAmount - totalReducedAmount;

  const checkVariantColor = async (color: string) => {
    const response = await getVariantByColor(
      color,
      Number(productDetail?.product.id)
    );
    try {
      if (response.data.stockQuantity > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const fetchAllProvince = async () => {
    try {
      axios
        .get("https://provinces.open-api.vn/api/p/")
        .then((response) => {
          const formattedProvinces = response.data.map((province: any) => ({
            name: province.name,
            code: province.code,
          }));
          setProvinces(formattedProvinces);
        })
        .catch((error) => console.error("Error fetching provinces:", error));
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error);
    }
  };

  const fetchMyAddress = async () => {
    try {
      const response = await getMyAddress();
      setAddresses(response.data);
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error);
    }
  };

  const fetchMyPrimaryAddress = async () => {
    try {
      const response = await getMyPrimaryAddress();
      response.data &&
        setAddress(
          response.data.province +
            " - " +
            response.data.district +
            " - " +
            response.data.ward +
            " - " +
            response.data.street
        );
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error);
    }
  };

  const addProductToCart = async (productVariantId: number) => {
    if (isAuthenticated()) {
      const response = await addToCart(productVariantId, 1);
      if (response) {
        await addItemToCart();
        toast.success("Thêm vào giỏ hàng thành công");
      }
    } else {
      handleCloseProductDialog();
      Swal.fire({
        title: "Vui lòng đăng nhập",
        text: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };

  const handleSubmitByNowNoVoucher = () => {
    handleVoucherDialogClose();
    handleCloseProductDialog();
    Swal.fire({
      title: "Xác nhận mua hàng",
      text: "Bạn có chắc chắn muốn mua sản phẩm này không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then(async (res) => {
      if (res.isConfirmed) {
        if (paymentType === "transfer") {
          const nowCreation = {
            productId: productDetail?.product.id,
            color: selectedColor || "",
            size: selectedSize || 0,
            quantity,
            paymentType: paymentType,
            address: address,
          };
          console.log("NowCreation:", nowCreation);
          if (!selectedColor || !selectedSize) {
            toast.error("Vui lòng chọn năm sản xuất");
            return;
          } else {
            const response = await createOrderNow(nowCreation);
            if (response) {
              addItemToCart();
              handleCloseProductDialog();
              window.location.href = response.vnpayUrl;
            } else {
              toast.error("Đã xảy ra lỗi, vui lòng thử lại sau");
            }
          }
        } else {
          const nowCreation = {
            productId: productDetail?.product.id,
            color: selectedColor || "",
            size: selectedSize || 0,
            quantity,
            paymentType: paymentType,
            address: address,
          };
          console.log("NowCreation:", nowCreation);
          if (!selectedColor || !selectedSize) {
            toast.error("Vui lòng chọn năm sản xuất");
            return;
          } else {
            const response = await createOrderNow(nowCreation);
            if (response) {
              addItemToCart();
              handleCloseProductDialog();
              toast.success("Đã tạo đơn hàng thành công");
              getProductDetailAndRelated(3);
            } else {
              toast.error("Đã xảy ra lỗi, vui lòng thử lại sau");
            }
          }
        }
      }
    });
  };

  const handleSubmitByNow = () => {
    handleVoucherDialogClose();
    handleCloseProductDialog();
    if (voucher) {
      Swal.fire({
        title: "Xác nhận mua hàng",
        text: "Bạn có chắc chắn muốn mua sản phẩm này không?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      }).then(async (res) => {
        if (res.isConfirmed) {
          if (paymentType === "transfer") {
            const nowCreation = {
              productId: productDetail?.product.id,
              color: selectedColor || "",
              size: selectedSize || 0,
              quantity,
              voucherCode: voucher?.code || "",
              paymentType: paymentType,
              address: address,
            };
            console.log("NowCreation:", nowCreation);
            if (!selectedColor || !selectedSize) {
              toast.error("Vui lòng chọn năm sản xuất");
              return;
            } else {
              const response = await createOrderNow(nowCreation);
              if (response) {
                addItemToCart();
                handleCloseProductDialog();
                window.location.href = response.vnpayUrl;
              } else {
                toast.error("Đã xảy ra lỗi, vui lòng thử lại sau");
              }
            }
          } else {
            const nowCreation = {
              productId: productDetail?.product.id,
              color: selectedColor || "",
              size: selectedSize || 0,
              quantity,
              voucherCode: voucher?.code || "",
              paymentType: paymentType,
              address: address,
            };
            console.log("NowCreation:", nowCreation);
            if (!selectedColor || !selectedSize) {
              toast.error("Vui lòng chọn năm sản xuất");
              return;
            } else {
              const response = await createOrderNow(nowCreation);
              if (response) {
                addItemToCart();
                handleCloseProductDialog();
                toast.success("Đã tạo đơn hàng thành công");
                getProductDetailAndRelated(3);
              } else {
                toast.error("Đã xảy ra lỗi, vui lòng thử lại sau");
              }
            }
          }
        }
      });
    } else {
      handleSubmitByNowNoVoucher();
    }
  };

  const handleOpenProductDialog = () => {
    setOpenProductDialog(true);
  };

  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
    console.log("close dialog", isOpenProductDialog);
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : Math.max(1, prev - 1)
    );
    console.log("Quantity:", quantity);
  };

  // const handleSizeSelect = async (size: number) => {
  //   setSelectedSize(size);
  //   console.log("Size:", size);
  //   if (selectedColor) {
  //     const response = await getVariantByColorAndSize(
  //       size,
  //       selectedColor,
  //       Number(productDetail?.product.id)
  //     );
  //     setProductDetail(response.data);
  //   }
  // };

  const handleAddToCartNow = async () => {
    if (isAuthenticated()) {
      const nowCreation = {
        productId: productDetail?.product.id,
        color: selectedColor || "",
        size: selectedSize || 0,
        quantity: quantity,
        voucherCode: "",
        paymentType: paymentType,
        address: address,
      };
      console.log("NowCreation:", nowCreation);
      if (!selectedColor || !selectedSize) {
        toast.error("Vui lòng chọn năm sản xuất");
        return;
      } else {
        const response = await addCartNow(nowCreation);
        if (response) {
          toast.success(response.data.message);
          addItemToCart();
        } else {
          toast.error("Đã xảy ra lỗi, vui lòng thử lại sau");
        }
      }
    } else {
      setOpenProductDialog(false);
      Swal.fire({
        title: "Vui lòng đăng nhập",
        text: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };

  const handleSelectVoucher = (voucher: Voucher) => {
    console.log("Selected voucher:", voucher.code);
    setVoucher(voucher);
    setIsShowVoucherDialog(false);
  };

  const handleVoucherDialogOpen = async () => {
    if (isAuthenticated()) {
      const profile = await getProfile();
      const primaryAddress = await getMyPrimaryAddress();
      if (primaryAddress.data && profile.phoneNumber) {
        if (isAuthenticated()) {
          setVoucherDialogOpen(true);
        } else {
          handleCloseProductDialog();
          Swal.fire({
            title: "Vui lòng đăng nhập",
            text: "Bạn cần đăng nhập để mua hàng",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Đăng nhập",
            cancelButtonText: "Hủy",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/login");
            }
          });
        }
      } else {
        Swal.fire({
          title: "Vui lòng cập nhật thông tin cá nhân và địa chỉ giao hàng",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Cập nhật",
          cancelButtonText: "Hủy",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/manager/profile");
          }
        });
      }
    } else {
      handleCloseProductDialog();
      Swal.fire({
        title: "Vui lòng đăng nhập",
        text: "Bạn cần đăng nhập để mua hàng",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };

  const handleVoucherDialogClose = () => {
    setVoucherDialogOpen(false);
  };

  const getProductDetailAndRelated = async (size: number) => {
    try {
      const response = await getProductVariantResponseAndRelated(
        Number(param.id),
        size
      );
      setProductDetail(response.data.productVariantDetailsResponse);
      setProductRelated(response.data.productVariantDetailsResponses);
      setSelectedColor(response.data.productVariantDetailsResponse.color);
      setSelectedSize(response.data.productVariantDetailsResponse.size);
      setListSizeAvailable((prev: number[]) => [
        ...prev,
        response.data.productVariantDetailsResponse.size,
      ]);
      const res = await getAllVariantByColor(
        response.data.productVariantDetailsResponse.color,
        response.data.productVariantDetailsResponse.id
      );
      res.data.map((variant: Variant) => {
        setListSizeAvailable((prev: number[]) => [...prev, variant.size]);
      });
    } catch (error) {
      console.error("Error fetching product detail:", error);
    }
  };

  const handleImageSelect = (image: string) => {
    setMainImage(`${process.env.REACT_APP_BASE_URL}/files/preview/${image}`);
  };

  // // const handleSizeSelect = async (size: number) => {
  // //   setSelectedSize(size);
  // //   console.log("Size:", size);
  // //   if (selectedColor) {
  // //     const response = await getVariantByColorAndSize(
  // //       size,
  // //       selectedColor,
  // //       Number(productDetail?.product.id)
  // //     );
  // //     setProductDetail(response.data);
  // //   }
  // // };
  // const handleColorSelect = async (color: string) => {
  //   setSelectedSize(null);
  //   setListSizeAvailable([]);
  //   // setSelectedColor((prevColor) => (prevColor === color ? null : color));
  //   setSelectedColor(color);
  //   const response = await getAllVariantByColor(
  //     color,
  //     Number(productDetail?.product.id)
  //   );
  //   response.data.map((variant: Variant) => {
  //     setListSizeAvailable((prev: number[]) => [...prev, variant.size]);
  //   });
  // };

  const handleSizeSelect = async (size: number) => {
    setSelectedSize(size);
    console.log("Size:", size);
    if (selectedColor) {
      const response = await getVariantByColorAndSize(
        size,
        selectedColor,
        Number(productDetail?.product.id)
      );
      setProductDetail(response.data);
    }
  };

  const handleColorSelect = async (color: string) => {
    setSelectedColor(color);
    if (selectedSize) {
      const response = await getVariantByColorAndSize(
        selectedSize,
        color,
        Number(productDetail?.product.id)
      );
      setProductDetail(response.data);
    }

    // setSelectedColor(color);
    // const response = await getAllVariantByColor(
    //   color,
    //   Number(productDetail?.product.id)
    // );
    // const sizes = response.data.map((variant: Variant) => variant.size);
    // setListSizeAvailable(sizes);

    // //Nếu đã chọn size trước đó, kiểm tra xem size đó có khả dụng với màu mới không
    // // if (selectedSize && !sizes.includes(selectedSize)) {
    // //   setSelectedSize(null); // Reset size nếu không khả dụng
    // // }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getProductDetailAndRelated(3);
    fetchMyAddress();
    fetchMyPrimaryAddress();
    fetchAllProvince();
  }, [param.id]);

  useEffect(() => {
    if (productDetail) {
      setMainImage(
        `${process.env.REACT_APP_BASE_URL}/files/preview/${productDetail.imageAvatar}`
      );
    }
  }, [productDetail]);

  useEffect(() => {
    const fetchValidColors = async () => {
      if (productDetail) {
        const valid = await Promise.all(
          productDetail.colors.map(async (color) => {
            try {
              const isValid = await checkVariantColor(color);
              return isValid ? color : null;
            } catch (error) {
              return null;
            }
          })
        );
        setValidColors(valid.filter((color) => color !== null) as string[]);
      }
    };

    fetchValidColors();
  }, [productDetail]);

  return (
    <Box>
      <Box sx={{ marginX: "14%" }}>
        {productDetail && (
          <Grid container spacing={2}>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontSize: "20px", marginLeft: "-32px" }}
              >
                <strong>{productDetail.product.category.name}</strong> &gt;{" "}
                <strong>{productDetail.product.brand.name}</strong> &gt;{" "}
                <strong>{productDetail.product.name}</strong>
              </Typography>

              <Box marginRight={2}>
                <img
                  src={mainImage}
                  alt={productDetail.product.name}
                  style={{
                    width: "520px",
                    height: "380px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    border: "1px solid #D70018",
                    padding: "0 60px",
                  }}
                />
                <div className="flex justify-center align-middle items-center mt-3">
                  {productDetail.imageOthers.map((img, index) => (
                    <img
                      key={index}
                      src={`${process.env.REACT_APP_BASE_URL}/files/preview/${img}`}
                      alt={productDetail.product.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        marginRight: "8px",
                        cursor: "pointer",
                        border: "1px solid #D70018",
                        borderRadius: "4px",
                      }}
                      onClick={() => handleImageSelect(img)}
                    />
                  ))}
                </div>
              </Box>
            </Box>
            <Grid item xs={12} md={6}>
              <div className="relative mr-[5%]">
                {productDetail.price !== productDetail.priceAfterDiscount && (
                  <DiscountLabel discount={productDetail.discountRate} />
                )}
              </div>

              {/* <Typography variant="subtitle1">Thương hiệu: <strong>{productDetail.product.brand.name}</strong></Typography> */}
              <Box display="flex" alignItems="center" gap={2} mt={2}>
                <Typography
                  variant="h5"
                  color="red"
                  sx={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "red",
                  }}
                  mt={2}
                >
                  {productDetail.priceAfterDiscount.toLocaleString()} VNĐ
                </Typography>
                {productDetail.priceAfterDiscount !== productDetail.price ? (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      // alignSelf: "flex-start", // Đẩy Typography lên trên
                    }}
                  >
                    <del>{productDetail.price.toLocaleString()} VNĐ</del>
                    {/* {(productDetail.discountRate ?? 0 > 0) &&
                    ` (-${productDetail.discountRate}%)`} */}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Chưa có khuyến mãi nào
                  </Typography>
                )}
              </Box>
              {/* <Typography variant="body2" mt={2}>{productDetail.product.description}</Typography> */}

              <Box mt={1} display={"flex"} alignItems={"center"}>
                <Typography variant="subtitle1">Bảo hành:</Typography>
                <Box display="flex" gap={1} marginLeft={1}>
                  <Typography variant="subtitle1">
                    <strong>12 tháng tại LaptopKZ</strong>
                  </Typography>
                </Box>
              </Box>

              <Box mt={1} display="flex" alignItems="center">
                <Typography variant="subtitle1">Năm sản xuất:</Typography>
                <Box display="flex" gap={1} marginLeft={2}>
                  {productDetail.sizes.map((size, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      onClick={() => handleSizeSelect(size)}
                      sx={{
                        position: "relative",
                        paddingX: "20px",
                        color: selectedSize === size ? "red" : "black",
                        backgroundColor:
                          selectedSize === size ? "white" : "transparent",
                        borderColor: selectedSize === size ? "red" : "gray",
                        borderWidth: selectedSize === size ? "2px" : "1px", // Tăng độ dày viền
                        paddingRight: "20px",
                        "&:hover": {
                          backgroundColor: "white",
                          borderColor: "red",
                        },
                      }}
                    >
                      {size}
                      {selectedSize === size && (
                        <span
                          style={{
                            position: "absolute",
                            width: "20px",
                            height: "20px",
                            top: "-8px",
                            right: "-4px",
                            display: "flex", // Dùng flexbox để căn giữa
                            alignItems: "center", // Căn giữa theo chiều dọc
                            justifyContent: "center", // Căn giữa theo chiều ngang
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "bold",
                            background: "red",
                            borderRadius: "50%",
                            border: "red",
                          }}
                        >
                          ✔
                        </span>
                      )}
                    </Button>
                  ))}
                </Box>
              </Box>
              <Box mt={1} display="flex" alignItems="flex-start">
                <Typography variant="subtitle1">Cấu hình:</Typography>
              </Box>
              <Box mt={1} display="flex" alignItems="flex-start">
                <Box display="flex" gap={1} marginLeft={0}>
                  {productDetail.colors.map((color, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      onClick={() => handleColorSelect(color)}
                      sx={{
                        position: "relative",
                        paddingX: "8px",
                        color: selectedColor === color ? "red" : "black",
                        backgroundColor:
                          selectedColor === color ? "white" : "transparent",
                        borderColor: selectedColor === color ? "red" : "gray",
                        borderWidth: selectedColor === color ? "2px" : "1px", // Tăng độ dày viền
                        paddingRight: "20px",
                        "&:hover": {
                          backgroundColor: "white",
                          borderColor: "red",
                        },
                      }}
                    >
                      {color}
                      {selectedColor === color && (
                        <span
                          style={{
                            position: "absolute",
                            width: "20px",
                            height: "20px",
                            top: "-8px",
                            right: "-4px",
                            display: "flex", // Dùng flexbox để căn giữa
                            alignItems: "center", // Căn giữa theo chiều dọc
                            justifyContent: "center", // Căn giữa theo chiều ngang
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "bold",
                            background: "red",
                            borderRadius: "50%",
                            border: "red",
                          }}
                        >
                          ✔
                        </span>
                      )}
                    </Button>
                  ))}
                </Box>
              </Box>

              <Box mt={2}>
                <Box display="flex" alignItems="center" gap={0}>
                  <Typography variant="subtitle1" sx={{ marginRight: "52px" }}>
                    Số lượng:
                  </Typography>

                  <Button
                    onClick={() => handleQuantityChange("decrement")}
                    sx={{
                      fontSize: "20px",
                      width: "24px",
                      height: "24px",
                      minWidth: "unset",
                      border: "1px solid red", // Thêm viền đen
                      borderRadius: "0px",
                      borderTopLeftRadius: "4px", // Bo góc trên bên phải
                      borderBottomLeftRadius: "4px",
                      backgroundColor: "white",
                      color: "red",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "white",
                      },
                    }}
                  >
                    −
                  </Button>

                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      width: "40px",
                      height: "24px",

                      borderBottom: "1px solid red",
                      borderTop: "1px solid red",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {quantity}
                  </Typography>

                  <Button
                    onClick={() => handleQuantityChange("increment")}
                    disabled={quantity >= productDetail.stockQuantity}
                    sx={{
                      fontSize: "20px",
                      width: "24px",
                      height: "24px",
                      minWidth: "unset",
                      border: "1px solid red", // Thêm viền đen
                      borderRadius: "0px",
                      borderTopRightRadius: "4px", // Bo góc trên bên phải
                      borderBottomRightRadius: "4px", // Bo góc dưới bên phải
                      backgroundColor: "white",
                      marginRight: "80px",
                      color: "red",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "white",
                      },
                    }}
                  >
                    +
                  </Button>

                  <Typography variant="subtitle1">
                    Tồn kho: <strong>{productDetail.stockQuantity}</strong>
                  </Typography>
                </Box>

                {quantity >= productDetail.stockQuantity &&
                  selectedColor &&
                  selectedSize && (
                    <Typography
                      variant="caption"
                      color="error"
                      className="mt-1"
                    >
                      Hiện còn {productDetail.stockQuantity} sản phẩm
                    </Typography>
                  )}
              </Box>

              <Box mt={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography sx={{ minWidth: 70 }} variant="subtitle1">
                    Giao đến:
                  </Typography>
                  <Typography sx={{ minWidth: 260 }}>
                    {address ? address : "Chưa có địa chỉ phù hợp"}
                  </Typography>

                  <Button
                    onClick={() => setIsWantChange(true)}
                    sx={{ color: "red" }}
                  >
                    Thay đổi
                  </Button>
                </Box>
              </Box>

              <Box display={"flex"} gap={2}>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  sx={{ mt: 3 }}
                  onClick={handleAddToCartNow}
                  disabled={
                    quantity > productDetail.stockQuantity ||
                    !selectedColor ||
                    !selectedSize ||
                    productDetail.stockQuantity === 0
                  }
                >
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3 }}
                  onClick={handleVoucherDialogOpen}
                  disabled={
                    quantity > productDetail.stockQuantity ||
                    !selectedColor ||
                    !selectedSize ||
                    productDetail.stockQuantity === 0
                  }
                >
                  Mua ngay
                </Button>
              </Box>
            </Grid>

            <Box
              sx={{
                borderTop: "1px solid #ddd",
                marginTop: "20px",
                width: "100%",
              }}
            />

            <Typography variant="h5" mt={5}>
              Danh sách sản phẩm liên quan
            </Typography>

            <div className="mt-10 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productRelated.length > 0 ? (
                  productRelated.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={item}
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative group"
                      whileHover={{ y: -5 }}
                      onMouseEnter={() => setHoveredProductId(product.id)}
                      onMouseLeave={() => setHoveredProductId(null)}
                      style={{ minWidth: "202px" }}
                    >
                      <div
                        className="relative overflow-hidden hover:cursor-pointer"
                        onClick={() =>
                          navigate(`/product-detail/${product.id}`)
                        }
                      >
                        <img
                          src={`${process.env.REACT_APP_BASE_URL}/files/preview/${product.imageAvatar}`}
                          alt={product.product.name}
                          className="w-full h-48 object-cover md:h-64 cursor-pointer"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      {product.price !== product.priceAfterDiscount && (
                        <DiscountLabel discount={product.discountRate} />
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">
                          {product.product.name}
                        </h3>
                        <div className="mt-4">
                          {product.discountRate > 0 ? (
                            <div className="flex flex-col justify-end">
                              <span className="text-gray-400 line-through text-end">
                                {product.price.toLocaleString()} VNĐ
                              </span>
                              <span className="text-red-600 font-bold text-end text-lg">
                                {product.priceAfterDiscount.toLocaleString()}{" "}
                                VNĐ
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col justify-end">
                              <span className="text-gray-700 font-semibold text-end text-lg mt-5">
                                {product.price.toLocaleString()} VNĐ
                              </span>
                            </div>
                          )}
                        </div>
                        {/* <div className="flex items-center">
                                                    <span className="text-sm text-gray-600 absolute right-4">{product.id} đã bán</span>
                                                </div> */}
                      </div>
                      {hoveredProductId === product.id && (
                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transform transition-all duration-200">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white p-2.5 rounded-full shadow-lg hover:bg-blue-50 text-blue-600"
                            onClick={() => addProductToCart(product.id)}
                          >
                            <FaCartPlus size={20} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white p-2.5 rounded-full shadow-lg hover:bg-blue-50 text-blue-600"
                            onClick={() => {
                              setSelectedProduct(product);
                              handleOpenProductDialog();
                            }}
                          >
                            <CgDetailsMore size={20} />
                          </motion.button>
                        </div>
                      )}

                      {/* ProductDialog should be outside the map loop */}
                      {selectedProduct && (
                        <ProductDialog
                          isOpen={isOpenProductDialog}
                          onClose={handleCloseProductDialog}
                          handleCloseProductDialog={handleCloseProductDialog}
                          product={selectedProduct}
                          setProduct={setSelectedProduct}
                        />
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div>
                    <br />
                    <br />
                    <div className="">Chưa có sản phẩm liên quan</div>
                  </div>
                )}
              </div>
            </div>
          </Grid>
        )}
      </Box>
      <VoucherDialog
        isShowVoucherDialog={isShowVoucherDialog}
        handleCloseVoucherDialog={() => setIsShowVoucherDialog(false)}
        handleNotSelectVoucher={() => setIsShowVoucherDialog(false)}
        handleSelectVoucher={handleSelectVoucher}
      />

      <Dialog open={voucherDialogOpen} onClose={handleVoucherDialogClose}>
        <DialogTitle>Nhập mã giảm giá</DialogTitle>
        <DialogContent>
          <Box display={"flex"}>
            <TextField
              fullWidth
              sx={{ mt: 2 }}
              placeholder="Chọn mã giảm giá"
              aria-readonly={true}
              value={voucher?.code || ""}
            />
            {!voucher ? (
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2, ml: 2 }}
                onClick={() => setIsShowVoucherDialog(true)}
              >
                Chọn
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="error"
                sx={{ mt: 2, ml: 2 }}
                onClick={() => setVoucher(null)}
              >
                Hủy
              </Button>
            )}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Phương thức thanh toán:
            </Typography>
            <Box className="space-y-2">
              <Box className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="transfer"
                  name="paymentType"
                  value="transfer"
                  checked={paymentType === "transfer"}
                  onChange={(e) => setPaymentType(e.target.value)}
                />
                <label htmlFor="transfer">Thanh toán trực tuyến</label>
              </Box>
              <Box className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="card"
                  name="paymentType"
                  value="card"
                  checked={paymentType === "card"}
                  onChange={(e) => setPaymentType(e.target.value)}
                />
                <label htmlFor="card">Thanh toán khi nhận hàng</label>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: 2, ml: "31%" }}>
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="subtitle1">Tổng cộng:</Typography>
              <Typography variant="subtitle1">
                <p>{totalAmount.toLocaleString()} VNĐ</p>
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="subtitle1">Giảm giá:</Typography>
              <Typography variant="subtitle1">
                <p>{totalReducedAmount.toLocaleString()} VNĐ</p>
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="subtitle1">Thanh toán:</Typography>
              <Typography variant="subtitle1" sx={{ color: "red" }}>
                <p>{paymentAmount.toLocaleString()} VNĐ</p>
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleVoucherDialogClose} color="error">
            Đóng
          </Button>
          <Button onClick={handleSubmitByNow} color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <AddressDialog
        isWantChange={isWantChange}
        setIsWantChange={setIsWantChange}
        addresses={addresses}
        provinces={provinces}
        districts={districts}
        setDistricts={setDistricts}
        wards={wards}
        setWards={setWards}
        selectedProvince={selectedProvince}
        setSelectedProvince={setSelectedProvince}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedWard={selectedWard}
        setSelectedWard={setSelectedWard}
        setAddress={setAddress}
        handleCloseAddressDialog={() => setIsWantChange(false)}
      />
      <ToastContainer />
    </Box>
  );
};

export default ProductDetail;

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Order } from "../../../models/Order";
import { deleteOrder, getOrdersByStatus, getOrderStatuses } from "../../../services/order.service";
import { format } from "date-fns";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../../common/Pagination";
import { Statuses } from "../../../models/response/Statuses";
import axios from "axios";

const OrderManagement: React.FC = () => {
  // State để lưu trạng thái label đang được chọn
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [statuses, setStatuses] = useState<Statuses[]>([]);

  

  const fetchAllOrders = async (page: number) => {
    const response = await getOrdersByStatus(keyword, page, 10, '', '', selectedStatus, startDate, endDate);
    setOrders(response.data.content);
    setTotalPages(response.data.page.totalPages);
  };
    // Hàm tải file Excel
    const handleExportExcel = async () => {
      try {
        const response = await axios.get("http://localhost:8080/orders/export/excel", {
          responseType: "blob", // Đảm bảo nhận dữ liệu dạng file
        });
  
        // Tạo link để tải file
        const link = document.createElement("a");
        const file = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        link.href = URL.createObjectURL(file);
        link.download = "orders.xlsx"; // Tên file xuất
        link.click();
      } catch (error) {
        console.error("Error exporting to Excel:", error);
      }
    };

  const handleDelete = (id: number) => {
    Swal.fire({
        title: 'Ban có chắc chắn muốn xóa đơn này?',
        text: "Dữ liệu sẽ không thể khôi phục sau khi xóa!",
        icon: 'warning',
        confirmButtonText: 'Xóa',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Hủy',
        showCancelButton: true,
    }).then(async (result) => {
        if (result.isConfirmed) {
            if (id !== undefined) {
                console.log(id);
                const response = await deleteOrder(id);
                if (response.status === 200) {
                    fetchAllOrders(currentPage);
                    toast.success('Xóa đơn thành công', {
                        // position: "top-right",
                        autoClose: 3000,
                        // hideProgressBar: false,
                        // closeOnClick: true,
                        // pauseOnHover: true,
                        // draggable: true,
                        // progress: undefined,
                    });
                }
            }
        }
    });
  };

  useEffect(() => {
    const fetchStatuses = async () => {
      const response = await getOrderStatuses();
      setStatuses(response);
    };

    fetchStatuses();
  }, []);

  const handleStatusClick = (value: string) => {
    setSelectedStatus(value);
  };

  useEffect(() => {
    fetchAllOrders(currentPage);
  }, [selectedStatus, currentPage]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Danh sách đơn hàng
      </Typography>

      {/* Status Tabs */}
      <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 1 }}>
        {statuses.map((status, index) => (
          <Chip
            key={index}
            label={`${status.label}${status.count !== null ? ` (${status.count})` : ""}`}
            color={selectedStatus === status.value ? "primary" : "default"}
            onClick={() => handleStatusClick(status.value)}
            clickable
            sx={{
              fontWeight: "bold",
              backgroundColor: selectedStatus === status.value ? "rgba(75, 120, 210, 0.5)" : "transparent",
            }}
          />
        ))}
      </Box>

      {/* Add Invoice Button */}
     
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={() => navigate("/manager/sales-counter")}>
          + Tạo đơn
        </Button>
        <Button variant="contained" color="success" onClick={handleExportExcel} sx={{ ml: 2 }}>
          Xuất Excel 
        </Button>
      </Box>

      {/* Invoice Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell align="center"></TableCell> */}
              <TableCell align="center">STT</TableCell>
              <TableCell align="center">Mã đơn hàng</TableCell>
              <TableCell align="center">Tên khách hàng</TableCell>
              <TableCell align="center">Tên nhân viên</TableCell>
              <TableCell align="center">Hình thức</TableCell>
              <TableCell align="center">Ngày tạo</TableCell>
              <TableCell align="center">Tiền giảm</TableCell>
              <TableCell align="center">Tổng tiền</TableCell>
              <TableCell align="center">Phương thức thanh toán</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              orders.length > 0 ? (
                orders.map((order, index) => (
                  <TableRow key={order.id}>
                    {/* <TableCell align="center">
                      <Checkbox />
                    </TableCell> */}
                    <TableCell align="center">{(index + 1) * (currentPage + 1)}</TableCell>
                    <TableCell align="center">HD{order.id}</TableCell>
                    <TableCell align="center">{order.user?.name}</TableCell>
                    <TableCell align="center">{order.staff?.name}</TableCell>
                    <TableCell align="center">
                      {order.orderType === "POS" ? (
                        <Chip label="Tại quầy" color="primary" />
                      ) : order.orderType === "ONLINE" ? (
                        <Chip label="Trực tuyến" color="secondary" />
                      ) : (
                        <Chip label="Giao hàng" color="success" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {/* {new Date(order.createdAt).toLocaleString("vi-VN")} */}
                      {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                    </TableCell>
                    <TableCell align="center">{order.discountAmount?.toLocaleString()}</TableCell>
                    <TableCell align="center">
                      <Typography color="error" fontWeight="bold">
                        {order.totalPrice.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {
                        order.paymentType === "CASH" ? (
                          <Chip label="Tiền mặt" color="primary" />
                        ) : (
                          order.paymentType === "TRANSFER" ? (
                            <Chip label="Chuyển khoản" color="secondary" />
                          ) : (
                            <Chip label="Thanh toán khi nhận hàng" color="success" />
                          )
                        )
                      }
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={order.paid ? "Đã thanh toán" : "Chưa thanh toán"}
                        color={order.paid ? "primary" : "error"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <div className="flex justify-center items-center space-x-3">
                        <CiEdit size={25} className='cursor-pointer' color='blue' onClick={() => navigate(`/manager/order-details/${order.id}`)} />
                        {/* <MdDeleteForever size={25} className='cursor-pointer' color='red' onClick={() => handleDelete(order.id)} /> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
        <ToastContainer />
      </TableContainer>
      <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage) => setCurrentPage(newPage)}
      />
    </Box>
  );
};

export default OrderManagement;
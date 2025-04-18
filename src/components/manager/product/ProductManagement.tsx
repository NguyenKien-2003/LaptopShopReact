import React, { useState } from 'react';
import { TbCategory } from "react-icons/tb";
import { Category } from '../../../models/Category';
import { createCategory, deleteCategory, getCategoryById, updateCategory } from '../../../services/category.service';
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import Swal from 'sweetalert2';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Switch, TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import Pagination from '../../common/Pagination';
import 'react-toastify/dist/ReactToastify.css';
import { deleteProduct, getAllProducts, updateStatusProduct } from '../../../services/product.service';
import { Product } from '../../../models/Product';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductManagement: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAllProducts = async (page: number) => {
    setLoading(true);
    try {
      const response = await getAllProducts(keyword, status, page, 10, '', '');
      setProducts(response.data.content);
      setTotalPages(response.data.page.totalPages);
      setLoading(false);
    } catch (error) {
      setError('Không thể tải dữ liệu');
      setLoading(false);
    }
  };

  // Hàm tải file Excel
      const handleExportExcel = async () => {
        try {
          const response = await axios.get("http://localhost:8080/products/export/excel", {
            responseType: "blob", // Đảm bảo nhận dữ liệu dạng file
          });
    
          // Tạo link để tải file
          const link = document.createElement("a");
          const file = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          link.href = URL.createObjectURL(file);
          link.download = "products.xlsx"; // Tên file xuất
          link.click();
        } catch (error) {
          console.error("Error exporting to Excel:", error);
        }
      };

  const handleStatusChange = async (id: number) => {
    try {
      const response = await updateStatusProduct(id);
      if (response) {
        toast.success(response.data.message, {
          autoClose: 3000,
        });
        fetchAllProducts(currentPage);
      }
    } catch (error) {
      console.error('Error updating category status:', error);
      toast.error('Cập nhật trạng thái thất bại', {
        autoClose: 3000,
      });
    }
  };

  React.useEffect(() => {
    fetchAllProducts(currentPage);
  }, [keyword, currentPage, status]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Ban có chắc chắn muốn xóa sản phẩm này?',
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
          await deleteProduct(id);
          toast.success('Xóa sản phẩm thành công', {
            autoClose: 3000,
          });
          fetchAllProducts(currentPage);
        }
      }
    });
  };

  return (
    <div className="p-6 bg-gray-100">
      {/* Tiêu đề */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold flex items-center">
          <TbCategory className='mr-5' />
          Quản lý sản phẩm
        </h1>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Bộ lọc và tìm kiếm</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className='flex col-span-1 items-center'>
            <label className="text-gray-700 mb-1 w-52">Tên sản phẩm:</label>
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={keyword}
              onChange={handleKeywordChange}
            />
          </div>
          <div className='flex col-span-1 items-center'>
            <label className="text-gray-700 mb-1 w-52">Trạng thái:</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="true">Vẫn kinh doanh</option>
              <option value="false">Không kinh doanh</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-2">Danh sách sản phẩm</h2>
        <div>
          <div className="flex justify-end mb-4">
            <Link to="/manager/add-product" className="bg-blue-500 text-white px-2 py-2 rounded-md hover:bg-blue-600">
              Thêm sản phẩm
            </Link>
            <button onClick={handleExportExcel} className="bg-green-500 text-white px-2 py-2 rounded-md hover:bg-green-600 ml-4">
              Xuất Excel
            </button>
          </div>  

        </div>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="border p-2">STT</th>
              <th className="border p-2">Mã sản phẩm</th>
              <th className="border p-2">Tên sản phẩm</th>
              <th className="border p-2">Hãng sản xuất</th>
              <th className="border p-2">Trạng thái</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className="bg-white hover:bg-gray-100">
                <td className="border p-2 text-center">{(index + 1) * (currentPage + 1)}</td>
                <td className="border p-2">{'SP' + product.id}</td>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.brand.name}</td>
                <td className="border p-2 text-center">
                  <Switch
                    color="primary"
                    checked={product.status}
                    onChange={() => handleStatusChange(product.id)}
                  />
                </td>
                <td className="border p-2 text-center">
                  <div className="flex justify-center items-center space-x-3">
                    <CiEdit size={25} className='cursor-pointer' color='blue' onClick={() => navigate(`/manager/update-product/${product.id}`)} />
                    <MdDeleteForever size={25} className='cursor-pointer' color='red' onClick={() => handleDelete(product.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
      </div>
      <ToastContainer />
    </div>
  )
}

export default ProductManagement

import React, { useState, useEffect, useRef } from "react";
import { FaBars } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  hasManagement,
  isAuthenticated,
  logout,
} from "../../services/auth.service";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useProfile } from "../../contexts/ProfileContext";
import Header from "../../layouts/Header";

interface ManagerHeaderProps {
  toggleSidebar: () => void;
}

const ManagerHeader: React.FC<ManagerHeaderProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { profile } = useProfile();
  const isManager = hasManagement();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const shouldHideHeader = isManager && location.pathname.startsWith('/manager');
  const handleLogout = async () => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn đăng xuất?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đăng xuất",
      confirmButtonColor: "#d33",
      cancelButtonText: "Hủy",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await logout();
          navigate("/login", { replace: true });
          localStorage.clear();
          sessionStorage.clear();
          // queryClient.clear(); // Xóa toàn bộ cache trong React Query
          window.location.reload();
          toast.success(response.message, {
            autoClose: 3000,
          });
        } catch (error) {
          console.error("Error logging out:", error);
          toast.error("Đã xảy ra lỗi, vui lòng thử lại sau", {
            autoClose: 3000,
          });
        }
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header
      className="bg-red-custom fixed w-full top-0 flex justify-between px-[120px] "
      style={{ zIndex: 1400 }}
    >
      {/* <div>
        <img
          src="/assets/img/logo/logokz.jpg"
          alt="Logo"  
          width="80"
          height="80"
          className="hover:cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div> */}
      <div>
      {
        !shouldHideHeader ? <Header /> : null
      }
      </div>
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center">
          {isManager && location.pathname.startsWith("/manager") && (
            <FaBars
              size={28}
              onClick={toggleSidebar}
              className="cursor-pointer mr-5 absolute left-[32px]"
            />
          )}
        </div>
        {isAuthenticated() ? (
          <div className="relative" ref={dropdownRef} style={{ zIndex:1300}}>
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={toggleDropdown}
            >
           
              <img
                src={profile.avatarUrl}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
               />
            </div>
            {isDropdownOpen && (
              <div className="fixed right-[120px] mt-[8px] w-48 bg-white rounded-md shadow-lg py-2"  style={{ zIndex:9999}}>
                {isManager && (
                  
                  <Link
                    to="/manager/sales-counter"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    onClick={toggleDropdown}
                  >
                    Trang quản lý
                  </Link>
                )}
                <Link
                  to="/manager/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={toggleDropdown}
                >
                   {profile.name}
                </Link>
                <Link
                  to="/manager/my-order"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={toggleDropdown}
                >
                  Đơn hàng của tôi
                </Link>
                
                <Link
                  to="/manager/change-password"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={toggleDropdown}
                >
                  Đổi mật khẩu
                </Link>
                <li
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </li>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="fixed right-[80px] top-[10px] text-white font-semibold uppercase  bg-none py-2"  style={{ zIndex:9999}}>
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
};

export default ManagerHeader;

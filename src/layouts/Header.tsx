import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useCart } from "../contexts/CartContext";
import { isAuthenticated } from "../services/auth.service";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartTotal } = useCart();
  const [keyword, setKeyword] = useState<string>("");

  const handleChangeKeyword = (keyword: string) => {
    if (location.pathname !== "/product-page" && keyword !== "") {
      navigate("/product-page", { state: { keyword } });
    } else if (location.pathname === "/product-page") {
      navigate("/product-page", { state: { keyword } });
    }
    console.log(keyword);
  };

  return (
    <header
      className="sticky top-0 bg-red-custom text-text-color-custom p-2 left-0 right-0  px-[120px] mb-[-132px] mt-[-10px]"
      style={{ zIndex: 1100 }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <nav className="mt-2">
          <ul className="flex space-x-6 justify-center text-lg">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  ` font-semibold mt-3 text-[16px] ${
                    isActive ? "pb-1 border-b-2 border-text-color-custom" : ""
                  }`
                }
              >
                TRANG CHỦ
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/product-page"
                className={({ isActive }) =>
                  ` font-semibold mt-3 text-[16px] ${
                    isActive ? "pb-1 border-b-2 border-text-color-custom" : ""
                  }`
                }
              >
                SẢN PHẨM
              </NavLink>
            </li>
            {/* <li>TIN TỨC</li> */}
            <li>
              <NavLink
                to="/intro"
                className={({ isActive }) =>
                  ` font-semibold mt-3 text-[16px] ${
                    isActive ? "pb-1 border-b-2 border-text-color-custom" : ""
                  }`
                }
              >
                GIỚI THIỆU
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  ` font-semibold mt-3 text-[16px] ${
                    isActive ? "pb-1 border-b-2 border-text-color-custom" : ""
                  }`
                }
              >
                LIÊN HỆ
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className=" flex items-center">
          {/* Search Bar */}
          <div className="relative flex-grow mx-8 flex ">
            <input
              type="text"
              placeholder="Tìm kiếm.."
              className="w-[400px] p-2 px-4 border border-gray-300 focus:outline-none rounded-xl"
              onChange={(e) => handleChangeKeyword(e.target.value)}
            />
            <button className="absolute right-4 top-2 text-gray-500 rounded-r-md focus:outline-none flex justify-center items-center" >
              <FaSearch size={24} />
            </button>
          </div>

          {/* Icons */}
          <div className="flex space-x-4 relative mt-2">
            {/* Cart Icon */}
            <div className="hover:cursor-pointer">
              <Link to={"/cart"}>
                <FaCartShopping size={35} />
              </Link>
              <span
                className="absolute bg-red-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center"
                style={{ top: -5, right: -5 }}
              >
                {isAuthenticated() ? cartTotal : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

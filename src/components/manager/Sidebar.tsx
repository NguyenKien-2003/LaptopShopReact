import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBox, FaUsers, FaClipboardList, FaChevronDown, FaChevronUp, FaStore } from 'react-icons/fa';
import { BiSolidOffer } from "react-icons/bi";
import { TbReportAnalytics } from 'react-icons/tb';
import { isAdmin } from '../../services/auth.service';

interface SidebarProps {
    isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
    const [isDropdownAccountOpen, setDropdownAccountOpen] = useState(false);
    const toggleDropdownAccount = () => setDropdownAccountOpen(!isDropdownAccountOpen);

    const [isDropdownProductOpen, setDropdownProductOpen] = useState(false);
    const toggleDropdownProduct = () => setDropdownProductOpen(!isDropdownProductOpen);

    const [isDropdownDiscountOpen, setDropdownDiscountOpen] = useState(false);
    const toggleDropdownDiscount = () => setDropdownDiscountOpen(!isDropdownDiscountOpen);

    return (
        <aside className={`bg-colorbg text-white w-64 fixed h-screen overflow-y-auto transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-4">
                <h2 className="text-lg font-bold mb-4">Menu</h2>
                <ul className="space-y-2">
                    <li>
                        <Link to="/" className="flex items-center px-4 py-2 hover:bg-red-700 rounded transition duration-200">
                            <FaHome className="mr-2" /> Trang chủ
                        </Link>
                    </li>
                    <li>
                        <Link to="/manager/revenue" className="flex items-center px-4 py-2 hover:bg-red-700 rounded transition duration-200">
                            <TbReportAnalytics className="mr-2" /> Doanh thu
                        </Link>
                    </li>
                    <li>
                        <Link to="/manager/sales-counter" className="flex items-center px-4 py-2 hover:bg-red-700 rounded transition duration-200">
                            <FaStore className="mr-2" /> Bán hàng tại quầy
                        </Link>
                    </li>
                    <li>
                        <div onClick={toggleDropdownProduct} className="flex items-center px-4 py-2 hover:bg-red-700 rounded cursor-pointer transition duration-200">
                            <FaBox className="mr-2" /> Quản lý sản phẩm
                            {isDropdownProductOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
                        </div>
                        {isDropdownProductOpen && (
                            <ul className="ml-10 mt-2 space-y-1">
                                <li>
                                    <Link to="/manager/product-management" className="block px-4 py-1 hover:bg-red-700 rounded text-left transition duration-200">
                                        Sản phẩm
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manager/brand-management" className="block px-4 py-1 hover:bg-red-700 rounded text-left transition duration-200">
                                        Hãng sản xuất
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manager/category-management" className="block px-4 py-1 hover:bg-red-700 rounded text-left transition duration-200">
                                        Loại laptop
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        {isAdmin() && (
                            <div onClick={toggleDropdownAccount} className="flex items-center px-4 py-2 hover:bg-red-700 rounded cursor-pointer transition duration-200">
                                <FaUsers className="mr-2" /> Quản lý tài khoản
                                {isDropdownAccountOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
                            </div>
                        )}
                        {isDropdownAccountOpen && (
                            <ul className="ml-10 mt-2 space-y-1">
                                <li>
                                    <Link to="/manager/staff-management" className="block px-4 py-1 hover:bg-red-700 rounded text-left transition duration-200">
                                        Nhân viên
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manager/user-management" className="block px-4 py-1 hover:bg-red-700 rounded text-left transition duration-200">
                                        Khách hàng
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        {isAdmin() && (
                            <div onClick={toggleDropdownDiscount} className="flex items-center px-4 py-2 hover:bg-red-700 rounded cursor-pointer transition duration-200">
                                <BiSolidOffer className="mr-2" /> Quản lý giảm giá
                                {isDropdownDiscountOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
                            </div>
                        )}
                        {isDropdownDiscountOpen && (
                            <ul className="ml-10 mt-2 space-y-1">
                                <li>
                                    <Link to="/manager/discount-management" className="block px-4 py-1 hover:bg-red-700 rounded text-left transition duration-200">
                                        Đợt giảm giá
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manager/voucher-management" className="block px-4 py-1 hover:bg-red-700 rounded text-left transition duration-200">
                                        Mã giảm giá
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <Link to="/manager/order-management" className="flex items-center px-4 py-2 hover:bg-red-700 rounded transition duration-200">
                            <FaClipboardList className="mr-2" /> Quản lý đơn hàng
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;

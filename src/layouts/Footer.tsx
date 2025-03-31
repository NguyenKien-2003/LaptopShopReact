import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-footerbg text-footertext">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Company Information */}
                <div className="space-y-4">
                <h3 className="font-semibold text-lg text-footerh">LAPTOPKZ</h3>
                    <p>Địa chỉ: Phú Diễn,Bắc Từ Liêm, Hà Nội</p>
                    <p>Điện thoại: 0123456789</p>
                    <p>Email: abc@gmail.com</p>
                    <div className="flex space-x-3 justify-center">
                        <a href="#" className="text-blue-400 hover:text-blue-600 transition duration-200">
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a href="#" className="text-pink-500 hover:text-pink-700 transition duration-200">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className="text-red-600 hover:text-red-800 transition duration-200">
                            <i className="fab fa-youtube"></i>
                        </a>
                        <a href="#" className="text-blue-400 hover:text-blue-600 transition duration-200">
                            <i className="fab fa-twitter"></i>
                        </a>
                    </div>
                </div>

                {/* Company Information Links */}
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg  text-footerh">THÔNG TIN CỦA CHÚNG TÔI</h3>
                    <p>Cơ sở 1: 100 Cầu Giấy, Hà Nội, Việt Nam</p>
                    <p>Cơ sở 2: 100 Hoàn Kiếm, Hà Nội, Việt Nam</p>
                    <p>Lĩnh vực kinh doanh</p>
                </div>

                {/* Policies and Support */}
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg  text-footerh">CHÍNH SÁCH</h3>
                    <p>Chính sách bảo hành</p>
                    <p>Chính sách đổi trả</p>
                    <p>Chính sách thanh toán</p>
                    <p>Chính sách giao nhận hàng</p>
                    <p>Chính sách bảo mật</p>
                </div>

                <div className='space-y-2'>
                    <h3 className="font-semibold text-lg  text-footerh">HỖ TRỢ CHUNG</h3>
                    <p>Trang chủ</p>
                    <p>Giới thiệu</p>
                    <p>Sản phẩm</p>
                    <p>Liên hệ</p>
                </div>
            </div>
            <div className="text-center mt-6 border-t border-gray-700 pt-4">
                <p className="text-sm">&copy; {new Date().getFullYear()} Công ty TNHH LAPTOPKZ. Bảo lưu mọi quyền.</p>
            </div>
        </footer>
    );
};

export default Footer;

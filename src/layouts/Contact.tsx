import React from 'react';
import { TextField, Button } from '@mui/material';

const Contact: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md flex flex-wrap gap-6 justify-center">
      {/* Thông tin liên hệ */}
      <div className="w-full md:w-1/2 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">THÔNG TIN LIÊN HỆ</h2>
        <p className="text-gray-600">
          LaptopKZ xin hân hạnh phục vụ quý khách.
        </p>
        <div className="space-y-2">
          <p><strong>📍 Địa chỉ:</strong> Phú Diễn, Bắc Từ Liêm, Hà Nội</p>
          <p><strong>📞 Phone:</strong> <a href="tel:0123456789" className="text-blue-600">08556787360855678736</a></p>
          <p><strong>✉️ Email:</strong> <a href="mailto:abc@gmail.com" className="text-blue-600">nguyenngockien30082003@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
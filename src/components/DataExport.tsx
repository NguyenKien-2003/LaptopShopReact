import React from 'react';
import axios from 'axios';

const ExportExcelButton = () => {

    const handleExport = async () => {
        try {
            const response = await axios.get('http://localhost:8080/products/export/excel', {
                responseType: 'blob',  // Chúng ta cần nhận về dữ liệu dưới dạng blob (file)
            });

            // Tạo URL từ dữ liệu blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'products.xlsx'); // Tên file tải xuống
            document.body.appendChild(link);
            link.click();

            // Xóa link sau khi tải xong
            document.body.removeChild(link);
        } catch (error) {
            console.error("Lỗi khi xuất file Excel:", error);
        }
    };

    return (
        <div>
            <button onClick={handleExport} className="btn btn-primary">
                Tải xuống Excel
            </button>
        </div>
    );
};

export default ExportExcelButton;

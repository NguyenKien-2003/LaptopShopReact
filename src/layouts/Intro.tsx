import React from 'react';

const Intro = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-6">
        {/* Phần Tầm nhìn */}
        <section>
          <h2 className="text-xl font-bold text-gray-800">I/ Tầm nhìn</h2>
          <p className="text-gray-600 mt-2">
            Tại LaptopKZ, chúng tôi luôn hướng đến việc cải tiến chất lượng trải nghiệm của khách hàng thông qua việc đa dạng hóa các loại sản phẩm, đầu tư nghiên cứu để đưa ra những tư vấn phù hợp với từng khách hàng một. Và với định hướng trở thành một trong những cửa hàng cung cấp các sản phẩm công nghệ tốt nhất Việt Nam, LaptopKZ luôn hướng đến những giá trị cốt lõi cho khách hàng bao gồm:
          </p>
          <ul className="list-decimal list-inside mt-4 space-y-2 text-gray-600">
            <li><strong>Trải nghiệm hoàn hảo:</strong> Thông qua việc tư vấn, hỗ trợ khách hàng tận tâm và nhanh nhất có thể.</li>
            <li><strong>Sản phẩm chính hãng:</strong> Sản phẩm được LaptopKZ nhập khẩu chính hãng nên các bạn có thể yên tâm về nguồn gốc sản phẩm.</li>
            <li><strong>Chế độ dịch vụ:</strong> Những sản phẩm tại LaptopKZ được bảo hành 12 tháng, hỗ trợ trả góp 0% lãi suất, Freeship toàn quốc khi khách hàng đặt cọc trước.</li>
          </ul>
        </section>

        {/* Phần Sứ mệnh */}
        <section>
          <h2 className="text-xl font-bold text-gray-800">II/ Sứ mệnh</h2>
          <p className="text-gray-600 mt-2">
            Đặt khách hàng làm trung tâm. Đáp ứng hiệu quả nhất mọi nhu cầu vì lợi ích khách hàng và chất lượng dịch vụ. Đặt nhân sự là yếu tố quyết định và là nền tảng của sự phát triển. Không ngừng đào tạo và xây dựng đội ngũ kế thừa. Chia sẻ các quyền lợi với các thành viên trong công ty, cùng xây dựng và phát triển vì mục tiêu chung của công ty.
          </p>
        </section>

        {/* Phần Cửa hàng */}
        <section>
          <h2 className="text-xl font-bold text-gray-800">III/ Cửa hàng của LaptopKZ</h2>
          <div className="text-gray-600 mt-2 space-y-2">
            <p><strong>LaptopKZ Store 1:</strong> Phú Diễn, Bắc Từ Liêm, Hà Nội | ĐT: 855678736</p>
            <p>Hoạt động từ 9h tới 21h hằng ngày và cả 7 ngày trong tuần. Rất vui được đón tiếp các bạn.</p>
            <p>Xin cảm ơn các bạn đã tin tưởng và ủng hộ LaptopKZ.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Intro;
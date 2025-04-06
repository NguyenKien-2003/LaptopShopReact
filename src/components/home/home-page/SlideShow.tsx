import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const slides = [
  {
    id: 1,
    src: "./assets/img/slideshow/1.jpg",
    alt: "Los Angeles",
    link: "product-detail/1",
  },
  {
    id: 2,
    src: "./assets/img/slideshow/2.jpg",
    alt: "Chicago",
    link: "product-detail/1",
  },
  {
    id: 3,
    src: "./assets/img/slideshow/3.jpg",
    alt: "New York",
    link: "product-detail/1",
  },
  {
    id: 4,
    src: "./assets/img/slideshow/4.jpg",
    alt: "New York",
    link: "product-detail/1",
  },
  {
    id: 5,
    src: "./assets/img/slideshow/5.jpg",
    alt: "New York",
    link: "product-detail/1",
  },
  {
    id: 6,
    src: "./assets/img/slideshow/6.jpg",
    alt: "New York",
    link: "product-detail/1",
  },
  {
    id: 7,
    src: "./assets/img/slideshow/7.jpg",
    alt: "New York",
    link: "product-detail/1",
  },
  {
    id: 7,
    src: "./assets/img/slideshow/8.jpg",
    alt: "New York",
    link: "product-detail/1",
  },
  {
    id: 8,
    src: "./assets/img/slideshow/9.jpg",
    alt: "New York",
    link: "product-detail/1",
  },
  {
    id: 9,
    src: "./assets/img/slideshow/10.jpg",
    alt: "New York",
    link: "product-detail/1",
  },
  {
    id: 10,
    src: "./assets/img/slideshow/11.jpg",
    alt: "New York",
    link: "product-detail/1",
  },
  {
    id: 11,
    src: "./assets/img/slideshow/12.jpg",
    alt: "New York",
    link: "product-detail/1",
  },
  {
    id: 12,
    src: "./assets/img/slideshow/13.jpg",
    alt: "New York",
    link: "product-detail/1",
  },
  {
    id: 13,
    src: "./assets/img/slideshow/16.jpg",
    alt: "New York",
    link: "product-detail/1",
  },
];

const Slideshow: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Tự động chuyển slide sau mỗi 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center">
      <section className="px-2">
        <Carousel
          selectedItem={currentSlide}
          showThumbs={false}
          showStatus={false}
          autoPlay={false}
          onChange={(index) => setCurrentSlide(index)} // Cập nhật slide khi người dùng chọn
        >
          {slides.map((slide, index) => (
            <Link to={`/product-detail/${slide.id}`}>
              <div key={slide.id} className="relative">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-auto cursor-pointer rounded-xl"
                />
              </div>
            </Link>
          ))}
        </Carousel>
      </section>
      <div className="w-[10900px] h-full flex-col justify-between mr-2">
        <img
          src="./assets/img/slideshow/k1.jpg"
          className="w-full h-auto cursor-pointer rounded-xl"
        />
        <img
          src="./assets/img/slideshow/k2.jpg"
          className="w-full h-auto cursor-pointer rounded-xl mt-[7px]"
        />
      </div>
    </div>
  );
};
export default Slideshow;

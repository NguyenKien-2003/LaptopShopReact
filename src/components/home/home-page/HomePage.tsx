import React from 'react';
import Slideshow from './SlideShow';
import ProductList from './ProductList';
import TopProductList from './TopProductList';
import ProductCategory from './ProductCategory';


const HomePage: React.FC = () => {
  return (
    <div className='px-28'>
      <Slideshow />
      <TopProductList />
      <ProductList />
      <ProductCategory />
    </div>
  );
};

export default HomePage;
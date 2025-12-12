import { mainApi } from '@/api/main-api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconMap } from '@/lib/category-icon-mapping';
import { TabsContent } from '@radix-ui/react-tabs';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ProductCard } from './product-card';

export function CategoryView() {
  const navigate = useNavigate();
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resp = await mainApi.getCategories();
        setItemList(resp.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSelectCategory = (categoryId) => {
    const filteredProducts = itemList.filter((product) => product.categoryId === categoryId);
    setProductList(filteredProducts);
  };

  if (!itemList || itemList.length === 0) {
    return null;
  }

  return (
    <section
      className='flex h-fit w-full flex-col items-center justify-center'
      aria-labelledby='category-product-title'
    >
      <header className='container mx-auto px-4'>
        <h2
          id='category-product-title'
          className='mb-8 text-3xl'
        >
          카테고리별 추천 상품
        </h2>
      </header>
      <div className='container mx-auto px-4'>
        <Tabs
          defaultValue='019a69f3-b7b4-7c2d-afb2-2fcb168bfe12'
          className='w-full'
        >
          <TabsList className='mb-8 h-auto w-full flex-wrap justify-start gap-2 rounded-full bg-neutral-200 p-1 dark:bg-neutral-600'>
            {itemList.map((item) => {
              return (
                <TabsTrigger
                  key={item.categoryId.toString()}
                  value={item.categoryId.toString()}
                  className='gap-2 rounded-full px-4'
                  onClick={() => handleSelectCategory(item.categoryId)}
                >
                  <IconMap
                    categoryName={item.categoryName}
                    className='size-5'
                  />
                  {item.categoryName}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {itemList.map((item) => (
            <TabsContent
              key={item.categoryId}
              value={item.categoryId.toString()}
            >
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                {item.products.map((product) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <Button
        variant='default'
        className='mx-auto mt-4 w-3xs px-8 hover:opacity-80'
        onClick={() => navigate({ to: '/products' })}
      >
        전체 상품 보기
      </Button>
    </section>
  );
}

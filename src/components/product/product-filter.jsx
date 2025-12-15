import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, X } from 'lucide-react';
import { useSelector } from 'react-redux';

export const ProductFilter = ({ filters, setFilters }) => {
  const { categories } = useSelector((state) => state.category);

  const { searchQuery, categories: selectedCategories } = filters;

  const handleParentCategoryToggle = (parentCategory) => {
    const subCategories =
      categories
        .find((cat) => cat.categoryId === parentCategory.categoryId)
        ?.subCategories.map((subCat) => subCat.categoryId) || [];

    const isAllSubSelected = subCategories.every((subCatId) =>
      selectedCategories.includes(subCatId),
    );

    let newCategories;
    if (isAllSubSelected) {
      newCategories = selectedCategories.filter(
        (id) => id !== parentCategory.categoryId && !subCategories.includes(id),
      );
    } else {
      newCategories = [...selectedCategories, parentCategory.categoryId, ...subCategories];
    }

    setFilters((prev) => ({
      ...prev,
      categories: newCategories,
    }));
  };

  const handleCategoryToggle = (categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId) // 선택 해제
      : [...selectedCategories, categoryId]; // 선택 추가

    setFilters((prev) => ({
      ...prev,
      categories: newCategories,
    }));
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setFilters((prev) => ({
      ...prev,
      searchQuery: query,
    }));
  };

  const handleReset = () => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: '',
      categories: [],
    }));
  };

  const isParentCategorySelected = (parentCategory) => {
    const subCategorieIds = parentCategory.subCategories?.map((subCat) => subCat.categoryId) || [];

    if (subCategorieIds.length === 0) return false;
    return subCategorieIds.every((subCatId) => selectedCategories.includes(subCatId));
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategories.length > 0;

  return (
    <div className='space-y-6 rounded-lg p-6 shadow-sm'>
      {/* 헤더 */}
      <div className='flex items-center justify-between'>
        <h2 className='text-lg'>상세 검색</h2>
        {hasActiveFilters && (
          <Button
            variant='ghost'
            size='sm'
            onClick={handleReset}
            className='gap-2'
          >
            <X className='size-4' />
            초기화
          </Button>
        )}
      </div>

      {/* 검색어 */}
      <div className='space-y-2'>
        <Label htmlFor='search-input'>상품명 검색</Label>
        <div className='relative'>
          <Search
            className='absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-gray-400'
            aria-hidden='true'
          />
          <Input
            id='search-input'
            type='search'
            placeholder='상품명을 입력하세요'
            className='pl-10'
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* 카테고리 */}
      <div className='space-y-3'>
        <Label>카테고리</Label>
        <div className='space-y-2'>
          {categories.map((category) => {
            const subCategories = category.subCategories || [];
            return (
              <div
                key={category.categoryId}
                className='space-y-1'
              >
                <div className='flex items-center gap-2'>
                  <Checkbox
                    id={`category-${category.categoryId}`}
                    checked={isParentCategorySelected(category)}
                    onCheckedChange={() => handleParentCategoryToggle(category)}
                  />
                  <Label
                    htmlFor={`category-${category.categoryId}`}
                    className='cursor-pointer font-medium'
                  >
                    {category.categoryName}
                  </Label>
                </div>
                {/* 하위 카테고리 */}
                <div className='ml-6 space-y-1'>
                  {subCategories.map((subCat) => (
                    <div
                      key={subCat.categoryId}
                      className='flex items-center gap-2'
                    >
                      <Checkbox
                        id={`subcategory-${subCat.categoryId}`}
                        checked={selectedCategories.includes(subCat.categoryId)}
                        onCheckedChange={() => handleCategoryToggle(subCat.categoryId)}
                      />
                      <Label
                        htmlFor={`subcategory-${subCat.categoryId}`}
                        className='cursor-pointer'
                      >
                        {subCat.categoryName}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {/* {categories.map((category) => (
            <div
              key={category.id}
              className='flex items-center gap-2'
            >
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className='cursor-pointer'
              >
                {category.name}
              </Label>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
};

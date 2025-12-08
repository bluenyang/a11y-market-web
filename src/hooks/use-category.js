import { fetchCategories } from '@/store/category-slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useCategory = () => {
  const {} = useSelector((state) => state.category);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
};

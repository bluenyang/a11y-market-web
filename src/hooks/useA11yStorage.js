// src/hooks/useA11yStorage.js

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveA11y, loadA11y } from '@/lib/a11y/a11yStorage';
import { setAllA11y } from '@/store/a11ySlice';

export default function useA11yStorage() {
  const dispatch = useDispatch();
  const a11yState = useSelector((state) => state.a11y);
  const isFirst = useRef(true);

  // 로딩
  useEffect(() => {
    const stored = loadA11y();

    if (stored) {
      dispatch(setAllA11y(stored));
    }
  }, [dispatch]);

  // 상태 변경
  useEffect(() => {
      if (isFirst.current) {
        isFirst.current = false;
        return;
      }


    saveA11y(a11yState);
  }, [a11yState]);
}

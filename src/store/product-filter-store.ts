import { create } from 'zustand';

interface ProductFilterState {
  filters: {
    searchQuery: string;
    categories: string | string[];
    isA11yGuaranteed: boolean;
    sellerGrade: string;
  };
  sortBy: string;

  setFilters: (filters: Partial<ProductFilterState['filters']>) => void;
  setSortBy: (sortBy: string) => void;
  resetFilters: () => void;
}

export const useProductFilterStore = create<ProductFilterState>((set) => ({
  filters: {
    searchQuery: '',
    categories: '',
    isA11yGuaranteed: false,
    sellerGrade: '',
  },
  sortBy: 'on-development',

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  setSortBy: (sortBy) => set({ sortBy }),

  resetFilters: () =>
    set({
      filters: {
        searchQuery: '',
        categories: '',
        isA11yGuaranteed: false,
        sellerGrade: '',
      },
      sortBy: 'on-development',
    }),
}));

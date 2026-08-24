import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Apple,
  Milk,
  Cookie,
  Pill,
  Fish,
  Smartphone,
  BookOpen,
  Sparkles,
  Wrench,
  Dog,
  Home,
  LayoutGrid,
} from 'lucide-react';

interface CategoryBarProps {
  onSelectCategory?: (category: string) => void;
  selectedCategory?: string;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const { categories, selectedCategoryFilter, setSelectedCategoryFilter, setCustomerView } = useApp();

  const activeCategory = selectedCategory !== undefined ? selectedCategory : selectedCategoryFilter;

  const handleCategoryClick = (catName: string) => {
    if (onSelectCategory) {
      onSelectCategory(catName);
    } else {
      setSelectedCategoryFilter(catName);
      setCustomerView('shops');
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5" />;
      case 'Apple':
        return <Apple className="w-5 h-5" />;
      case 'Milk':
        return <Milk className="w-5 h-5" />;
      case 'Cookie':
        return <Cookie className="w-5 h-5" />;
      case 'Pill':
        return <Pill className="w-5 h-5" />;
      case 'Fish':
        return <Fish className="w-5 h-5" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5" />;
      case 'Dog':
        return <Dog className="w-5 h-5" />;
      default:
        return <Home className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm sm:text-base">Shop by Category</h3>
        <button
          type="button"
          onClick={() => handleCategoryClick('All')}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
        >
          {activeCategory === 'All' ? 'Showing All' : 'View All Categories'}
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-2 px-2">
        {/* All Category Pill */}
        <button
          type="button"
          onClick={() => handleCategoryClick('All')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border cursor-pointer ${
            activeCategory === 'All'
              ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>All Stores</span>
        </button>

        {categories.map((cat) => {
          const isSelected = activeCategory === cat.name;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className={isSelected ? 'text-emerald-400' : 'text-emerald-600'}>
                {getIcon(cat.iconName)}
              </span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

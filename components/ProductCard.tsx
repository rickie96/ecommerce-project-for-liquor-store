
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = product.stock === 0;

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col ${isOutOfStock ? 'opacity-75' : ''}`}>
      <div className="relative overflow-hidden aspect-[4/3]">
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ${isOutOfStock ? 'grayscale' : ''}`}
        />
        
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-black text-sm uppercase tracking-tighter shadow-xl transform -rotate-12 border-2 border-gray-900">
              Not Available
            </span>
          </div>
        )}

        <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
          <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-black shadow-md border border-gray-100">
            {product.price.toLocaleString()} Tsh
          </span>
          {product.demand > 100 && !isOutOfStock && (
            <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm animate-bounce">
              Hot Need
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <div className="text-[10px] font-black tracking-[0.2em] text-indigo-500 uppercase">
            {product.category}
          </div>
          
          <div className={`flex items-center space-x-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
            isOutOfStock 
            ? 'bg-rose-50 text-rose-600 border-rose-100' 
            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></span>
            <span>{isOutOfStock ? 'Not Available' : 'Available'}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto">
          {!isOutOfStock && (
            <div className="mb-3 text-[10px] text-gray-400 font-medium flex justify-between">
              <span>Remaining stock</span>
              <span className={isLowStock ? 'text-orange-500 font-bold' : ''}>{product.stock} units</span>
            </div>
          )}
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm ${
              isOutOfStock 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
              : 'bg-gray-900 text-white hover:bg-emerald-600 hover:shadow-emerald-200 active:scale-95'
            }`}
          >
            {isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

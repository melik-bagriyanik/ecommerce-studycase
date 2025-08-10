import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Card  from "../ui/Card";

interface Category {
  _id: string;
  name: string;
  description?: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}`, token);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/category`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Categories data:", res.data.data);
        console.log("First category example:", res.data.data[0]);
        setCategories(res.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Handle category click
  const handleCategoryClick = (category: Category) => {
    console.log("Category clicked:", category);
    console.log("Category ID:", category._id);
    console.log("Category name:", category.name);
  };

  // Function to get the correct image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    
    console.log("Original image path:", imagePath);
    
    // If the image path already starts with http, return as is
    if (imagePath.startsWith('http')) {
      console.log("Using absolute URL:", imagePath);
      return imagePath;
    }
    
    // If it's a relative path, try port 3000 first (your backend)
    if (imagePath.startsWith('/')) {
      const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${imagePath}`;
      console.log("Constructed URL:", fullUrl);
      return fullUrl;
    }
    
    // If it doesn't start with /, assume it's a relative path
    const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${imagePath}`;
    console.log("Constructed URL:", fullUrl);
    return fullUrl;
  };

  // Handle image error
  const handleImageError = (categoryId: string) => {
    setImageErrors(prev => ({ ...prev, [categoryId]: true }));
  };

  // Get the appropriate image URL for a category
  const getImageUrlForCategory = (category: Category) => {
    return getImageUrl(category.image);
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <Card key={index} className="h-full text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="h-full text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </Card>
          ))}
        </div>
      ) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              href={`/products?category=${encodeURIComponent(category.name)}`} 
              key={category._id}
              onClick={() => handleCategoryClick(category)}
            >
              <Card
                hoverable
              className="h-full text-center transition-all duration-300 hover:scale-105"
              >
                <div className="w-40 h-40 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center relative">
                  {!imageErrors[category._id] ? (
                    <Image
                      src={getImageUrlForCategory(category)}
                      alt={category.name}
                      fill
                      className="object-cover rounded-lg"
                      onLoad={() => {
                        console.log("Image loaded successfully:", category.name);
                      }}
                      onError={() => {
                        console.error("Image failed to load:", category.name, "URL:", getImageUrlForCategory(category));
                        handleImageError(category._id);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4 text-xs leading-tight">{category.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;

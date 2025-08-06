import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/api/category", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link href={`/products?category=${category._id}`} key={category._id}>
              <Card
                hoverable
              className="h-full text-center transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;

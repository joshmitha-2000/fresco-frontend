import React, { useState } from 'react';

const blogs = [
  {
    id: 1,
    title: "Top 5 Interior Design Trends of 2025",
    description: "Explore the hottest interior decor trends that are transforming modern homes this year.",
    fullText: "In 2025, expect a fusion of organic textures, curved furniture, and earthy palettes. Homeowners are embracing sustainable materials, smart home integration, and artisanal craftsmanship that adds personality to every room.",
    image: "https://plus.unsplash.com/premium_photo-1706140675031-1e0548986ad1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGl2aW5ncm9vbXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 2,
    title: "Sustainable Furniture: What You Need to Know",
    description: "Learn how eco-friendly furniture is reshaping home living and why it matters.",
    fullText: "Sustainable furniture uses reclaimed wood, bamboo, recycled metals, and eco-friendly fabrics. This trend reduces environmental impact and brings a natural, grounded feel to your interiors.",
    image: "https://c4.wallpaperflare.com/wallpaper/535/938/448/design-furniture-interior-living-room-living-room-hd-wallpaper-thumb.jpg",
  },
  {
    id: 3,
    title: "Minimalist Living: Tips & Tricks",
    description: "Discover how to declutter your space and live more intentionally with minimalism.",
    fullText: "Focus on quality over quantity. Keep only items that serve a purpose or spark joy. Use neutral tones, clean lines, and hidden storage to create an open, calming environment.",
    image: "https://i.pinimg.com/736x/80/76/7d/80767dc048eefc4b2ca9e9934123d89a.jpg",
  },
];

export default function Blog() {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-[#f5f5dc] min-h-screen px-6 py-16 text-[#2f271d]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">Our Blog</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-semibold">{blog.title}</h3>
                <p className="text-sm text-gray-700">{blog.description}</p>
                {expanded[blog.id] && (
                  <p className="text-sm text-gray-700">{blog.fullText}</p>
                )}
                <button
                  onClick={() => toggleExpand(blog.id)}
                  className="text-[#d87750] font-semibold hover:underline focus:outline-none"
                >
                  {expanded[blog.id] ? 'Show Less ←' : 'Read More →'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
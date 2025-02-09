import { faker } from "@faker-js/faker";
import { Category } from "../models/category.model.js";  // Ensure correct path
import { Product } from "../models/product.model.js";   // Ensure correct path

// MongoDB Connection (Ensure correct DB URI)

// Function to Generate Dummy Products
const generateProducts = async (num = 20) => {
  // Fetch all existing categories
  const categories = await Category.find({}, "_id");

  if (!categories.length) {
    console.log("❌ No categories found! Please add categories first.");
    process.exit(1);
  }

  let products = [];

  for (let i = 0; i < num; i++) {
    let randomCategory = categories[Math.floor(Math.random() * categories.length)];

    const cost = faker.number.float({ min: 10, max: 200, precision: 0.01 });
    const price = faker.number.float({ min: cost + 10, max: cost * 2, precision: 0.01 });
    const discountPercentage = faker.number.int({ min: 0, max: 30 });
    const discountedPrice = +(price - (price * discountPercentage) / 100).toFixed(2);

    const totalQuantity = faker.number.int({ min: 10, max: 500 });
    const defected = faker.number.int({ min: 0, max: Math.floor(totalQuantity / 10) });
    const stock = totalQuantity - defected;

    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      cost,
      price,
      discountPercentage,
      discountedPrice,
      defected,
      totalQuantity,
      stock,
      images: Array.from({ length: 3 }, () => ({
        url: faker.image.urlLoremFlickr({ category: "tech" }),
        public_id: faker.string.uuid(),
      })),
      category: randomCategory._id,  // Correct category reference
      ratings: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
      reviews: [],
      isDeleted: false,
      isFeatured: faker.datatype.boolean(),
    });
  }

  return await Product.insertMany(products);
};

// Seed Products
export const seedProducts = async () => {
  try {
    console.log("🔄 Seeding products...");
    await generateProducts(50);
    console.log("✅ Products added successfully!");

    
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    
  }
};

// Run the seeding function

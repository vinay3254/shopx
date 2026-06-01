import dotenv from "dotenv";
import mongoose from "mongoose";
import Cart from "./models/Cart.js";
import Category from "./models/Category.js";
import Order from "./models/Order.js";
import Product from "./models/Product.js";
import Review from "./models/Review.js";
import User from "./models/User.js";
import { calculateOrderPrices } from "./utils/pricing.js";

dotenv.config();

const password = "Password123!";

const imageFor = (query, index) =>
  `https://picsum.photos/seed/${encodeURIComponent(`${query}-${index}`)}/900/900`;

const productNames = [
  ["Auralite Noise Cancelling Headphones", "Electronics", "SoundPro", 5499, 7999],
  ["Nova 5G Smartphone 128GB", "Electronics", "NovaTech", 21999, 26999],
  ["PixelSharp 4K Action Camera", "Electronics", "PixelSharp", 12999, 16999],
  ["VoltEdge Fast Charging Power Bank", "Electronics", "VoltEdge", 1999, 2999],
  ["WorkPad Ultra Slim Laptop", "Electronics", "WorkPad", 58999, 74999],
  ["Breeze Cotton Oxford Shirt", "Fashion", "Breeze", 1299, 2199],
  ["TrailFlex Running Shoes", "Fashion", "TrailFlex", 3499, 4999],
  ["UrbanCarry Canvas Backpack", "Fashion", "UrbanCarry", 1899, 2999],
  ["LuxeLine Analog Watch", "Fashion", "LuxeLine", 4499, 6999],
  ["CloudKnit Hoodie", "Fashion", "CloudKnit", 1699, 2599],
  ["CasaCraft Ceramic Dinner Set", "Home", "CasaCraft", 2999, 4499],
  ["PureSleep Memory Foam Pillow", "Home", "PureSleep", 1199, 1999],
  ["GlowNest Table Lamp", "Home", "GlowNest", 1499, 2299],
  ["SteelPro Nonstick Cookware Set", "Home", "SteelPro", 3799, 5999],
  ["AquaFresh Water Purifier", "Home", "AquaFresh", 8999, 11999],
  ["DermaCalm Vitamin C Serum", "Beauty", "DermaCalm", 699, 999],
  ["VelvetMatte Lip Color Kit", "Beauty", "VelvetMatte", 899, 1299],
  ["HerbalMist Shampoo Duo", "Beauty", "HerbalMist", 599, 899],
  ["SkinShield SPF 50 Sunscreen", "Beauty", "SkinShield", 449, 699],
  ["AromaBloom Essential Oil Set", "Beauty", "AromaBloom", 999, 1599],
  ["ActiveCore Yoga Mat", "Sports", "ActiveCore", 999, 1499],
  ["PulseFit Smart Band", "Sports", "PulseFit", 2499, 3999],
  ["HydroRun Stainless Bottle", "Sports", "HydroRun", 699, 999],
  ["StrikePro Badminton Racquet", "Sports", "StrikePro", 1799, 2799],
  ["SummitTrail Trekking Pole Pair", "Sports", "SummitTrail", 2299, 3499],
  ["Deep Work Productivity Guide", "Books", "Northstar Press", 399, 599],
  ["The Modern JavaScript Handbook", "Books", "CodeShelf", 799, 1199],
  ["Home Chef Weeknight Recipes", "Books", "KitchenInk", 499, 799],
  ["Startup Finance Simplified", "Books", "LedgerLeaf", 699, 999],
  ["Mindful Habits Journal", "Books", "Northstar Press", 349, 499]
];

/**
 * Seed users, categories, products and sample orders.
 */
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Promise.all([
      Cart.deleteMany(),
      Review.deleteMany(),
      Order.deleteMany(),
      Product.deleteMany(),
      Category.deleteMany(),
      User.deleteMany()
    ]);

    const users = await User.create([
      { name: "ShopX Admin", email: "admin@shopx.test", password, role: "admin" },
      { name: "Riya Electronics", email: "seller1@shopx.test", password, role: "seller" },
      { name: "Aman Lifestyle", email: "seller2@shopx.test", password, role: "seller" },
      { name: "Vinay Kumar", email: "user1@shopx.test", password, role: "user" },
      { name: "Meera Rao", email: "user2@shopx.test", password, role: "user" },
      { name: "Kabir Sen", email: "user3@shopx.test", password, role: "user" },
      { name: "Neha Iyer", email: "user4@shopx.test", password, role: "user" },
      { name: "Arjun Nair", email: "user5@shopx.test", password, role: "user" }
    ]);

    const sellers = users.filter((user) => user.role === "seller");
    const regularUsers = users.filter((user) => user.role === "user");

    const categoryDocs = {};
    const categoryNames = ["Electronics", "Fashion", "Home", "Beauty", "Sports", "Books"];
    for (const name of categoryNames) {
      categoryDocs[name] = await Category.create({
        name,
        image: imageFor(name, 1515886657613),
        level: 0
      });
    }

    const subcategories = {
      Electronics: ["Mobiles", "Audio", "Computers"],
      Fashion: ["Men", "Women", "Footwear"],
      Home: ["Kitchen", "Decor", "Bedding"],
      Beauty: ["Skincare", "Haircare", "Fragrance"],
      Sports: ["Fitness", "Outdoor", "Racquets"],
      Books: ["Technology", "Business", "Lifestyle"]
    };

    for (const [parent, children] of Object.entries(subcategories)) {
      for (const child of children) {
        await Category.create({
          name: child,
          parent: categoryDocs[parent]._id,
          level: 1,
          image: imageFor(child, 1523275335684)
        });
      }
    }

    const products = await Product.create(
      productNames.map(([name, category, brand, price, mrp], index) => ({
        name,
        description: `${name} brings reliable ShopX quality with practical features, strong warranty support, and fast marketplace delivery.`,
        brand,
        category: categoryDocs[category]._id,
        images: [
          imageFor(name, 1505740420928 + index),
          imageFor(`${name} detail`, 1517336714731 + index)
        ],
        price,
        mrp,
        stock: 15 + (index % 10) * 4,
        sold: 10 + index * 2,
        ratings: Number((3.8 + (index % 7) * 0.17).toFixed(1)),
        numReviews: 4 + (index % 9),
        seller: sellers[index % sellers.length]._id,
        specifications: {
          Warranty: "1 year",
          Origin: "India",
          Returnable: "7 days"
        },
        tags: [category.toLowerCase(), brand.toLowerCase(), "shopx"],
        isFeatured: index % 3 === 0,
        isActive: true
      }))
    );

    const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    for (let index = 0; index < statuses.length; index += 1) {
      const user = regularUsers[index];
      const orderProducts = products.slice(index * 2, index * 2 + 2);
      const items = orderProducts.map((product) => ({
        product: product._id,
        name: product.name,
        image: product.images[0],
        qty: 1 + (index % 2),
        price: product.price,
        seller: product.seller
      }));
      const prices = calculateOrderPrices(items);
      const isPaid = statuses[index] !== "pending" && statuses[index] !== "cancelled";
      await Order.create({
        user: user._id,
        items,
        shippingAddress: {
          fullName: user.name,
          phone: "9999999999",
          line1: "42 Market Street",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560001",
          country: "India"
        },
        paymentMethod: "stripe",
        paymentResult: { stripeId: `pi_seed_${index}`, status: isPaid ? "succeeded" : "requires_payment_method" },
        ...prices,
        isPaid,
        paidAt: isPaid ? new Date() : undefined,
        isDelivered: statuses[index] === "delivered",
        deliveredAt: statuses[index] === "delivered" ? new Date() : undefined,
        orderStatus: statuses[index],
        trackingNumber: statuses[index] === "shipped" ? "TRKSHOPX12345" : ""
      });
    }

    console.log("ShopX seed complete");
    console.table([
      ["admin", "admin@shopx.test", password],
      ["seller", "seller1@shopx.test", password],
      ["seller", "seller2@shopx.test", password],
      ["user", "user1@shopx.test", password]
    ]);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed", error);
    process.exit(1);
  }
};

seed();

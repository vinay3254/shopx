import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, index: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    image: { type: String, default: "" },
    level: { type: Number, default: 0 }
  },
  { timestamps: true }
);

categorySchema.pre("validate", function createSlug(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;

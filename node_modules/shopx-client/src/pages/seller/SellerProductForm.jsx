import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { useGetCategoriesQuery } from "../../store/api/categoriesApi.js";
import { useCreateProductMutation } from "../../store/api/productsApi.js";

const flatten = (categories = []) => categories.flatMap((category) => [category, ...(category.children || [])]);

export default function SellerProductForm() {
  const navigate = useNavigate();
  const { data: categoryData } = useGetCategoriesQuery();
  const categories = flatten(categoryData?.categories);
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      brand: "",
      description: "",
      category: "",
      images: "https://picsum.photos/seed/shopx-new-product/900/900",
      price: "",
      mrp: "",
      stock: 10,
      tags: "shopx,new",
      isFeatured: false
    }
  });

  const submit = async (values) => {
    const body = {
      ...values,
      price: Number(values.price),
      mrp: Number(values.mrp),
      stock: Number(values.stock),
      images: values.images.split(",").map((image) => image.trim()).filter(Boolean),
      tags: values.tags
    };
    await createProduct(body).unwrap();
    toast.success("Product created");
    navigate("/seller/products");
  };

  return (
    <section className="mx-auto max-w-3xl rounded-[2.5rem] bg-white/80 p-6 shadow-soft">
      <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-tealx">Seller</p>
      <h1 className="mt-2 font-display text-5xl font-black">Add product</h1>
      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(submit)}>
        <Input label="Product name" {...register("name", { required: true })} />
        <Input label="Brand" {...register("brand", { required: true })} />
        <Select label="Category" {...register("category", { required: true })}>
          <option value="">Choose category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Input label="Image URLs, comma-separated" {...register("images", { required: true })} />
        <Input label="Price" min="0" type="number" {...register("price", { required: true })} />
        <Input label="MRP" min="0" type="number" {...register("mrp", { required: true })} />
        <Input label="Stock" min="0" type="number" {...register("stock", { required: true })} />
        <Input label="Tags" {...register("tags")} />
        <Textarea className="md:col-span-2" label="Description" {...register("description", { required: true })} />
        <Button className="md:col-span-2" disabled={isLoading} type="submit" variant="secondary">
          Create product
        </Button>
      </form>
    </section>
  );
}

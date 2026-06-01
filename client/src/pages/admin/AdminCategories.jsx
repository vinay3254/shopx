import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery } from "../../store/api/categoriesApi.js";

const flatten = (categories = []) => categories.flatMap((category) => [category, ...(category.children || [])]);

export default function AdminCategories() {
  const { data } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const categories = flatten(data?.categories);
  const { register, handleSubmit, reset } = useForm({ defaultValues: { name: "", parent: "", image: "" } });

  const submit = async (values) => {
    await createCategory({ ...values, parent: values.parent || null }).unwrap();
    reset();
    toast.success("Category created");
  };

  const remove = async (id) => {
    await deleteCategory(id).unwrap();
    toast.success("Category deleted");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <section className="h-fit rounded-[2rem] bg-white/80 p-5 shadow-card">
        <h1 className="font-display text-4xl font-black">Category CRUD</h1>
        <form className="mt-5 space-y-4" onSubmit={handleSubmit(submit)}>
          <Input label="Name" {...register("name", { required: true })} />
          <Input label="Image URL" {...register("image")} />
          <Select label="Parent" {...register("parent")}>
            <option value="">Top-level category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Button className="w-full" type="submit" variant="secondary">
            Add category
          </Button>
        </form>
      </section>
      <section className="space-y-3">
        {categories.map((category) => (
          <article className="flex items-center justify-between rounded-[1.5rem] bg-white/80 p-4 shadow-card" key={category._id}>
            <div>
              <p className="font-bold">{category.name}</p>
              <p className="text-xs font-semibold text-graphite">Level {category.level}</p>
            </div>
            <button className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600" onClick={() => remove(category._id)} type="button">
              Delete
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}

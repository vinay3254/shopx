import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Select } from "../components/ui/Select.jsx";
import { useRegisterMutation } from "../store/api/authApi.js";

export default function Register() {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { name: "", email: "", password: "", role: "user" } });

  const submit = async (values) => {
    await registerUser(values).unwrap();
    toast.success("Account created");
    navigate("/");
  };

  return (
    <section className="mx-auto max-w-md rounded-[2.5rem] bg-white/80 p-8 shadow-soft">
      <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-tealx">Register</p>
      <h1 className="mt-2 font-display text-4xl font-black">Create your ShopX account</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(submit)}>
        <Input error={errors.name?.message} label="Name" {...register("name", { required: "Name is required" })} />
        <Input error={errors.email?.message} label="Email" type="email" {...register("email", { required: "Email is required" })} />
        <Input
          error={errors.password?.message}
          label="Password"
          type="password"
          {...register("password", { required: "Password is required", minLength: { value: 8, message: "Minimum 8 characters" } })}
        />
        <Select label="Account type" {...register("role")}>
          <option value="user">User</option>
          <option value="seller">Seller</option>
        </Select>
        <Button className="w-full" disabled={isLoading} type="submit" variant="secondary">
          Register
        </Button>
      </form>
      <p className="mt-5 text-sm font-bold">
        Already have an account?{" "}
        <Link className="text-clay" to="/login">
          Login
        </Link>
      </p>
    </section>
  );
}

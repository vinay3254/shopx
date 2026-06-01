import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Input.jsx";
import { useLoginMutation } from "../store/api/authApi.js";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { email: "", password: "" } });

  const submit = async (values) => {
    await login(values).unwrap();
    toast.success("Welcome back");
    navigate(location.state?.from?.pathname || "/");
  };

  return (
    <section className="mx-auto max-w-md rounded-[2.5rem] bg-white/80 p-8 shadow-soft">
      <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-tealx">Login</p>
      <h1 className="mt-2 font-display text-4xl font-black">Access your ShopX account</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(submit)}>
        <Input error={errors.email?.message} label="Email" type="email" {...register("email", { required: "Email is required" })} />
        <Input error={errors.password?.message} label="Password" type="password" {...register("password", { required: "Password is required" })} />
        <Button className="w-full" disabled={isLoading} type="submit" variant="secondary">
          Login
        </Button>
      </form>
      <div className="mt-5 flex justify-between text-sm font-bold">
        <Link className="text-clay" to="/register">
          Create account
        </Link>
        <Link className="text-clay" to="/forgot-password">
          Forgot password?
        </Link>
      </div>
    </section>
  );
}

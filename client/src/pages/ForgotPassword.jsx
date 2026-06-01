import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Input.jsx";
import { useForgotPasswordMutation, useResetPasswordMutation } from "../store/api/authApi.js";

export default function ForgotPassword() {
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const { register, handleSubmit, getValues } = useForm({ defaultValues: { email: "", otp: "", password: "" } });
  const [forgotPassword, { isLoading: sending }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  const requestOtp = async () => {
    const data = await forgotPassword({ email: getValues("email") }).unwrap();
    setOtpSent(true);
    setDevOtp(data.devOtp || "");
    toast.success("OTP generated");
  };

  const reset = async (values) => {
    await resetPassword(values).unwrap();
    toast.success("Password reset");
  };

  return (
    <section className="mx-auto max-w-md rounded-[2.5rem] bg-white/80 p-8 shadow-soft">
      <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-tealx">Password help</p>
      <h1 className="mt-2 font-display text-4xl font-black">Reset password</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(reset)}>
        <Input label="Email" type="email" {...register("email", { required: true })} />
        <Button disabled={sending} onClick={requestOtp} type="button" variant="outline">
          Send OTP
        </Button>
        {otpSent ? (
          <>
            {devOtp ? <p className="rounded-2xl bg-linen p-3 text-sm font-bold">Development OTP: {devOtp}</p> : null}
            <Input label="OTP" {...register("otp", { required: true })} />
            <Input label="New password" type="password" {...register("password", { required: true, minLength: 8 })} />
            <Button className="w-full" disabled={resetting} type="submit" variant="secondary">
              Reset password
            </Button>
          </>
        ) : null}
      </form>
    </section>
  );
}

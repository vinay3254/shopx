import { useForm } from "react-hook-form";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";

export const AddressForm = ({ defaultValues, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValues || {
      fullName: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India"
    }
  });

  return (
    <form className="grid gap-4 rounded-[2rem] bg-white/80 p-5 shadow-card md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <Input error={errors.fullName?.message} label="Full name" {...register("fullName", { required: "Full name is required" })} />
      <Input error={errors.phone?.message} label="Phone" {...register("phone", { required: "Phone is required" })} />
      <Input className="md:col-span-2" error={errors.line1?.message} label="Address line 1" {...register("line1", { required: "Address is required" })} />
      <Input className="md:col-span-2" label="Address line 2" {...register("line2")} />
      <Input error={errors.city?.message} label="City" {...register("city", { required: "City is required" })} />
      <Input error={errors.state?.message} label="State" {...register("state", { required: "State is required" })} />
      <Input error={errors.postalCode?.message} label="Postal code" {...register("postalCode", { required: "Postal code is required" })} />
      <Input label="Country" {...register("country")} />
      <Button className="md:col-span-2" type="submit" variant="secondary">
        Continue to payment
      </Button>
    </form>
  );
};

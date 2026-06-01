import { useState } from "react";
import toast from "react-hot-toast";
import { AddressForm } from "../components/checkout/AddressForm.jsx";
import { Breadcrumbs } from "../components/ui/Breadcrumbs.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Input.jsx";
import { useAddAddressMutation, useGetMeQuery, useUpdateMeMutation } from "../store/api/usersApi.js";

export default function AccountPage() {
  const { data } = useGetMeQuery();
  const user = data?.user;
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [updateMe, { isLoading }] = useUpdateMeMutation();
  const [addAddress] = useAddAddressMutation();

  const submitProfile = async (event) => {
    event.preventDefault();
    await updateMe({ name: profile.name || user.name, email: profile.email || user.email }).unwrap();
    toast.success("Profile updated");
  };

  const submitAddress = async (values) => {
    await addAddress(values).unwrap();
    toast.success("Address added");
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: "Account" }]} />
      <h1 className="mb-8 font-display text-5xl font-black">Account settings</h1>
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[2rem] bg-white/80 p-5 shadow-card">
          <h2 className="font-display text-3xl font-bold">Profile</h2>
          <form className="mt-5 space-y-4" onSubmit={submitProfile}>
            <Input label="Name" onChange={(event) => setProfile((value) => ({ ...value, name: event.target.value }))} placeholder={user?.name} />
            <Input label="Email" onChange={(event) => setProfile((value) => ({ ...value, email: event.target.value }))} placeholder={user?.email} type="email" />
            <Button disabled={isLoading} type="submit" variant="secondary">
              Save profile
            </Button>
          </form>
        </section>
        <section>
          <h2 className="mb-4 font-display text-3xl font-bold">Address book</h2>
          <AddressForm onSubmit={submitAddress} />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {user?.addresses?.map((address) => (
              <article className="rounded-[1.5rem] bg-white/80 p-4 shadow-card" key={address._id}>
                <p className="font-bold">{address.fullName}</p>
                <p className="mt-1 text-sm text-graphite">
                  {address.line1}, {address.city}, {address.postalCode}
                </p>
                {address.isDefault ? <span className="mt-3 inline-block rounded-full bg-tealx/10 px-3 py-1 text-xs font-bold text-tealx">Default</span> : null}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

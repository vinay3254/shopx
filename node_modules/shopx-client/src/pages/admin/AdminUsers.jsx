import toast from "react-hot-toast";
import { Select } from "../../components/ui/Select.jsx";
import { useDeleteUserMutation, useGetAdminUsersQuery, useUpdateUserRoleMutation } from "../../store/api/usersApi.js";

export default function AdminUsers() {
  const { data } = useGetAdminUsersQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();
  const users = data?.users || [];

  const updateRole = async (id, role) => {
    await updateUserRole({ id, role }).unwrap();
    toast.success("Role updated");
  };

  const remove = async (id) => {
    await deleteUser(id).unwrap();
    toast.success("User deleted");
  };

  return (
    <div>
      <h1 className="mb-8 font-display text-5xl font-black">User management</h1>
      <div className="overflow-hidden rounded-[2rem] bg-white/80 shadow-card">
        {users.map((user) => (
          <div className="grid gap-4 border-b border-ink/10 p-4 md:grid-cols-[1fr_180px_120px]" key={user._id}>
            <div>
              <p className="font-bold">{user.name}</p>
              <p className="text-sm text-graphite">{user.email}</p>
            </div>
            <Select onChange={(event) => updateRole(user._id, event.target.value)} value={user.role}>
              <option value="user">User</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </Select>
            <button className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600" onClick={() => remove(user._id)} type="button">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

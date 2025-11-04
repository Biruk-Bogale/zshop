"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import BreadCrumbs from "apps/admin-ui/src/shared/components/breadcrumbs";
import axiosInstance from "apps/admin-ui/src/utils/axiosInstance";
import React, { useState } from "react";

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
];

const Page = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("user");

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/api/get-all-admins");

      return res.data.admins || [];
    },
  });

  const { mutate: updateRole, isPending: updating } = useMutation({
    mutationFn: async () => {
      return await axiosInstance.put("/admin/api/add-new-admin", {
        email: search,
        role: selectedRole,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setOpen(false);
      setSearch(""), setSelectedRole("user");
    },
    onError: (err) => {
      console.log("Role update failed", err);
    },
  });

  console.log(data);

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    updateRole();
  };

  return (
    <div className="w-full min-h-screen p-8 bg-black text-white text-sm">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold tracking-wide">Team Management</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Admin
        </button>
      </div>

      <div className="mb-4">
        <BreadCrumbs title="Team Management" />
      </div>

      <div className="overflow-x-auto bg-gray-900 rounded-lg p-4">
        {isLoading ? (
          <p className="text-center text-white">Loading products ... </p>
        ) : (
          <table className="w-full text-white">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-800">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="p-3 text-left">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-800 hover:bg-gray-900 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md relative">
            <button
              className="absolute top-3 right-4 text-slate-400 hover:text-white"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>

            <h3 className="text-lg font-semibold mb-4">Add New Admin</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1 text-slate-300">Email</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="support@becodemy.com"
                  className="w-full px-3 py-2 outline-none bg-slate-800 text-white border border-slate-600 !rounded"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-300">Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 outline-none bg-slate-800 text-white border border-slate-600 !rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <button
                  type="button"
                  onChange={(e) => setOpen(false)}
                  className="w-full px-3 py-2 outline-none bg-slate-800 text-white border border-slate-600 !rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  onChange={(e) => setOpen(false)}
                  className="w-full px-3 py-2 outline-none bg-blue-600 text-white border blue-700 !rounded"
                >
                  {updating ? "Updating" : "Add Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

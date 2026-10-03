"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Users,
  User,
  Mail,
  Phone,
  Shield,
  Building,
  Briefcase
} from "lucide-react";
import { StaffUser, StaffRole } from "@/types/shared";
import { useUnifiedData } from "@/context/unified-data-context";

export function UsersView() {
  const { staffUsers, addStaffUser, updateStaffUser } = useUnifiedData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<StaffRole>("Procurement");
  const [department, setDepartment] = useState("Strategic Sourcing");
  const [title, setTitle] = useState("Sourcing Specialist");

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setPhone("");
    setRole("Procurement");
    setDepartment("Strategic Sourcing");
    setTitle("Sourcing Specialist");
    setShowAddModal(true);
  };

  const handleOpenEdit = (user: StaffUser) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || "");
    setRole(user.role);
    setDepartment(user.department);
    setTitle(user.title);
    setShowAddModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      updateStaffUser(editingUser.id, {
        name,
        email,
        phone,
        role,
        department,
        title,
      });
    } else {
      const newUser: StaffUser = {
        id: `user-staff-${Date.now()}`,
        name,
        email,
        phone,
        role,
        department,
        title,
        status: "Active",
        lastLogin: "Never",
      };
      addStaffUser(newUser);
    }

    setShowAddModal(false);
  };

  const filteredStaff = staffUsers.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.title.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredStaff.length / ITEMS_PER_PAGE));
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            JDMHUB Staff &amp; RBAC Management ({staffUsers.length})
          </h2>
          <p className="text-xs text-slate-500">
            Internal JDMHUB personnel roles within the single unified Admin Portal.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-[#e20c0c] hover:bg-[#D81419] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs shadow-red-500/20 active:scale-[0.98] transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Internal User
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <div className="w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search Staff Name, Email, Department, Role..."
            className="w-full px-3.5 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e20c0c]/20 focus:border-[#e20c0c] transition-all"
          />
        </div>
      </div>

      {/* Staff Table (Section 28) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Sub-header info bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <span className="font-medium">
            Showing <strong className="text-slate-800 font-bold">{filteredStaff.length}</strong> staff member{filteredStaff.length === 1 ? "" : "s"}
          </span>
          <span className="text-[11px] text-slate-400">
            RBAC permissions apply across operations and procurement workflows
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[760px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Staff Member</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Email</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Assigned Role</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Department</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Status</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Last Login</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No staff members matching your search.
                  </td>
                </tr>
              ) : (
                paginatedStaff.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">
                      <div className="flex items-center gap-2.5">
                        {u.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={u.avatarUrl}
                            alt={u.name}
                            className="w-8 h-8 rounded-xl object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">
                            {u.name[0]}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-slate-900 block">{u.name}</span>
                          <span className="text-[10px] text-slate-400">{u.title}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 text-slate-600 text-[11px]">{u.email}</td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 text-slate-600">{u.department}</td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500"
                          }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 text-slate-500 text-[11px]">{u.lastLogin}</td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit User"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateStaffUser(u.id, {
                              status: u.status === "Active" ? "Inactive" : "Active",
                            })
                          }
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          {u.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Responsive Pagination Footer */}
        {filteredStaff.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-4 sm:px-6 py-3.5">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider text-center sm:text-left">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredStaff.length)} of {filteredStaff.length} staff members
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
              >
                Previous
              </button>
              <span className="text-[11px] font-bold text-slate-700 px-2 uppercase tracking-wider">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Add / Edit User */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowAddModal(false)}
          />

          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 relative z-10 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0 border border-rose-100 shadow-inner">
                <Users className="w-6 h-6 text-[#e20c0c]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {editingUser ? "Edit Internal User" : "Add Internal JDMHUB Staff"}
                </h3>
                <p className="text-sm text-slate-500">
                  Assign roles and operational permissions.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Liam Cooper"
                    required
                    className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#e20c0c]/10 focus:border-[#e20c0c] transition-all bg-white placeholder:text-slate-400 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. liam.cooper@JDMHUB.io"
                      required
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#e20c0c]/10 focus:border-[#e20c0c] transition-all bg-white placeholder:text-slate-400 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +64 21 000 0000"
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#e20c0c]/10 focus:border-[#e20c0c] transition-all bg-white placeholder:text-slate-400 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Assigned Role <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Shield className="w-4 h-4 text-slate-400" />
                    </div>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as StaffRole)}
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#e20c0c]/10 focus:border-[#e20c0c] transition-all bg-white shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="Administrator">Administrator</option>
                      <option value="Procurement">Procurement</option>
                      <option value="Operations">Operations</option>
                      <option value="Finance">Finance</option>
                    </select>
                    {/* Custom chevron for select */}
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Building className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Strategic Sourcing"
                      required
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#e20c0c]/10 focus:border-[#e20c0c] transition-all bg-white placeholder:text-slate-400 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Job Title <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sourcing Specialist"
                    required
                    className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#e20c0c]/10 focus:border-[#e20c0c] transition-all bg-white placeholder:text-slate-400 shadow-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#e20c0c] hover:bg-[#D81419] text-white text-xs uppercase font-bold tracking-wider rounded-xl shadow-xs shadow-red-500/20 active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  {editingUser ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

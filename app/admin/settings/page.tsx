"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState, useEffect } from "react";
import {
  LucideUser,
  LucideMail,
  LucideShield,
  LucideCamera,
  LucideSave,
  LucideLogOut,
  LucideLoader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface UserProfile {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    picture?: string;
  };
  created_at?: string;
}

export default function SettingsPage() {
  const supabase = createClient();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Profile form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user as UserProfile);
        setFullName(user.user_metadata?.full_name || "");
        setEmail(user.email || "");
      }
      setLoading(false);
    };
    fetchUser();
  }, [supabase]);

  // Handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
        },
      });

      if (error) throw error;

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      setSaving(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters!",
      });
      setSaving(false);
      return;
    }

    try {
      // Note: Changing password requires re-authentication for security
      // For OAuth users, password change may not be available
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setMessage({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to change password";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  if (loading) {
    return (
      <DashboardLayout config={{ title: "Settings" }}>
        <div className="flex items-center justify-center h-64">
          <LucideLoader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </DashboardLayout>
    );
  }

  const userAvatar =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "";
  const userInitials =
    fullName?.charAt(0).toUpperCase() || email?.charAt(0).toUpperCase() || "U";

  return (
    <DashboardLayout config={{ title: "Settings" }}>
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl border border-purple-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <LucideUser className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Profile</h2>
              <p className="text-sm text-gray-500">
                Manage your account information
              </p>
            </div>
          </div>

          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
            <div className="relative">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={fullName || "User"}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-linear-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {userInitials}
                </div>
              )}
              <button className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors">
                <LucideCamera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {fullName || "User"}
              </h3>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <LucideUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <LucideMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    placeholder="your@email.com"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Email cannot be changed
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-60"
              >
                {saving ? (
                  <LucideLoader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LucideSave className="w-5 h-5" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-2xl border border-purple-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <LucideShield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Security</h2>
              <p className="text-sm text-gray-500">
                Manage your password and security settings
              </p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                placeholder="Enter new password (min 6 characters)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || !newPassword || !confirmPassword}
                className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <LucideLoader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LucideShield className="w-5 h-5" />
                )}
                Change Password
              </button>
            </div>
          </form>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`p-4 rounded-xl border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Sign Out Section */}
        <div className="bg-white rounded-2xl border border-red-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Sign Out</h2>
              <p className="text-sm text-gray-500">
                Sign out of your account on this device
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-all"
            >
              <LucideLogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

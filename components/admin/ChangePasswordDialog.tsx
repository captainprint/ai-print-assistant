"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { changePassword } from "@/lib/account";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ChangePasswordDialog({ open, onClose }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  function reset() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswords(false);
    setError("");
    setSuccess(false);
    setLoading(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-950">Change Password</h3>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="cursor-pointer text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {success ? (
          <>
            <p className="mt-4 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
              Your password has been changed successfully.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {error && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <PasswordField
              id="current-password"
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              show={showPasswords}
              autoComplete="current-password"
            />
            <PasswordField
              id="new-password"
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              show={showPasswords}
              autoComplete="new-password"
            />
            <PasswordField
              id="confirm-new-password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showPasswords}
              autoComplete="new-password"
            />

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
                className="rounded border-gray-300"
              />
              Show passwords
            </label>

            <div className="mt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Saving…" : "Confirm"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  autoComplete,
  id,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  autoComplete: string;
  id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
      />
    </div>
  );
}

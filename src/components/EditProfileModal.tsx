"use client";

import React, { useState } from "react";

type EditableField = "name" | "phone" | "dob" | "location";

interface Props {
  isOpen: boolean;
  field: EditableField | null;
  initialValue: string | undefined;
  onClose: () => void;
  onSave: (value: string) => Promise<void>;
}

const FIELD_LABELS: Record<EditableField, string> = {
  name: "Name",
  phone: "Mobile Number",
  dob: "Date of Birth",
  location: "Location",
};

export default function EditProfileModal({
  isOpen,
  field,
  initialValue,
  onClose,
  onSave,
}: Props) {
  const [value, setValue] = useState(initialValue || "");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !field) return null;

  async function handleSave() {
    setLoading(true);
    await onSave(value);
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold mb-6">
          Edit {FIELD_LABELS[field]}
        </h2>

        <input
          type={field === "dob" ? "date" : "text"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-yellow-400 text-white font-semibold hover:bg-yellow-500 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import type { Address } from "@/types/entities";
import { INDIAN_STATES } from "@/utils/states";

interface AddAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Address) => void;
    initialData?: Partial<Address>;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData = null,
}) => {

    const newAddress: Address = {
        adr_id: crypto.randomUUID(),
        name: "",
        phone: "",
        alt_phone: "",
        address_l1: "",
        address_l2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        default: false,
    }
    const [formData, setFormData] = useState<Address>(newAddress);

    useEffect(() => {
        if (initialData) {
            setFormData((prev) => ({ ...prev, ...initialData }));
        } else {
            setFormData(newAddress);
        }
    }, [initialData]);

    const isEditing = initialData !== null;

    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const target = e.target;

        setFormData((prev) => ({
            ...prev,
            [target.name]:
                target instanceof HTMLInputElement && target.type === "checkbox"
                    ? target.checked
                    : target.value,
        }));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">{isEditing ? "Edit Address" : "Add New Address"}</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                            name="name"
                            value={formData.name ?? ""}
                            onChange={handleChange}
                            placeholder="Full Name"
                            required
                            className="border rounded-lg px-3 py-2 w-full"
                        />
                        <input
                            name="phone"
                            value={formData.phone ?? ""}
                            onChange={handleChange}
                            placeholder="Phone"
                            required
                            className="border rounded-lg px-3 py-2 w-full"
                        />
                        <input
                            name="alt_phone"
                            value={formData.alt_phone ?? ""}
                            onChange={handleChange}
                            placeholder="Alternate Phone (Optional)"
                            className="border rounded-lg px-3 py-2 w-full sm:col-span-2"
                        />
                        <input
                            name="address_l1"
                            value={formData.address_l1 ?? ""}
                            onChange={handleChange}
                            placeholder="Address Line 1"
                            required
                            className="border rounded-lg px-3 py-2 w-full sm:col-span-2"
                        />
                        <input
                            name="address_l2"
                            value={formData.address_l2 ?? ""}
                            onChange={handleChange}
                            placeholder="Address Line 2"
                            className="border rounded-lg px-3 py-2 w-full sm:col-span-2"
                        />
                        <input
                            name="city"
                            value={formData.city ?? ""}
                            onChange={handleChange}
                            placeholder="City"
                            required
                            className="border rounded-lg px-3 py-2 w-full"
                        />
                        <select
                            name="state"
                            value={formData.state ?? ""}
                            onChange={handleChange}
                            required
                            className="border rounded-lg px-3 py-2 w-full bg-white"
                        >
                            <option value="" disabled>
                                Select State
                            </option>
                            {INDIAN_STATES.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>

                        <input
                            name="pincode"
                            value={formData.pincode ?? ""}
                            onChange={handleChange}
                            placeholder="Pincode"
                            inputMode="numeric"
                            pattern="[0-9]{6}"
                            maxLength={6}
                            required
                            className="border rounded-lg px-3 py-2 w-full"
                        />
                        <input
                            name="country"
                            value={"India"}
                            onChange={handleChange}
                            disabled
                            placeholder="Country"
                            className="border rounded-lg px-3 py-2 w-full"
                        />
                    </div>

                    <label className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            name="default"
                            checked={!!formData.default}
                            onChange={handleChange}
                            className="h-4 w-4"
                        />
                        <span>Set as Default Address</span>
                    </label>

                    <div className="flex justify-end gap-3 mt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-yellow-400 text-white rounded-lg font-semibold hover:bg-yellow-500"
                        >
                            {isEditing ? "Save Changes" : "Save Address"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAddressModal;

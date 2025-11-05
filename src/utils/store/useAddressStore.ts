"use client"

import { create } from "zustand";
import type { Address } from "@/types/entities";

interface AddressState {
    addresses: Address[];
    loading: boolean;
    error: string | null;
    message: string | null;
    fetchAddresses: () => Promise<void>;
    addAddress: (address: Omit<Address, "id" | "user_id">) => Promise<void>;
    updateAddress: (id: string, address: Partial<Omit<Address, "id" | "user_id">>) => Promise<void>;
    deleteAddress: (id: string) => Promise<void>;
    setDefaultAddress: (id: string) => Promise<void>;
}

export const useAddressStore = create<AddressState>((set, get) => ({
    addresses: [],
    loading: false,
    error: null,
    message: null,

    fetchAddresses: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch('/api/address', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            if (!response.ok) {
                throw new Error('Failed to fetch addresses');
            }
            const addresses = await response.json();
            set({ addresses, loading: false, message: "Addresses fetched successfully" });

        } catch (error) {
            set({ error: (error as Error).message });
        } finally {
            set({ loading: false });
        }
    },

    addAddress: async (address) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch('/api/address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(address),
            });
            if (!response.ok) {
                throw new Error('Failed to add address');
            }
            const newAddress = await response.json();
            set((state) => ({
                addresses: [...state.addresses, newAddress],
                loading: false,
                message: "Address added successfully"
            }));
        } catch (error) {
            set({ error: (error as Error).message });
        } finally {
            set({ loading: false });
        }

    },
    updateAddress: async (id, address) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`/api/address/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(address),
            });
            if (!response.ok) {
                throw new Error('Failed to update address');
            }
            const updatedAddress = await response.json();
            set((state) => ({
                addresses: state.addresses.map((addr) =>
                    addr.adr_id === id ? updatedAddress : addr
                ),
                loading: false,
                message: "Address updated successfully"
            }));
        } catch (error) {
            set({ error: (error as Error).message });
        } finally {
            set({ loading: false });
        }
    },
    deleteAddress: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`/api/address/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to delete address');
            }
            set((state) => ({
                addresses: state.addresses.filter((addr) => addr.adr_id !== id),
                loading: false,
                message: "Address deleted successfully"
            }));
        } catch (error) {
            set({ error: (error as Error).message });
        } finally {
            set({ loading: false });
        }
    },
    setDefaultAddress: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`/api/address/${id}?setDefault=true`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to set default address');
            }
            const updatedAddress = await response.json();
            set((state) => ({
                addresses: updatedAddress,
                loading: false,
                message: "Default address set successfully"
            }));
        } catch (error) {
            set({ error: (error as Error).message });
        } finally {
            set({ loading: false });
        }
    },

}));

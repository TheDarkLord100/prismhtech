"use client"

import { useEffect, useState } from "react";
import { useCartStore } from "@/utils/store/useCartStore";
import { notify, Notification } from "@/utils/notify";
import { useAddressStore } from "../store/useAddressStore";

export default function CartNotifier() {
    const { error, message, loading } = useCartStore();
    const { error: addressError, message: addressMessage } = useAddressStore();

    useEffect(() => {
        if (error) {
            notify(Notification.FAILURE, error);
            useCartStore.setState({ error: null });
        }
        if (addressError) {
            notify(Notification.FAILURE, addressError);
            useAddressStore.setState({ error: null });
        }
    }, [error, addressError]);

    useEffect(() => {
        if (message) {
            notify(Notification.SUCCESS, message);
            useCartStore.setState({ message: null });
        }
        if (addressMessage) {
            notify(Notification.SUCCESS, addressMessage);
            useAddressStore.setState({ message: null });
        }
    }, [message, addressMessage]);
    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white" />
                </div>
            )}
        </>
    );
}
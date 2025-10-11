"use client"

import { useEffect, useState } from "react";
import { useCartStore } from "./store/useCartStore";
import { notify, Notification } from "./notify";

export default function CartNotifier() {
    const { error, message, loading } = useCartStore();

    useEffect(() => {
        if (error) {
            notify(Notification.FAILURE, error);
            useCartStore.setState({ error: null });
        }
    }, [error]);

    useEffect(() => {
        if (message) {
            notify(Notification.SUCCESS, message);
            useCartStore.setState({ message: null });
        }
    }, [message]);
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
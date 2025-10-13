"use client";

import React from "react";
import type { Address } from "@/types/entities";

interface AddressCardProps {
  address: Address;
  onEdit?: (adr_id: string) => void;
  onRemove?: (adr_id: string) => void;
  onSetDefault?: (adr_id: string) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onRemove,
  onSetDefault,
}) => {
  const {
    adr_id,
    name,
    phone,
    alt_phone,
    address_l1,
    address_l2,
    city,
    state,
    pincode,
    country = "India",
    default: isDefault,
  } = address;

  return (
    <div className="w-80 h-80 border border-gray-400 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
      <div className="px-5 pt-4">
        {isDefault && (
          <>
            <p className="text-sm font-medium text-gray-700 mb-2">Default</p>
            <hr className="border-gray-400 mb-3" />
          </>
        )}
        <p className="font-semibold text-lg leading-snug">{name}</p>
        <p className="text-gray-700 text-sm mt-1 leading-tight">
          {address_l1}
          <br />
          {address_l2 && (
            <>
              {address_l2}
              <br />
            </>
          )}
          {city}, {state} {pincode}
          <br />
          {country}
          <br />
          Phone: {phone}
          {alt_phone && <>, Alt: {alt_phone}</>}
        </p>
      </div>

      <div className="flex gap-4 px-5 pb-4 text-sm">
        <button
          className="text-blue-600 hover:underline"
          onClick={() => onEdit?.(adr_id)}
        >
          Edit
        </button>
        <button
          className="text-blue-600 hover:underline"
          onClick={() => onRemove?.(adr_id)}
        >
          Remove
        </button>
        {!isDefault && (
          <button
            className="text-blue-600 hover:underline"
            onClick={() => onSetDefault?.(adr_id)}
          >
            Set as Default
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
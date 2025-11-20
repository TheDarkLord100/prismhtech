import type { Address } from "@/types/entities";

interface AddressListProps {
    addresses: Address[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onEdit: (address: Address) => void;
    onDelete: (id: string) => void;
}

export default function AddressList({
    addresses,
    selectedId,
    onSelect,
    onEdit,
    onDelete
}: AddressListProps) {
    return (
        <ul className="flex flex-col gap-4">
            {addresses.map((addr) => (
                <li
                    key={addr.adr_id}
                    onClick={() => onSelect(addr.adr_id)}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all
          ${selectedId === addr.adr_id ? "border-green-600 bg-green-50" : "border-green-600"}`}
                >
                    <div className="flex items-start gap-3">
                        <input
                            type="radio"
                            checked={selectedId === addr.adr_id}
                            onChange={() => onSelect(addr.adr_id)}
                            className="mt-1 w-5 h-5 accent-green-600 cursor-pointer"
                        />
                        <div>
                            <h3 className="font-semibold text-lg text-gray-800">{addr.name}</h3>
                            <p className="text-sm text-gray-700 leading-snug">
                                {addr.address_l1}, {addr.address_l2}, {addr.city}, {addr.state} - {addr.pincode}
                            </p>

                            <p className="text-sm text-gray-700 mt-1">
                                Phone: <span className="font-medium">{addr.phone}</span>
                            </p>

                            <div className="flex gap-3 text-blue-600 text-sm mt-2">
                                <button onClick={(e) => { e.stopPropagation(); onEdit(addr); }}>Edit</button>
                                <span>|</span>
                                <button onClick={(e) => { e.stopPropagation(); onDelete(addr.adr_id); }}>Remove</button>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

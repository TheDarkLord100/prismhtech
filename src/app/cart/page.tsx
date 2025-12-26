"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useCartStore } from "@/utils/store/useCartStore";
import { useUserStore } from "@/utils/store/userStore";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import CartItem from "./cartItem";
import StepIndicator from "@/components/StepIndicator";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateCartItem,
    getTotalItems,
    getTotalPrice
  } = useCartStore();

  const { user } = useUserStore();

  const router = useRouter();

  const items = cart?.items || [];
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    if (!user) {

      router.push("/login?redirectedFrom=/cart&reason=auth");
      return;
    }

    router.push("/checkout");
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex flex-1 justify-center py-8 px-4 pt-20 bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50]">
        {
          items.length === 0 ? (
            <div className="w-4/6 max-w-7xl flex-1 flex flex-col gap-6">
              <section className="bg-[#FFFAED] w-full rounded-2xl shadow-md p-6">
                <h2 className="text-4xl mb-3">Your Cart is Empty</h2>

                <hr className="border-t border-gray-300 my-4" />
                <div className="relative w-full mt-6 h-40 sm:h-56 md:h-72 lg:h-80">
                  <Image
                    src="/Assets/empty_cart.png"
                    alt="Empty Cart"
                    fill
                    className="object-contain"
                  />
                </div>
              </section>
            </div>
          ) : (
            <div className="w-5/6 max-w-7xl flex flex-col lg:flex-row gap-6">

              <div className="flex-1 flex flex-col gap-6">
                <section className="bg-[#FFFAED] w-full rounded-2xl shadow-md p-6">
                  <h2 className="text-4xl font-bold mb-3">Your Cart</h2>
                  <StepIndicator currentStep={1} />
                  <hr className="border-t border-gray-300 my-4" />

                  {items.map((item) => (
                    <>
                      <CartItem
                        key={item.id}
                        item={item}
                        updateCartItem={updateCartItem}
                        removeFromCart={removeFromCart}
                      />
                      <hr className="border-t border-gray-300 my-4" />
                    </>

                  ))}

                  <p className="text-lg font-semibold">
                    Total ({totalItems} items) :{" "}
                    <span className="font-bold">₹ {totalPrice.toFixed(1)}</span>
                  </p>
                </section>

                {/* Your Items Section */}
                {/* <section className="bg-[#FFFAED] w-full rounded-2xl shadow-md p-6">
              <h2 className="text-4xl font-bold mb-3">Your Items</h2>

              <div className="flex items-center gap-10 border-b border-gray-300 pb-2">
                <p className="text-lg font-semibold text-green-600 cursor-pointer border-b-2 border-green-600">
                  Select all items ({savedItems.length} items)
                </p>
                <p className="text-lg text-gray-600 cursor-pointer">Buy it again</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {savedItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#FFFAED] border rounded-2xl shadow-md p-4 flex flex-col items-start"
                  >
                    <div className="relative w-full h-52 rounded-xl overflow-hidden">
                      <Image src={item.img} alt={item.name} fill className="object-cover" />
                    </div>

                    <h3 className="mt-3 text-gray-800 font-medium">{item.name}</h3>
                    <p className="text-gray-700 text-base font-semibold">
                      ₹ {item.price} {item.unit}
                    </p>

                    <button
                      className="mt-3 border border-yellow-500 text-yellow-600 px-6 py-1.5 rounded-full text-sm font-medium hover:bg-yellow-50"
                      onClick={() => {
                        // Move to cart
                        moveSavedToCart(item.id);
                      }}
                    >
                      Move to cart
                    </button>

                    <div className="mt-3 text-sm text-blue-600 flex flex-col gap-1">
                      <span className="cursor-pointer" onClick={() => removeSavedItem(item.id)}>
                        Delete
                      </span>
                      <span className="cursor-pointer">See more like this</span>
                    </div>
                  </div>
                ))}
              </div>
            </section> */}
              </div>

              <aside className="bg-[#FFFDEE] w-full lg:w-80 rounded-2xl shadow-md p-6 h-fit top-6">
                <p className="text-lg font-semibold mb-4">
                  Total ({totalItems} items) :{" "}
                  <span className="font-bold text-xl">₹ {totalPrice.toFixed(1)}</span>
                </p>
                <br />

                <button
                  onClick={handleCheckout}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-3 rounded-4xl font-medium text-lg">
                  {user ? "Proceed to Checkout" : "Login to Checkout"}
                </button>
              </aside>
            </div>
          )
        }
      </main>
      <Footer />
    </div>
  );
}

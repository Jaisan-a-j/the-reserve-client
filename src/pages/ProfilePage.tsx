import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getMyOrdersThunk } from "../features/order/orderThunk";
import OrderCard from "../components/profile/OrderCard";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileAddressSection from "../components/profile/ProfileAddressSection";
import { Package } from "lucide-react";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token } = useAppSelector((state) => state.auth);
  const {
    items: orders,
    loading,
    error,
  } = useAppSelector((state) => state.order);

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }

    dispatch(getMyOrdersThunk());
  }, [dispatch, navigate, token]);

  return (
    <main className="min-h-screen bg-[#fbfbfd] px-4 pb-12 pt-24 text-[#111111] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <ProfileHeader user={user} />
        <ProfileAddressSection user={user} />

        <section id="orders" className="mt-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 px-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#633df1]">
                Order history
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                Your Orders
              </h2>
            </div>
            <span className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
              <Package
                className="mx-auto text-gray-400"
                size={38}
                strokeWidth={2.2}
              />
              <p className="mt-3 text-lg font-bold">No orders yet</p>
              <p className="mt-2 text-sm text-gray-500">
                Your completed checkout orders will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;

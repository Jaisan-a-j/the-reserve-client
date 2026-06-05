import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CreditCard,
  Mail,
  Package,
  Phone,
  Truck,
  UserRound,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getMyOrdersThunk } from "../features/order/orderThunk";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));

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
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#f5f2ff] text-[#633df1]">
                <UserRound size={30} strokeWidth={2.4} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#633df1]">
                  My Account
                </p>
                <h1 className="mt-1 truncate text-3xl font-bold tracking-tight">
                  {user?.fullName ?? "Reserve Guest"}
                </h1>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-[#fbfbfd] p-5">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                <UserRound size={17} strokeWidth={2.3} />
                Full name
              </div>
              <p className="mt-2 text-lg font-bold">
                {user?.fullName ?? "Not available"}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-[#fbfbfd] p-5">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                <Mail size={17} strokeWidth={2.3} />
                Email address
              </div>
              <p className="mt-2 break-words text-lg font-bold">
                {user?.email ?? "Not available"}
              </p>
            </div>
          </div>
        </section>

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
              {orders.map((order) => {
                const itemCount = order.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                );
                const shortId = order._id.slice(-6).toUpperCase();

                return (
                  <article
                    key={order._id}
                    className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold">
                            Order #{shortId}
                          </h3>
                          <span className="rounded-full bg-[#f5f2ff] px-3 py-1 text-xs font-bold capitalize text-[#633df1]">
                            {order.status}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays size={16} strokeWidth={2.3} />
                            {formatDate(order.createdAt)}
                          </span>
                          <span className="inline-flex items-center gap-2 capitalize">
                            <Truck size={16} strokeWidth={2.3} />
                            {order.fulfillment}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <CreditCard size={16} strokeWidth={2.3} />
                            {order.paymentMethod === "card"
                              ? "Card"
                              : "Pay at counter"}
                          </span>
                        </div>
                      </div>
                      <div className="text-left lg:text-right">
                        <p className="text-sm font-medium text-gray-500">
                          Total
                        </p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid min-w-0 gap-5 lg:grid-cols-[1fr_280px]">
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={`${order._id}-${item.food}`}
                            className="grid min-w-0 grid-cols-[56px_minmax(0,1fr)] gap-3 rounded-md border border-gray-100 p-3 sm:flex sm:items-center sm:border-0 sm:p-0"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-14 w-14 rounded-md object-cover"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold">
                                {item.title}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                                <p className="text-xs text-gray-500">
                                  Qty {item.quantity} x{" "}
                                  {formatCurrency(item.price)}
                                </p>
                                <span className="text-sm font-bold">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-lg border border-gray-200 bg-[#fbfbfd] p-4">
                        <p className="text-sm font-bold">Checkout details</p>
                        <div className="mt-3 space-y-2 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <Package size={15} strokeWidth={2.3} />
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone size={15} strokeWidth={2.3} />
                            {order.contact.phone}
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail size={15} strokeWidth={2.3} />
                            {order.contact.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;

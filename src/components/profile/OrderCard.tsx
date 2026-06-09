import {
  CalendarDays,
  CreditCard,
  Mail,
  Package,
  Phone,
  Truck,
} from "lucide-react";
import type { UserOrder } from "../../types";
import { formatCurrency } from "../../utils/formatCurrency";

type OrderCardProps = {
  order: UserOrder;
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));

const OrderCard = ({ order }: OrderCardProps) => {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const shortId = order._id.slice(-6).toUpperCase();

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold">Order #{shortId}</h3>
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
              {order.paymentMethod === "card" ? "Card" : "Pay at counter"}
            </span>
          </div>
        </div>
        <div className="text-left lg:text-right">
          <p className="text-sm font-medium text-gray-500">Total</p>
          <p className="text-2xl font-bold">{formatCurrency(order.total)}</p>
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
                <p className="truncate text-sm font-bold">{item.title}</p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-gray-500">
                    Qty {item.quantity} x {formatCurrency(item.price)}
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
};

export default OrderCard;

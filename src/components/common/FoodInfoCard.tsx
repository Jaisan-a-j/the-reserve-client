type Props = {
  title: string;
  children: React.ReactNode;
};

const FoodInfoCard = ({ title, children }: Props) => (
  <div className="rounded-2xl border border-gray-200 bg-[#f8f7ff] p-5">
    <p className="text-sm font-semibold text-gray-500">{title}</p>

    <div className="mt-3">{children}</div>
  </div>
);

export default FoodInfoCard;

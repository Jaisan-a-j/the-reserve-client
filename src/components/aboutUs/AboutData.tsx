import { type LucideIcon } from "lucide-react";

type AboutStatProps = {
  icon: LucideIcon;
  count: string;
  title: string;
};

const AboutData = ({ icon: Icon, count, title }: AboutStatProps) => {
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <Icon className="text-[#7c5dfa]" size={34} />
      </div>

      <h3 className="text-4xl font-bold text-[#7c5dfa] mt-4">{count}</h3>

      <p className="text-gray-500 mt-2 text-lg">{title}</p>
    </div>
  );
};

export default AboutData;

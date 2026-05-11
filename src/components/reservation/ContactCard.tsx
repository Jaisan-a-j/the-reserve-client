import React from "react";
interface ContactCardProps {
  title: string;
  children: React.ReactNode;
}

const ContactCard = ({ title, children }: ContactCardProps) => (
  <div className="border border-gray-200 rounded-2xl p-6 text-center">
    <h4 className="text-xl font-semibold text-[#2b2d42]">{title}</h4>

    <div className="mt-5 text-gray-600 text-base leading-8">{children}</div>
  </div>
);

export default ContactCard;

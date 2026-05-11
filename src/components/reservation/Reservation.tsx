import { MessageCircle } from "lucide-react";
import FormInput from "./FormInput";
import { formFields } from "../../constants/forms";
import ContactCard from "./ContactCard";
import type { FormInputProps } from "../../types";

const Reservation = () => {
  return (
    <section className="w-full px-4 py-14 bg-[#f8f7fb]">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[#2b2d42] leading-tight">
          Get in Touch to Reserve Your Table
        </h2>

        <p className="mt-4 text-gray-600 text-base leading-7">
          Whether you're planning a casual dinner or a special celebration,
          we're here to make your experience seamless.
        </p>
      </div>

      <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-2xl font-bold tracking-tight text-[#2b2d42]">
          Book a Table
        </h3>

        <form className="mt-8 flex flex-col gap-6">
          {formFields.map((field: FormInputProps) => (
            <FormInput key={field.label} {...field} />
          ))}
          <div>
            <label
              htmlFor="message"
              className="block text-sm text-[#2b2d42] mb-2"
            >
              Message
            </label>
            <div className="flex items-start border border-gray-300 rounded-xl px-4 py-4">
              <textarea
                id="message"
                rows={4}
                placeholder="Enter your message"
                className="w-full outline-none text-sm text-gray-700 resize-none placeholder:text-gray-400"
              />
              <MessageCircle className="text-gray-500 mt-1" size={20} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold text-base py-3 rounded-xl shadow-md hover:scale-[1.02] transition-all duration-300"
          >
            Book a Reservation
          </button>
        </form>

        <address className="mt-10 flex flex-col gap-5 not-italic">
          <ContactCard title="Email/Phone">
            <p className="mt-5 text-gray-600 text-base">johndoe@gmail.com</p>
            <p className="mt-2 text-gray-600 text-base">+148 589 2001 2466</p>
          </ContactCard>
          <ContactCard title="Our Location">
            <p className="mt-5 text-gray-600 text-base leading-8">
              Office 149,
              <br />
              450 South Brand Brooklyn
              <br />
              San Diego County,
              <br />
              CA 91905, USA
            </p>
          </ContactCard>
        </address>

        <div className="mt-8 text-center text-base text-[#2b2d42]">
          Opening Hours{" "}
          <span className="text-purple-600 font-semibold">9AM - 11PM</span>{" "}
          Everyday
        </div>
      </div>
    </section>
  );
};

export default Reservation;

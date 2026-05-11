import { User, Phone, CalendarDays, Clock3 } from "lucide-react";
import type { FormInputProps } from "../types";

export const formFields: FormInputProps[] = [
  {
    label: "Your Name",
    type: "text",
    placeholder: "Enter your name...",
    icon: User,
  },
  {
    label: "Phone Number",
    type: "text",
    placeholder: "+1 (212) 555-1234",
    icon: Phone,
  },
  {
    label: "Enter The Date",
    type: "date",
    icon: CalendarDays,
  },
  {
    label: "Enter Time",
    type: "time",
    icon: Clock3,
  },
];

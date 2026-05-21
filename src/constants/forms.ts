import { User, Phone, CalendarDays, Clock3 } from "lucide-react";
import type { FormFieldMeta } from "../types";

export const formFields: FormFieldMeta[] = [
  {
    label: "Your Name",
    type: "text",
    placeholder: "Enter your name...",
    icon: User,
    name: "fullName",
  },
  {
    label: "Phone Number",
    type: "text",
    placeholder: "+1 (212) 555-1234",
    icon: Phone,
    name: "phone",
  },
  {
    label: "Enter The Date",
    type: "date",
    icon: CalendarDays,
    name: "date",
  },
  {
    label: "Enter Time",
    type: "time",
    icon: Clock3,
    name: "time",
  },
];

import { Phone, CalendarDays, Clock3 } from "lucide-react";
import type { FormFieldMeta } from "../types";

export const formFields: FormFieldMeta[] = [
  {
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter 10 digit phone number",
    icon: Phone,
    name: "phone",
    inputMode: "numeric",
    maxLength: 10,
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

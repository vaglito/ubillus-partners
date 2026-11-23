import { cn } from "cn";
import type { ReactNode } from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

export function FormField({
  id,
  label,
  required = false,
  full = false,
  invalid = false,
  description,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  full?: boolean;
  invalid?: boolean;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Field
      className={cn("field", full && "field--full")}
      data-invalid={invalid}
    >
      <FieldLabel htmlFor={id}>
        {label} {required && <b aria-hidden="true">*</b>}
      </FieldLabel>
      {children}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}

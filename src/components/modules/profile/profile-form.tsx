"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useUpdateMyProfile } from "@/hooks";
import type { Gender, UpdateMyProfilePayload, User, UserRole } from "@/types";
import { getErrorMessage } from "@/utils";
import { type MyProfileFormValues, myProfileSchema } from "@/validation";

// সব role এর field একসাথে; role অনুযায়ী কিছু field দেখানো হয়
type ProfileFormValues = MyProfileFormValues;

type TextFieldName = Exclude<keyof ProfileFormValues, "gender">;

const GENDER_ITEMS = [
  { value: "", label: "Prefer not to say" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

// কোন role এ কোন field দেখাবে
const FIELDS_BY_ROLE: Record<UserRole, (keyof ProfileFormValues)[]> = {
  CUSTOMER: ["name", "contactNumber", "gender", "address", "city"],
  TECHNICIAN: [
    "name",
    "contactNumber",
    "gender",
    "address",
    "experienceYears",
    "bio",
  ],
  ADMIN: ["name", "contactNumber", "department"],
};

function getInitialValues(user: User): ProfileFormValues {
  const base: ProfileFormValues = {
    name: user.name,
    contactNumber: "",
    gender: "",
    address: "",
    city: "",
    bio: "",
    experienceYears: "0",
    department: "",
  };

  if (user.role === "CUSTOMER" && user.customer) {
    return {
      ...base,
      contactNumber: user.customer.contactNumber ?? "",
      gender: user.customer.gender ?? "",
      address: user.customer.address ?? "",
      city: user.customer.city ?? "",
    };
  }
  if (user.role === "TECHNICIAN" && user.technician) {
    return {
      ...base,
      contactNumber: user.technician.contactNumber ?? "",
      gender: user.technician.gender ?? "",
      address: user.technician.address ?? "",
      bio: user.technician.bio ?? "",
      experienceYears: String(user.technician.experienceYears ?? 0),
    };
  }
  if (user.role === "ADMIN" && user.admin) {
    return {
      ...base,
      contactNumber: user.admin.contactNumber ?? "",
      department: user.admin.department ?? "",
    };
  }
  return base;
}

// শুধু বদলানো + ফাঁকা নয় এমন field পাঠাই (backend ফাঁকা string reject করে,
// আর অন্তত একটা field না থাকলে 400 দেয়)
function buildPayload(
  role: UserRole,
  initial: ProfileFormValues,
  current: ProfileFormValues,
): UpdateMyProfilePayload {
  const payload: Record<string, string | number> = {};

  for (const key of FIELDS_BY_ROLE[role]) {
    const next = current[key].trim();
    if (next === "" || next === initial[key].trim()) {
      continue;
    }
    payload[key] = key === "experienceYears" ? Number(next) : next;
  }

  return payload as UpdateMyProfilePayload;
}

function ProfileFormInner({
  user,
  initial,
}: {
  user: User;
  initial: ProfileFormValues;
}) {
  const role = user.role;
  const visible = FIELDS_BY_ROLE[role];
  const { mutate: update, isPending } = useUpdateMyProfile();

  const form = useForm({
    defaultValues: initial,
    validators: { onSubmit: myProfileSchema },
    onSubmit: ({ value }) => {
      const payload = buildPayload(role, initial, value);

      if (Object.keys(payload).length === 0) {
        toast.add({ title: "Nothing to update", type: "info" });
        return;
      }

      update(payload, {
        onSuccess: () => {
          toast.add({ title: "Profile updated", type: "success" });
        },
        onError: (err) => {
          toast.add({
            title: "Could not update profile",
            description: getErrorMessage(err),
            type: "error",
          });
        },
      });
    },
  });

  const textField = (
    name: TextFieldName,
    label: string,
    options: {
      placeholder?: string;
      type?: string;
      autoComplete?: string;
      multiline?: boolean;
      hint?: string;
    } = {},
  ) =>
    visible.includes(name) ? (
      <form.Field key={name} name={name}>
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
              {options.multiline ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={4}
                  placeholder={options.placeholder}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  type={options.type}
                  placeholder={options.placeholder}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete={options.autoComplete}
                />
              )}
              {options.hint ? (
                <FieldDescription>{options.hint}</FieldDescription>
              ) : null}
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>
    ) : null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" value={user.email} readOnly disabled />
          <FieldDescription>Email cannot be changed.</FieldDescription>
        </Field>

        {textField("name", "Full name", { autoComplete: "name" })}

        <div className="grid gap-4 sm:grid-cols-2">
          {textField("contactNumber", "Contact number", {
            type: "tel",
            placeholder: "01712345678",
            autoComplete: "tel",
          })}

          {visible.includes("gender") ? (
            <form.Field name="gender">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Gender</FieldLabel>
                  <Select
                    items={GENDER_ITEMS}
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange((value ?? "") as "" | Gender)
                    }
                  >
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      {GENDER_ITEMS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>
          ) : null}

          {textField("department", "Department", {
            placeholder: "e.g. Operations",
          })}
        </div>

        {role === "CUSTOMER" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {textField("address", "Address", {
              placeholder: "House, road, area",
              autoComplete: "street-address",
            })}
            {textField("city", "City", {
              placeholder: "e.g. Dhaka",
              autoComplete: "address-level2",
            })}
          </div>
        ) : null}

        {role === "TECHNICIAN" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {textField("address", "Address", {
                placeholder: "House, road, area, city",
                autoComplete: "street-address",
              })}
              {textField("experienceYears", "Years of experience", {
                type: "number",
              })}
            </div>
            {textField("bio", "Short bio", {
              multiline: true,
              placeholder: "Tell customers about your work",
              hint: "Up to 500 characters",
            })}
          </>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner /> Saving
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

// server data বদলালে (save এর পর refetch) form নতুন value নিয়ে আবার শুরু হয়
export default function ProfileForm({ user }: { user: User }) {
  const initial = getInitialValues(user);
  return (
    <ProfileFormInner
      key={JSON.stringify(initial)}
      user={user}
      initial={initial}
    />
  );
}

import { PlusIcon } from "lucide-react";
import { SITE } from "@/constants";

const FAQS = [
  {
    question: "How do I request a service?",
    answer:
      "Create a free account and verify your email with the code we send you. Then choose New request, describe the problem, add photos if you have them and pick a date.",
  },
  {
    question: "Who will come to my place?",
    answer:
      "Our team reviews your request and assigns a verified technician whose skills match the job. You can follow their progress from your dashboard.",
  },
  {
    question: "How do I pay?",
    answer:
      "You pay after the job is done. Your invoice appears in your account and you can pay it online with bKash.",
  },
  {
    question: "Can I cancel a request?",
    answer: `Yes, while it is still pending or under review. After it has been approved, contact us at ${SITE.email} and we will help.`,
  },
  {
    question: "How do I become a technician?",
    answer:
      "Fill in the technician application with your skills and verify your email. Our team reviews it and emails you the result.",
  },
] as const;

export default function Faq() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="space-y-3">
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Questions, answered
          </h2>
          <p className="max-w-sm text-muted-foreground">
            Still unsure about something? Write to {SITE.email} or call{" "}
            {SITE.phone}. We are available {SITE.hours}.
          </p>
        </div>

        <div className="divide-y border-y">
          {FAQS.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md font-heading text-base font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
                {item.question}
                <PlusIcon
                  className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

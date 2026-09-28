"use client";

import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  TicketCheck,
  TriangleAlert,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

const SUPPORT_EMAIL = "rahul@acquanthr.com";

/*
 * Report an Issue
 * Opens email with a ready-made issue template.
 */
const ISSUE_MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
  "Issue Report",
)}&body=${encodeURIComponent(
  "Page affected:\n\nSteps to reproduce:\n1. \n2. \n\nExpected result:\n\nActual result:\n",
)}`;

const faqs = [
  {
    question: "How do I manage users?",
    answer:
      "Go to the Users section from the sidebar. From there, you can view users, search for specific accounts, review user details, and manage available user actions.",
  },
  {
    question: "How do I generate forms?",
    answer:
      "Open the Forms section from the admin navigation and select the option to create a new form. Enter the required information and save the form to make it available in the system.",
  },
  {
    question: "How can I view analytics?",
    answer:
      "Navigate to Analytics from the sidebar. The analytics dashboard provides an overview of system activity, user information, and other available administrative metrics.",
  },
  {
    question: "How do I update a user's information?",
    answer:
      "Open Users, select the required user, and open their details. Available profile information can be reviewed and updated from the user management screen.",
  },
  {
    question: "What should I do if I find an issue?",
    answer:
      "Use the Report an Issue option below and provide a clear description of the problem. Including the affected page and steps to reproduce the issue helps the support team investigate it faster.",
  },
];

/* Search ke neeche suggestion chips */
const topicChips = ["Users", "Forms", "Analytics"];

/*
 * Quick support cards
 */
const quickActions = [
  {
    key: "knowledge",
    title: "Knowledge Base",
    description: "Browse common questions, guides and helpful information.",
    cta: "Explore help",
    icon: BookOpen,
    iconBox: "bg-[#E8F3EF] text-[#005F4E]",
    titleHover: "group-hover:text-[#005F4E]",
    arrowHover: "group-hover:text-[#005F4E]",
    ctaColor: "text-[#005F4E]",
    href: undefined as string | undefined,
  },
  {
    key: "contact",
    title: "Contact Support",
    description: "Reach our support team for assistance with your account.",
    cta: "Email support",
    icon: MessageCircle,
    iconBox: "bg-[#EAF4FA] text-[#0284C7]",
    titleHover: "group-hover:text-[#0284C7]",
    arrowHover: "group-hover:text-[#0284C7]",
    ctaColor: "text-[#0284C7]",
    href: `mailto:${SUPPORT_EMAIL}?subject=Support%20Request`,
  },
  {
    key: "issue",
    title: "Report an Issue",
    description:
      "Let us know about a technical issue or unexpected behavior.",
    cta: "Report problem",
    icon: TriangleAlert,
    iconBox: "bg-[#FDEDEC] text-[#C2413A]",
    titleHover: "group-hover:text-[#C2413A]",
    arrowHover: "group-hover:text-[#C2413A]",
    ctaColor: "text-[#C2413A]",
    href: ISSUE_MAILTO,
  },
];

const cardClass =
  "group relative flex flex-col overflow-hidden rounded-2xl border border-[#D5E4DF] bg-white p-4 text-left shadow-[0_2px_10px_rgba(0,95,78,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B9D5CC] hover:shadow-[0_8px_22px_rgba(0,95,78,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/40";

const sectionClass =
  "rounded-2xl border border-[#D5E4DF] bg-white shadow-[0_2px_10px_rgba(0,95,78,0.04)]";

/* Contact card ki ek row */
function InfoRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#D5E4DF] bg-[#F8FBFA] p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white text-[#005F4E] shadow-[0_1px_5px_rgba(0,95,78,0.06)]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-[#71817C]">{label}</p>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}

export default function SupportCenterPage() {
  /*
   * FAQ hover ke through open hoga.
   * Initially koi FAQ open nahi hoga.
   */
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();

  const filteredFaqs = faqs.filter((faq) =>
    `${faq.question} ${faq.answer}`.toLowerCase().includes(query),
  );

  const scrollToFaq = () =>
    document.getElementById("faq-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  return (
    <div className="min-h-full bg-[#E8F3EF] px-4 py-4 sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[1500px] space-y-4">
        {/* =========================================================
            HERO
        ========================================================= */}
        <section className="relative overflow-hidden rounded-2xl border border-[#D5E4DF] bg-white px-5 py-6 shadow-[0_3px_15px_rgba(0,95,78,0.05)] sm:px-7">
          {/* Green glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#E8F3EF] blur-3xl"
          />

          <div className="relative max-w-3xl">
            {/* Badge */}
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#D5E4DF] bg-[#E8F3EF] px-2.5 py-1">
              <ShieldCheck
                size={13}
                strokeWidth={2}
                className="text-[#005F4E]"
              />

              <span className="text-xs font-semibold text-[#005F4E]">
                Admin support
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-[#111D1A] sm:text-3xl">
              How can we help?
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#71817C]">
              Find answers, explore helpful resources, or get in touch with the
              AcquantHR support team.
            </p>

            {/* Search */}
            <div className="relative mt-5 max-w-[600px]">
              <Search
                size={17}
                strokeWidth={1.8}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71817C]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for help, questions or topics..."
                aria-label="Search help articles"
                className="h-11 w-full rounded-xl border border-[#D5E4DF] bg-[#F8FBFA] pl-10 pr-10 text-sm text-[#111D1A] outline-none transition placeholder:text-[#9AA8A3] focus:border-[#005F4E] focus:bg-white focus:ring-2 focus:ring-[#005F4E]/15"
              />

              {/* Clear search */}
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[#71817C] transition hover:bg-[#E8F3EF] hover:text-[#005F4E]"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Search suggestions */}
            <div className="mt-3 flex min-h-[28px] flex-wrap items-center gap-2 text-xs">
              {query ? (
                <>
                  <span className="text-[#71817C]">
                    {filteredFaqs.length}{" "}
                    {filteredFaqs.length === 1
                      ? "question"
                      : "questions"}{" "}
                    found
                  </span>

                  {filteredFaqs.length > 0 && (
                    <button
                      type="button"
                      onClick={scrollToFaq}
                      className="inline-flex items-center gap-1 font-semibold text-[#005F4E] hover:underline"
                    >
                      View answers
                      <ChevronDown size={13} />
                    </button>
                  )}
                </>
              ) : (
                <>
                  <span className="text-[#71817C]">Popular:</span>

                  {topicChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setSearch(chip);
                        scrollToFaq();
                      }}
                      className="rounded-full border border-[#D5E4DF] bg-white px-2.5 py-1 font-medium text-[#52645F] transition hover:border-[#005F4E] hover:text-[#005F4E]"
                    >
                      {chip}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================
            QUICK SUPPORT
        ========================================================= */}
        <section>
          <div className="mb-3">
            <h2 className="text-base font-semibold text-[#111D1A]">
              Quick support
            </h2>

            <p className="mt-0.5 text-xs text-[#71817C]">
              Get help quickly using one of the options below.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              const content = (
                <>
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-105 ${action.iconBox}`}
                    >
                      <Icon size={19} strokeWidth={1.8} />
                    </div>

                    <ArrowRight
                      size={17}
                      className={`text-[#A1B0AB] transition group-hover:translate-x-1 ${action.arrowHover}`}
                    />
                  </div>

                  <h3
                    className={`mt-3 text-sm font-semibold text-[#111D1A] transition-colors ${action.titleHover}`}
                  >
                    {action.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#71817C]">
                    {action.description}
                  </p>

                  <span
                    className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 ${action.ctaColor}`}
                  >
                    {action.cta}
                    <ArrowRight size={13} />
                  </span>
                </>
              );

              return action.href ? (
                <a
                  key={action.key}
                  href={action.href}
                  className={cardClass}
                >
                  {content}
                </a>
              ) : (
                <button
                  key={action.key}
                  type="button"
                  onClick={scrollToFaq}
                  className={cardClass}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </section>

        {/* =========================================================
            MAIN SUPPORT GRID
        ========================================================= */}
        <div
          id="faq-section"
          className="grid scroll-mt-4 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]"
        >
          {/* =======================================================
              FAQ
          ======================================================= */}
          <section className={sectionClass}>
            <div className="border-b border-[#D5E4DF] px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F3EF] text-[#005F4E]">
                  <BookOpen size={18} strokeWidth={1.8} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-[#111D1A]">
                    Frequently asked questions
                  </h2>

                  <p className="mt-0.5 text-xs text-[#71817C]">
                    {query
                      ? `${filteredFaqs.length} of ${faqs.length} questions match "${search.trim()}"`
                      : "Quick answers to common admin questions."}
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-[#E8EFEC]">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => {
                  const isOpen = openFaq === faq.question;
                  const panelId = `faq-panel-${index}`;

                  return (
                    <div
                      key={faq.question}
                      onMouseEnter={() => setOpenFaq(faq.question)}
                      onMouseLeave={() => setOpenFaq(null)}
                    >
                      {/* Question */}
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-[#F5FAF8] focus-visible:bg-[#F5FAF8] focus-visible:outline-none sm:px-5 ${
                          isOpen ? "bg-[#F8FBFA]" : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium transition-colors duration-300 ${
                            isOpen
                              ? "text-[#005F4E]"
                              : "text-[#263B37]"
                          }`}
                        >
                          {faq.question}
                        </span>

                        <ChevronDown
                          size={17}
                          strokeWidth={1.8}
                          className={`shrink-0 transition-transform duration-300 ease-out ${
                            isOpen
                              ? "rotate-180 text-[#005F4E]"
                              : "text-[#71817C]"
                          }`}
                        />
                      </button>

                      {/* Answer */}
                      <div
                        id={panelId}
                        role="region"
                        className={`grid transition-all duration-300 ease-out ${
                          isOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-4 pb-4 pr-8 text-[13px] leading-6 text-[#5F706B] sm:px-5 sm:pr-10">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-5 py-10 text-center">
                  <Search
                    size={24}
                    strokeWidth={1.7}
                    className="mx-auto text-[#9AA8A3]"
                  />

                  <p className="mt-2 text-sm font-medium text-[#52645F]">
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-[#71817C]">
                    Try searching with a different keyword.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="mt-4 h-9 rounded-xl border border-[#D5E4DF] px-4 text-xs font-semibold text-[#005F4E] transition hover:border-[#005F4E]"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* =======================================================
              CONTACT SUPPORT
          ======================================================= */}
          <section className={`${sectionClass} self-start`}>
            <div className="border-b border-[#D5E4DF] px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4FA] text-[#0284C7]">
                  <Mail size={18} strokeWidth={1.8} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-[#111D1A]">
                    Contact support
                  </h2>

                  <p className="mt-0.5 text-xs text-[#71817C]">
                    We are here to help.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 p-4">
              {/* Email */}
              <InfoRow
                icon={<Mail size={16} strokeWidth={1.8} />}
                label="Email"
              >
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="block truncate text-sm font-medium text-[#0284C7] hover:underline"
                >
                  {SUPPORT_EMAIL}
                </a>
              </InfoRow>

              {/* Working hours */}
              <InfoRow
                icon={<Clock3 size={16} strokeWidth={1.8} />}
                label="Working hours"
              >
                <p className="text-sm font-medium text-[#263B37]">
                  Monday – Friday
                </p>

                <p className="text-xs text-[#71817C]">
                  9:30 AM – 6:30 PM
                </p>
              </InfoRow>

              {/* Office */}
              <InfoRow
                icon={<MapPin size={16} strokeWidth={1.8} />}
                label="Office"
              >
                <p className="text-xs leading-5 text-[#52645F]">
                  XG3C+42M 170, BBMP PID Number39-226-170, 1st Stage, 3rd
                  Block, Nagarabhavi, Chandra Layout, Bengaluru, Karnataka
                  560040
                </p>
              </InfoRow>

              {/* Note */}
              <div className="flex items-start gap-3 rounded-xl bg-[#E8F3EF] p-3">
                <TicketCheck
                  size={18}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0 text-[#005F4E]"
                />

                <div>
                  <p className="text-sm font-semibold text-[#005F4E]">
                    Need urgent assistance?
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-[#5F706B]">
                    Include screenshots and steps to reproduce the issue when
                    contacting support.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* =========================================================
            BOTTOM HELP BANNER
        ========================================================= */}
        <section className="flex flex-col gap-3 rounded-2xl border border-[#CFE2DB] bg-[#DCEEE8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="text-base font-semibold text-[#111D1A]">
              Still need help?
            </h2>

            <p className="mt-0.5 text-xs text-[#5F706B]">
              Our support team can help you with account and system related
              questions.
            </p>
          </div>

          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#005F4E] px-4 text-sm font-semibold text-white shadow-[0_3px_10px_rgba(0,95,78,0.18)] transition-all hover:bg-[#004F41] hover:shadow-[0_5px_14px_rgba(0,95,78,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/40 focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <Mail size={15} strokeWidth={1.8} />
            Contact Support
          </a>
        </section>
      </div>
    </div>
  );
}
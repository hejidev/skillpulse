import Footer from "@/components/footer";

export default function TermsPage() {
  const sections = [
    {
      number: "01",
      title: "Introduction",
      subtitle: "Understanding these Terms.",
      glow: "from-brand/10",
      badge:
        "bg-brand/10 border-brand/20 text-brand",
      content: [
        "These Terms of Service govern your access to and use of SkillPulse, including all features, dashboards, analytics, and services provided through the platform.",

        "By accessing or using SkillPulse, you agree to comply with these Terms and all applicable laws and regulations.",

        "If you do not agree with any part of these Terms, you should discontinue use of the platform immediately.",
      ],
    },

    {
      number: "02",
      title: "Eligibility",
      subtitle: "Requirements for using SkillPulse.",
      glow: "from-emerald-500/10",
      badge:
        "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      content: [
        "You must be legally permitted to use digital services within your jurisdiction and comply with all applicable laws while using SkillPulse.",

        "By using the platform, you confirm that the information you provide is accurate and that you are responsible for maintaining its accuracy.",

        "SkillPulse reserves the right to restrict access where platform usage conflicts with local laws or regulations.",
      ],
    },

    {
      number: "03",
      title: "Account Responsibilities",
      subtitle: "Protecting your account and credentials.",
      glow: "from-purple-500/10",
      badge:
        "bg-purple-500/10 border-purple-500/20 text-purple-400",
      content: [
        "Users are responsible for maintaining the confidentiality of their account credentials and activities associated with their accounts.",

        "Unauthorized account sharing, impersonation, or fraudulent activity is strictly prohibited.",

        "You are responsible for notifying SkillPulse immediately if you suspect unauthorized access to your account.",
      ],
    },

    {
      number: "04",
      title: "Acceptable Use",
      subtitle: "Responsible and lawful platform usage.",
      glow: "from-indigo-500/10",
      badge:
        "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
      content: [
        "Users must not misuse the platform, exploit vulnerabilities, distribute harmful content, or interfere with the experience of other users.",

        "Automated abuse, spam activity, manipulation of rankings, reverse engineering, or unauthorized access attempts are prohibited.",

        "Violation of acceptable use policies may result in account suspension or permanent removal.",
      ],
    },

    {
      number: "05",
      title: "Intellectual Property",
      subtitle: "Ownership of the platform and branding.",
      glow: "from-pink-500/10",
      badge:
        "bg-pink-500/10 border-pink-500/20 text-pink-400",
      content: [
        "All SkillPulse branding, logos, interface designs, graphics, software systems, and platform assets remain the intellectual property of SkillPulse.",

        "Users may not reproduce, distribute, modify, or commercially exploit any part of the platform without prior written permission.",

        "Unauthorized use of SkillPulse intellectual property may result in legal action.",
      ],
    },

    {
      number: "06",
      title: "User Content",
      subtitle: "Ownership of your personal content.",
      glow: "from-cyan-500/10",
      badge:
        "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
      content: [
        "Users retain ownership of the content and data they create within SkillPulse.",

        "By using the platform, you grant SkillPulse permission to securely store and process your content solely for providing platform functionality and improving user experience.",

        "Users remain responsible for the legality and accuracy of submitted content.",
      ],
    },

    {
      number: "07",
      title: "Subscription & Billing",
      subtitle: "Future premium service terms.",
      glow: "from-yellow-500/10",
      badge:
        "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
      content: [
        "Certain SkillPulse features may become available through premium subscriptions or paid plans in the future.",

        "Pricing, billing conditions, renewal terms, and refund policies will be clearly communicated before any paid services are activated.",

        "SkillPulse reserves the right to modify pricing structures or subscription offerings over time.",
      ],
    },

    {
      number: "08",
      title: "Service Availability",
      subtitle: "Platform uptime and maintenance.",
      glow: "from-orange-500/10",
      badge:
        "bg-orange-500/10 border-orange-500/20 text-orange-400",
      content: [
        "SkillPulse is provided on an 'as available' and 'as is' basis without guarantees of uninterrupted availability.",

        "Temporary downtime may occur due to maintenance, updates, infrastructure issues, or third-party service interruptions.",

        "We continuously work to improve reliability, performance, and security across the platform.",
      ],
    },

    {
      number: "09",
      title: "Limitation of Liability",
      subtitle: "Understanding service limitations.",
      glow: "from-red-500/10",
      badge:
        "bg-red-500/10 border-red-500/20 text-red-400",
      content: [
        "SkillPulse shall not be liable for indirect, incidental, or consequential damages arising from the use or inability to use the platform.",

        "We are not responsible for data loss, interruptions, unauthorized access, or external third-party failures.",

        "By using SkillPulse, you acknowledge and accept these limitations as part of using a modern cloud-based platform.",
      ],
    },

    {
      number: "10",
      title: "Account Suspension",
      subtitle: "Violations and enforcement actions.",
      glow: "from-rose-500/10",
      badge:
        "bg-rose-500/10 border-rose-500/20 text-rose-400",
      content: [
        "SkillPulse reserves the right to suspend, restrict, or permanently terminate accounts that violate these Terms.",

        "Suspension decisions may occur without prior notice where necessary to protect platform security or other users.",

        "Repeated abuse or malicious behavior may result in permanent account removal.",
      ],
    },

    {
      number: "11",
      title: "Changes to Terms",
      subtitle: "Updates to these agreements.",
      glow: "from-sky-500/10",
      badge:
        "bg-sky-500/10 border-sky-500/20 text-sky-400",
      content: [
        "SkillPulse may revise these Terms periodically to reflect legal, operational, or platform improvements.",

        "Updated Terms become effective immediately upon publication unless otherwise stated.",

        "Continued use of SkillPulse after updates constitutes acceptance of the revised Terms.",
      ],
    },

    {
      number: "12",
      title: "Contact Information",
      subtitle: "Support and legal inquiries.",
      glow: "from-teal-500/10",
      badge:
        "bg-teal-500/10 border-teal-500/20 text-teal-400",
      content: [
        "If you have questions regarding these Terms, platform policies, or legal concerns, please contact the SkillPulse support team.",

        "We are committed to maintaining transparency, security, and trust across the platform experience.",

        "Support requests can be submitted through the Contact page.",
      ],
    },
  ];

  return (
    <>
    <section className="relative overflow-hidden py-24 px-6 bg-background text-foreground">

      {/* GRID BACKGROUND */}
      <div
        className="
          absolute inset-0
          bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]
          bg-size-[70px_70px]
          opacity-[0.03]
          pointer-events-none
        "
      />

      {/* GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-175 bg-brand/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">

        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/20 bg-brand/10 text-sm text-brand mb-6">
            Terms & Conditions
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Terms of Service
          </h1>

          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            These Terms govern your access to and use of SkillPulse.
            By using the platform, you agree to follow these rules,
            responsibilities, and guidelines designed to create a secure,
            reliable, and growth-focused experience.
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            Last updated: May 7, 2026
          </p>
        </div>

        {/* CONTENT */}
        <div className="mt-20 grid gap-8">

          {sections.map((section) => (
            <div
              key={section.number}
              className="
                relative overflow-hidden
                rounded-3xl border border-border
                glass-card
                p-8 md:p-10
              "
            >

              {/* CARD GLOW */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${section.glow} via-transparent to-transparent pointer-events-none`}
              />

              <div className="relative">

                {/* HEADER */}
                <div className="flex items-start gap-4 mb-8">

                  <div
                    className={`
                      w-12 h-12 rounded-2xl
                      border
                      flex items-center justify-center
                      text-lg font-bold shrink-0
                      ${section.badge}
                    `}
                  >
                    {section.number}
                  </div>

                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {section.title}
                    </h2>

                    <p className="text-sm text-muted-foreground mt-2">
                      {section.subtitle}
                    </p>
                  </div>

                </div>

                {/* BODY */}
                <div className="space-y-5 text-muted-foreground leading-relaxed">

                  {section.content.map((paragraph, index) => (
                    <p key={index}>
                      {paragraph}
                    </p>
                  ))}

                </div>

              </div>
            </div>
          ))}

        </div>

        {/* FOOTER NOTE */}
        <div
          className="
            mt-16
            rounded-3xl
            border border-border
            glass-card
            p-8 text-center
          "
        >

          <h3 className="text-2xl font-bold mb-4">
            Need Assistance?
          </h3>

          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            If you have any questions regarding these Terms,
            account policies, or platform usage, please contact
            the SkillPulse support team through the Contact page.
          </p>

        </div>

      </div>
    </section>
    <Footer/>
    </>
  );
}
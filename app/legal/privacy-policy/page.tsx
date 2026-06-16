import Footer from "@/components/footer";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "01",
      title: "Information We Collect",
      subtitle: "What data SkillPulse collects and why.",
      color: "from-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      content: [
        "SkillPulse may collect personal information such as your name, email address, profile preferences, learning activity, and usage analytics.",
        "We also collect technical information including browser type, device information, IP address, and interaction data to improve platform performance and reliability.",
        "Information collected helps personalize your experience, improve recommendations, maintain security, and optimize the platform.",
      ],
    },

    {
      id: "02",
      title: "How We Use Information",
      subtitle: "Using data responsibly to improve your experience.",
      color: "from-indigo-500/10",
      border: "border-indigo-500/20",
      text: "text-indigo-400",
      content: [
        "Your information is used to provide learning tools, track progress, personalize analytics, and maintain account functionality.",
        "We may use aggregated platform insights to improve features, platform stability, user experience, and future product development.",
        "SkillPulse does not sell personal user information to advertisers or third parties.",
      ],
    },

    {
      id: "03",
      title: "Data Security",
      subtitle: "Protecting user information and platform integrity.",
      color: "from-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400",
      content: [
        "We implement modern security practices designed to protect user data against unauthorized access, misuse, or disclosure.",
        "While we continuously improve platform security, no digital service can guarantee absolute protection against every threat or vulnerability.",
        "Users are responsible for maintaining secure passwords and protecting access to their own accounts.",
      ],
    },

    {
      id: "04",
      title: "Cookies & Analytics",
      subtitle: "Understanding how the platform improves performance.",
      color: "from-orange-500/10",
      border: "border-orange-500/20",
      text: "text-orange-400",
      content: [
        "SkillPulse may use cookies, session storage, and analytics technologies to improve platform performance and user experience.",
        "These technologies help remember preferences, maintain secure sessions, understand engagement patterns, and improve usability.",
        "Users can manage browser cookie preferences directly within their browser settings.",
      ],
    },

    {
      id: "05",
      title: "Third-Party Services",
      subtitle: "External integrations and infrastructure providers.",
      color: "from-cyan-500/10",
      border: "border-cyan-500/20",
      text: "text-cyan-400",
      content: [
        "SkillPulse may rely on trusted third-party services for authentication, cloud hosting, analytics, payment processing, and infrastructure support.",
        "These providers may process limited information necessary to operate their services securely and efficiently.",
        "We carefully select providers that maintain professional security and compliance standards.",
      ],
    },

    {
      id: "06",
      title: "User Rights & Control",
      subtitle: "Managing your personal information responsibly.",
      color: "from-pink-500/10",
      border: "border-pink-500/20",
      text: "text-pink-400",
      content: [
        "Users may request updates, corrections, or deletion of certain account information where applicable by law.",
        "You maintain ownership of your personal learning content and data uploaded to SkillPulse.",
        "Privacy requests and support inquiries may be submitted through the official Contact page.",
      ],
    },

    {
      id: "07",
      title: "Policy Updates",
      subtitle: "Privacy standards may evolve over time.",
      color: "from-yellow-500/10",
      border: "border-yellow-500/20",
      text: "text-yellow-400",
      content: [
        "SkillPulse may update this Privacy Policy periodically to reflect platform improvements, legal requirements, or operational changes.",
        "Updated versions become effective immediately after publication unless otherwise stated.",
        "Continued use of SkillPulse after updates indicates acceptance of the revised policy.",
      ],
    },
  ];

  return (
    <>
    <section className="relative overflow-hidden py-24 px-6 bg-background text-foreground">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-200 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">

        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto">

          <div className="
            inline-flex items-center gap-2
            px-4 py-2 rounded-full
            border border-primary/20
            bg-primary/10
            text-primary
            text-sm
            mb-6
          ">
            Privacy & Data Protection
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Privacy Policy
          </h1>

          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Your privacy matters to us. This Privacy Policy explains
            how SkillPulse collects, uses, protects, and manages your
            information while delivering a secure and personalized
            learning experience.
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            Last updated: May 7, 2026
          </p>

        </div>

        {/* CONTENT */}
        <div className="mt-20 grid gap-8">

          {sections.map((section) => (
            <div
              key={section.id}
              className="
                relative overflow-hidden
                rounded-[2rem]
                border border-border
                bg-card/40 backdrop-blur-xl
                p-8 md:p-10
              "
            >

              {/* GLOW */}
              <div
                className={`
                  absolute inset-0
                  bg-linear-to-br ${section.color}
                  via-transparent to-transparent
                  pointer-events-none
                `}
              />

              <div className="relative">

                {/* HEADER */}
                <div className="flex items-start gap-4 mb-8">

                  <div
                    className={`
                      w-14 h-14 rounded-2xl
                      border ${section.border}
                      bg-background/40
                      flex items-center justify-center
                      ${section.text}
                      text-lg font-bold shrink-0
                    `}
                  >
                    {section.id}
                  </div>

                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {section.title}
                    </h2>

                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {section.subtitle}
                    </p>
                  </div>

                </div>

                {/* CONTENT */}
                <div className="space-y-5">

                  {section.content.map((paragraph, index) => (
                    <div
                      key={index}
                      className="
                        flex gap-4
                        p-5 rounded-2xl
                        border border-border/60
                        bg-background/30
                      "
                    >

                      <div className="
                        mt-2 w-2 h-2 rounded-full
                        bg-primary shrink-0
                      " />

                      <p className="text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>

                    </div>
                  ))}

                </div>

              </div>
            </div>
          ))}

        </div>

        {/* FOOTER */}
        <div className="
          mt-20 relative overflow-hidden
          rounded-[2rem]
          border border-border
          bg-card/40 backdrop-blur-xl
          p-10 md:p-14
          text-center
        ">

          <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative max-w-3xl mx-auto">

            <div className="
              w-20 h-20 rounded-3xl
              bg-primary/10
              border border-primary/20
              flex items-center justify-center
              text-4xl
              mx-auto mb-8
            ">
              🔒
            </div>

            <h2 className="text-3xl md:text-4xl font-bold">
              Your Data, Your Trust
            </h2>

            <p className="mt-5 text-muted-foreground leading-relaxed text-lg">
              SkillPulse is committed to maintaining transparency,
              protecting user privacy, and building a secure environment
              focused on learning, growth, and trust.
            </p>

            <div className="
              mt-8 inline-flex items-center gap-2
              px-5 py-3 rounded-2xl
              border border-primary/20
              bg-primary/10
              text-primary text-sm
            ">
              Privacy-focused platform experience
            </div>

          </div>
        </div>

      </div>
    </section>
    <Footer />
    </>
  );
}
import type { Metadata } from "next";

import { LegalPage } from "@/components/portal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Your privacy at Be Home"
      description="This placeholder policy explains the information collected through the guest WiFi portal and how it is used."
    >
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What we collect</h2>
        <p>
          To provide guest WiFi access, we collect your email address, any optional first name you choose to
          share, and technical connection details sent by the network such as device identifiers, access point
          details, and redirect information.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Why we collect it</h2>
        <p>
          We use this information to authenticate your guest session, operate the WiFi service securely, and
          understand usage in a limited operational context. If you opt in separately, we may also use your
          email to send occasional updates about classes, events, offers, or space hire opportunities.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Your choices</h2>
        <p>
          Marketing consent is optional and is never pre-selected. Agreement to the privacy policy and WiFi
          terms of use is required to access the guest network.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Next step</h2>
        <p>
          Replace this page with your final legal copy before going live so it reflects your operational and
          compliance requirements.
        </p>
      </section>
    </LegalPage>
  );
}

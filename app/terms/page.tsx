import type { Metadata } from "next";

import { LegalPage } from "@/components/portal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Use",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Guest WiFi terms of use"
      description="These placeholder terms outline acceptable use of the Be Home Cascais guest network."
    >
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Intended use</h2>
        <p>
          This guest WiFi service is provided for visitors, practitioners, class attendees, event guests, and
          community members using the Be Home space.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Respectful access</h2>
        <p>
          You agree not to misuse the network, attempt unauthorized access, interfere with other users, or
          engage in unlawful or harmful activity.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Availability</h2>
        <p>
          We aim to provide a reliable connection, but guest access may vary depending on technical conditions
          or operational needs.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Next step</h2>
        <p>
          Replace this page with your final approved terms before deployment so it matches your local policies
          and operating requirements.
        </p>
      </section>
    </LegalPage>
  );
}

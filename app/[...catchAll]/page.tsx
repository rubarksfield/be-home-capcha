import { redirect } from "next/navigation";

import { toSearchParamsString } from "@/lib/portal/query";

export const dynamic = "force-dynamic";

type CatchAllPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatchAllPage({ searchParams }: CatchAllPageProps) {
  const resolvedSearchParams = await searchParams;
  redirect(`/portal${toSearchParamsString(resolvedSearchParams)}`);
}

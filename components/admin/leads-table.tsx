import { AuthorizationStatus, type Lead } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";

function statusVariant(status: AuthorizationStatus) {
  switch (status) {
    case "AUTHORIZED":
    case "MOCK_AUTHORIZED":
      return "success" as const;
    case "FAILED":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

export function LeadsTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Submitted</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Consents</TableHead>
              <TableHead>SSID</TableHead>
              <TableHead>Client IP</TableHead>
              <TableHead>Client MAC</TableHead>
              <TableHead>AP MAC</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Redirect</TableHead>
              <TableHead>Authorization</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{formatDateTime(lead.createdAt)}</TableCell>
                <TableCell className="font-medium">{lead.email}</TableCell>
                <TableCell>{lead.firstName ?? "—"}</TableCell>
                <TableCell>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Terms: {lead.termsAccepted ? "Yes" : "No"}</p>
                    <p>Privacy: {lead.privacyAccepted ? "Yes" : "No"}</p>
                    <p>Marketing: {lead.marketingConsent ? "Yes" : "No"}</p>
                  </div>
                </TableCell>
                <TableCell>{lead.ssid ?? "—"}</TableCell>
                <TableCell>{lead.clientIp ?? "—"}</TableCell>
                <TableCell>{lead.clientMac ?? "—"}</TableCell>
                <TableCell>{lead.apMac ?? "—"}</TableCell>
                <TableCell>{lead.site ?? "—"}</TableCell>
                <TableCell className="max-w-[220px] truncate">{lead.redirect ?? "—"}</TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Badge variant={statusVariant(lead.authorizationStatus)}>{lead.authorizationStatus}</Badge>
                    <p className="max-w-[220px] text-xs leading-5 text-muted-foreground">
                      {lead.authorizationResponse
                        ? JSON.stringify(lead.authorizationResponse).slice(0, 140)
                        : "No response payload"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

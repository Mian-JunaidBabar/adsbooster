import { readLeads } from "../../lib/lead-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const leads = await readLeads();

  return (
    <main style={{ padding: "32px 24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 24, fontSize: 32 }}>Lead dashboard</h1>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f3f4f6" }}>
              <tr>
                <th style={{ textAlign: "left", padding: 12 }}>Name</th>
                <th style={{ textAlign: "left", padding: 12 }}>Business</th>
                <th style={{ textAlign: "left", padding: 12 }}>City</th>
                <th style={{ textAlign: "left", padding: 12 }}>Phone</th>
                <th style={{ textAlign: "left", padding: 12 }}>Budget</th>
                <th style={{ textAlign: "left", padding: 12 }}>Received</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 20, color: "#6b7280" }}>
                    No leads yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <td style={{ padding: 12 }}>{lead.name}</td>
                    <td style={{ padding: 12 }}>{lead.businessType}</td>
                    <td style={{ padding: 12 }}>{lead.city}</td>
                    <td style={{ padding: 12 }}>{lead.phone}</td>
                    <td style={{ padding: 12 }}>{lead.budget}</td>
                    <td style={{ padding: 12 }}>
                      {new Date(lead.createdAt).toLocaleString("en-PK")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

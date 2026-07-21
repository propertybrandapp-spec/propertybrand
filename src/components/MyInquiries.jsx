import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { supabase, safeQuery } from "../lib/supabaseClient";

const STAGE_STYLES = {
  New: { color: "#2C9DD5", bg: "#EAF4FB" },
  Contacted: { color: "#E87C02", bg: "#FDF1E5" },
  "Site Visit": { color: "#a78bfa", bg: "#F0EAFB" },
  Negotiation: { color: "#E87C02", bg: "#FDF1E5" },
  "Closed Won": { color: "#16a34a", bg: "#EAF8EC" },
  "Closed Lost": { color: "#BA0D0B", bg: "#FCEAEA" },
};

export default function MyInquiries({ onNavigate }) {
  const { session, profile } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) fetchInquiries();
    else setLoading(false);
  }, [session]);

  async function fetchInquiries() {
    setLoading(true);
    // Leads are matched by email/phone since the public inquiry form (Footer
    // quick-inquiry, "Contact Agent" buttons) doesn't require login to submit —
    // we link them to the account post-hoc by matching contact details.
    const { data } = await safeQuery(
      supabase
        .from("leads")
        .select("*")
        .or(`email.eq.${session.user.email}${profile?.phone ? `,phone.eq.${profile.phone}` : ""}`)
        .order("created_at", { ascending: false })
    );
    setInquiries(data || []);
    setLoading(false);
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-lg font-bold mb-2" style={{ color: "#15191C" }}>You're not logged in</p>
        <p className="text-sm mb-5" style={{ color: "#495057" }}>Log in to track your property inquiries.</p>
        <button
          onClick={() => onNavigate && onNavigate("home")}
          className="px-6 py-2.5 rounded-xl text-sm font-bold"
          style={{ background: "#BA0D0B", color: "#FFFFFF" }}
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#FFFFFF" }} className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ color: "#15191C" }}>My Inquiries</h1>
          <div className="w-10 h-0.5 rounded-full mt-2" style={{ background: "#2C9DD5" }} />
          <p className="text-sm mt-3" style={{ color: "#495057" }}>
            {loading ? "Loading..." : `${inquiries.length} inquir${inquiries.length === 1 ? "y" : "ies"} submitted`}
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl h-24 animate-pulse" style={{ background: "#F2F4F6" }} />
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl" style={{ background: "#F7F8FA", border: "1px solid #E5E8EB" }}>
            <span className="text-5xl mb-4">📋</span>
            <p className="text-base font-bold mb-1" style={{ color: "#15191C" }}>No inquiries yet</p>
            <p className="text-sm mb-5" style={{ color: "#495057" }}>Submit an inquiry from any listing or the contact form to see it here.</p>
            <button
              onClick={() => onNavigate && onNavigate("contact")}
              className="px-6 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: "#BA0D0B", color: "#FFFFFF" }}
            >
              Contact Us
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {inquiries.map((lead) => {
              const stage = STAGE_STYLES[lead.stage] || STAGE_STYLES.New;
              return (
                <div key={lead.id} className="rounded-2xl p-5" style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-sm font-bold" style={{ color: "#15191C" }}>{lead.interest || "General Inquiry"}</p>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0" style={{ background: stage.bg, color: stage.color }}>
                      {lead.stage}
                    </span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: "#495057" }}>
                    Budget: <span className="font-semibold" style={{ color: "#15191C" }}>{lead.budget_label || "Not specified"}</span>
                  </p>
                  <p className="text-xs" style={{ color: "#495057" }}>
                    Submitted on {new Date(lead.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

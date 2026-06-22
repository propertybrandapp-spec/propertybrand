import { useState } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────

const PERKS = [
  { icon: "💰", title: "Competitive Pay", desc: "Industry-leading salaries plus performance bonuses and commission structures." },
  { icon: "📈", title: "Growth Path", desc: "Clear career progression with mentorship and leadership development programs." },
  { icon: "🏖️", title: "Work-Life Balance", desc: "Flexible hours, generous leave policy, and hybrid work options for most roles." },
  { icon: "🎓", title: "Learning Budget", desc: "Annual budget for courses, certifications, and conferences relevant to your role." },
  { icon: "🏥", title: "Health Coverage", desc: "Comprehensive medical insurance for you and your immediate family." },
  { icon: "🎉", title: "Team Culture", desc: "Regular team outings, annual retreats, and a genuinely collaborative environment." },
];

const DEPARTMENTS = ["All Departments", "Sales", "Technology", "Marketing", "Operations", "Customer Success"];

const OPENINGS = [
  { id: 1, title: "Senior Sales Manager", dept: "Sales", location: "Ranchi", type: "Full-time", exp: "5+ years" },
  { id: 2, title: "Frontend Engineer (React)", dept: "Technology", location: "Remote", type: "Full-time", exp: "2-4 years" },
  { id: 3, title: "Digital Marketing Specialist", dept: "Marketing", location: "Bangalore", type: "Full-time", exp: "2+ years" },
  { id: 4, title: "Investment Advisory Analyst", dept: "Sales", location: "Delhi", type: "Full-time", exp: "3+ years" },
  { id: 5, title: "Customer Success Associate", dept: "Customer Success", location: "Ranchi", type: "Full-time", exp: "0-2 years" },
  { id: 6, title: "Backend Engineer (Node.js)", dept: "Technology", location: "Remote", type: "Full-time", exp: "3+ years" },
  { id: 7, title: "Operations Manager", dept: "Operations", location: "Ranchi", type: "Full-time", exp: "4+ years" },
  { id: 8, title: "Content Writer (Real Estate)", dept: "Marketing", location: "Remote", type: "Part-time", exp: "1+ years" },
];

// ── Main Export ───────────────────────────────────────────────────────────────
export default function Careers({ onNavigate }) {
  const [activeDept, setActiveDept] = useState("All Departments");
  const [appliedJob, setAppliedJob] = useState(null);

  const filtered = activeDept === "All Departments" ? OPENINGS : OPENINGS.filter((o) => o.dept === activeDept);

  return (
    <div style={{ background: "#FFFFFF" }}>

      {/* ── Hero ── */}
      <section className="px-4 py-16 lg:py-20 text-center" style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #FDF1E5 100%)" }}>
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
          style={{ background: "#FFFFFF", color: "#E87C02", border: "1px solid #E87C02" }}
        >
          We're Hiring
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5" style={{ color: "#15191C" }}>
          Build the Future of<br />Real Estate With Us
        </h1>
        <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "#495057" }}>
          Join a team that's redefining how India buys, sells, and invests in property — through technology, trust, and relentless customer focus.
        </p>
      </section>

      {/* ── Perks ── */}
      <section className="px-4 py-14">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-extrabold" style={{ color: "#15191C" }}>Why Work With Us</h2>
            <div className="w-10 h-0.5 rounded-full mt-2 mx-auto" style={{ background: "#2C9DD5" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERKS.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1"
                style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}
              >
                <span className="text-3xl block mb-3">{p.icon}</span>
                <h3 className="text-base font-bold mb-2" style={{ color: "#15191C" }}>{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#495057" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Positions ── */}
      <section className="px-4 py-14" style={{ background: "#F7F8FA" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-extrabold" style={{ color: "#15191C" }}>Open Positions</h2>
              <div className="w-10 h-0.5 rounded-full mt-2" style={{ background: "#2C9DD5" }} />
            </div>
            <p className="text-sm" style={{ color: "#495057" }}>
              <span className="font-bold" style={{ color: "#15191C" }}>{filtered.length}</span> open roles
            </p>
          </div>

          {/* Department filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-6" style={{ scrollbarWidth: "none" }}>
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className="shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: activeDept === dept ? "#2C9DD5" : "#FFFFFF",
                  color: activeDept === dept ? "#FFFFFF" : "#495057",
                  border: `1px solid ${activeDept === dept ? "#2C9DD5" : "#E5E8EB"}`,
                }}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Job list */}
          <div className="space-y-3">
            {filtered.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-shadow hover:shadow-lg"
                style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-base font-bold" style={{ color: "#15191C" }}>{job.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#EAF4FB", color: "#2C9DD5" }}>
                      {job.dept}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: "#495057" }}>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {job.location}
                    </span>
                    <span>·</span>
                    <span>{job.type}</span>
                    <span>·</span>
                    <span>{job.exp}</span>
                  </div>
                </div>
                <button
                  onClick={() => setAppliedJob(job.id)}
                  disabled={appliedJob === job.id}
                  className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: appliedJob === job.id ? "#EAF8EC" : "#BA0D0B",
                    color: appliedJob === job.id ? "#16a34a" : "#FFFFFF",
                  }}
                >
                  {appliedJob === job.id ? "✓ Applied" : "Apply Now"}
                </button>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-14" style={{ color: "#495057" }}>
              No openings in this department right now. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 py-14 text-center">
        <p className="text-base mb-2" style={{ color: "#15191C" }}>Don't see a role that fits?</p>
        <p className="text-sm mb-6" style={{ color: "#495057" }}>We're always looking for great talent. Send us your resume anyway.</p>
        <button
          onClick={() => onNavigate && onNavigate("contact")}
          className="px-7 py-3 rounded-xl text-sm font-bold transition-all"
          style={{ background: "#FFFFFF", color: "#2C9DD5", border: "1.5px solid #2C9DD5" }}
        >
          Send Your Resume
        </button>
      </section>

    </div>
  );
}

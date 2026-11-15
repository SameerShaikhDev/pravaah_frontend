import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react";
import Logo from "../common/Logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      ["/features", "Features"],
      ["/about", "About"],
      ["/leaderboard", "Leaderboard"],
    ],
  },
  {
    title: "Account",
    links: [
      ["/login", "Log in"],
      ["/register", "Create account"],
    ],
  },
];
const SOCIALS = [
  { label: "Github", icon: Github },
  { label: "LinkedIn", icon: Linkedin },
  { label: "Twitter", icon: Twitter },
];

export default function Footer() {
  return (
    <footer className="border-t border-line/70 bg-surface/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <Logo size={30} className="mb-4" />
          <p className="text-sm text-ink-3 max-w-xs leading-relaxed">
            Practice interviews that talk back. Built for students who want feedback before the real thing.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-ink mb-4">{col.title}</h4>
            <ul className="space-y-2.5 text-sm text-ink-3">
              {col.links.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-ink transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line/70">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4 text-xs text-ink-4">
          <span>&copy; {new Date().getFullYear()} Pravaah. Built for the campus, not for the boardroom.</span>
          <div className="flex gap-2">
            {SOCIALS.map(({ label, icon: Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="p-2 rounded-lg text-ink-3 hover:text-ink hover:bg-ink/5 transition-colors"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

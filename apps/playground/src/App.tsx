import { useRegium } from "@regium/react";
import { useMemo, useState } from "react";
import { ComplianceForm } from "./views/ComplianceForm";
import { CountryOverview } from "./views/CountryOverview";
import { PayrollSimulator } from "./views/PayrollSimulator";
import { ValidatorPlayground } from "./views/ValidatorPlayground";

type Tab = "overview" | "validators" | "form" | "payroll";

const FLAGS: Record<string, string> = {
  AF: "🇦🇫",
  AL: "🇦🇱",
  DZ: "🇩🇿",
  AD: "🇦🇩",
  AO: "🇦🇴",
  AG: "🇦🇬",
  AR: "🇦🇷",
  AM: "🇦🇲",
  AU: "🇦🇺",
  AT: "🇦🇹",
  AZ: "🇦🇿",
  BS: "🇧🇸",
  BH: "🇧🇭",
  BD: "🇧🇩",
  BB: "🇧🇧",
  BY: "🇧🇾",
  BE: "🇧🇪",
  BZ: "🇧🇿",
  BJ: "🇧🇯",
  BT: "🇧🇹",
  BO: "🇧🇴",
  BA: "🇧🇦",
  BW: "🇧🇼",
  BR: "🇧🇷",
  BN: "🇧🇳",
  BG: "🇧🇬",
  BF: "🇧🇫",
  BI: "🇧🇮",
  CV: "🇨🇻",
  KH: "🇰🇭",
  CM: "🇨🇲",
  CA: "🇨🇦",
  CF: "🇨🇫",
  TD: "🇹🇩",
  CL: "🇨🇱",
  CN: "🇨🇳",
  CO: "🇨🇴",
  KM: "🇰🇲",
  CG: "🇨🇬",
  CD: "🇨🇩",
  CR: "🇨🇷",
  CI: "🇨🇮",
  HR: "🇭🇷",
  CU: "🇨🇺",
  CY: "🇨🇾",
  CZ: "🇨🇿",
  DK: "🇩🇰",
  DJ: "🇩🇯",
  DM: "🇩🇲",
  DO: "🇩🇴",
  EC: "🇪🇨",
  EG: "🇪🇬",
  SV: "🇸🇻",
  GQ: "🇬🇶",
  ER: "🇪🇷",
  EE: "🇪🇪",
  SZ: "🇸🇿",
  ET: "🇪🇹",
  FJ: "🇫🇯",
  FI: "🇫🇮",
  FR: "🇫🇷",
  GA: "🇬🇦",
  GM: "🇬🇲",
  GE: "🇬🇪",
  DE: "🇩🇪",
  GH: "🇬🇭",
  GR: "🇬🇷",
  GD: "🇬🇩",
  GT: "🇬🇹",
  GN: "🇬🇳",
  GW: "🇬🇼",
  GY: "🇬🇾",
  HT: "🇭🇹",
  HN: "🇭🇳",
  HU: "🇭🇺",
  IS: "🇮🇸",
  IN: "🇮🇳",
  ID: "🇮🇩",
  IR: "🇮🇷",
  IQ: "🇮🇶",
  IE: "🇮🇪",
  IL: "🇮🇱",
  IT: "🇮🇹",
  JM: "🇯🇲",
  JP: "🇯🇵",
  JO: "🇯🇴",
  KZ: "🇰🇿",
  KE: "🇰🇪",
  KI: "🇰🇮",
  XK: "🇽🇰",
  KW: "🇰🇼",
  KG: "🇰🇬",
  LA: "🇱🇦",
  LV: "🇱🇻",
  LB: "🇱🇧",
  LS: "🇱🇸",
  LR: "🇱🇷",
  LY: "🇱🇾",
  LI: "🇱🇮",
  LT: "🇱🇹",
  LU: "🇱🇺",
  MG: "🇲🇬",
  MW: "🇲🇼",
  MY: "🇲🇾",
  MV: "🇲🇻",
  ML: "🇲🇱",
  MT: "🇲🇹",
  MH: "🇲🇭",
  MR: "🇲🇷",
  MU: "🇲🇺",
  MX: "🇲🇽",
  FM: "🇫🇲",
  MD: "🇲🇩",
  MC: "🇲🇨",
  MN: "🇲🇳",
  ME: "🇲🇪",
  MA: "🇲🇦",
  MZ: "🇲🇿",
  MM: "🇲🇲",
  NA: "🇳🇦",
  NR: "🇳🇷",
  NP: "🇳🇵",
  NL: "🇳🇱",
  NZ: "🇳🇿",
  NI: "🇳🇮",
  NE: "🇳🇪",
  NG: "🇳🇬",
  KP: "🇰🇵",
  MK: "🇲🇰",
  NO: "🇳🇴",
  OM: "🇴🇲",
  PK: "🇵🇰",
  PW: "🇵🇼",
  PS: "🇵🇸",
  PA: "🇵🇦",
  PG: "🇵🇬",
  PY: "🇵🇾",
  PE: "🇵🇪",
  PH: "🇵🇭",
  PL: "🇵🇱",
  PT: "🇵🇹",
  QA: "🇶🇦",
  RO: "🇷🇴",
  RU: "🇷🇺",
  RW: "🇷🇼",
  KN: "🇰🇳",
  LC: "🇱🇨",
  VC: "🇻🇨",
  WS: "🇼🇸",
  SM: "🇸🇲",
  ST: "🇸🇹",
  SA: "🇸🇦",
  SN: "🇸🇳",
  RS: "🇷🇸",
  SC: "🇸🇨",
  SL: "🇸🇱",
  SG: "🇸🇬",
  SK: "🇸🇰",
  SI: "🇸🇮",
  SB: "🇸🇧",
  SO: "🇸🇴",
  ZA: "🇿🇦",
  KR: "🇰🇷",
  SS: "🇸🇸",
  ES: "🇪🇸",
  LK: "🇱🇰",
  SD: "🇸🇩",
  SR: "🇸🇷",
  SE: "🇸🇪",
  CH: "🇨🇭",
  SY: "🇸🇾",
  TW: "🇹🇼",
  TJ: "🇹🇯",
  TZ: "🇹🇿",
  TH: "🇹🇭",
  TL: "🇹🇱",
  TG: "🇹🇬",
  TO: "🇹🇴",
  TT: "🇹🇹",
  TN: "🇹🇳",
  TR: "🇹🇷",
  TM: "🇹🇲",
  TV: "🇹🇻",
  UG: "🇺🇬",
  UA: "🇺🇦",
  AE: "🇦🇪",
  GB: "🇬🇧",
  US: "🇺🇸",
  UY: "🇺🇾",
  UZ: "🇺🇿",
  VU: "🇻🇺",
  VA: "🇻🇦",
  VE: "🇻🇪",
  VN: "🇻🇳",
  YE: "🇾🇪",
  ZM: "🇿🇲",
  ZW: "🇿🇼",
  HK: "🇭🇰",
  MO: "🇲🇴",
  PR: "🇵🇷",
  GU: "🇬🇺",
  JE: "🇯🇪",
  GG: "🇬🇬",
  IM: "🇮🇲",
  KY: "🇰🇾",
  BM: "🇧🇲",
  VG: "🇻🇬",
  CW: "🇨🇼",
  AW: "🇦🇼",
  GL: "🇬🇱",
  FO: "🇫🇴",
  GI: "🇬🇮",
  RE: "🇷🇪",
  PF: "🇵🇫",
  NC: "🇳🇨",
  MQ: "🇲🇶",
  GP: "🇬🇵",
  VI: "🇻🇮",
};

const TABS: { id: Tab; label: string; description: string }[] = [
  { id: "overview", label: "Overview", description: "Country profile, currency, tax & labor" },
  { id: "validators", label: "Validators", description: "Validate any compliance ID" },
  { id: "form", label: "Form", description: "Auto-generated employee & company forms" },
  { id: "payroll", label: "Payroll", description: "Gross→net simulator" },
];

// Detailed T1 packs — the rest fall back to base data.
const T1 = new Set(["IN", "US", "GB", "DE", "FR", "SG", "AE", "BR", "AU", "CA"]);

export function App() {
  const regium = useRegium();
  const isoList = regium.listCountries();
  const [country, setCountry] = useState(
    () => isoList.find((iso) => iso === "IN") ?? isoList[0] ?? "IN",
  );
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");

  const countryOptions = useMemo(
    () =>
      isoList.map((iso) => {
        const c = regium.getCountryConfig(iso);
        return {
          iso,
          name: c.name,
          currency: c.currency.code,
          flag: FLAGS[iso] ?? "🌐",
          tier: T1.has(iso) ? ("T1" as const) : ("T4" as const),
        };
      }),
    [isoList, regium],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return countryOptions;
    return countryOptions.filter(
      (o) =>
        o.iso.toLowerCase().includes(q) ||
        o.name.toLowerCase().includes(q) ||
        o.currency.toLowerCase().includes(q),
    );
  }, [countryOptions, search]);

  const current = countryOptions.find((o) => o.iso === country);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__brand">
          <div className="topbar__brand-mark" aria-hidden="true">
            R
          </div>
          <div>
            <div className="topbar__title">Regium</div>
            <div className="topbar__tag">Global workforce compliance infrastructure</div>
          </div>
        </div>
        <div className="topbar__meta">
          <span className="topbar__count">{countryOptions.length} countries</span>
          <a className="topbar__link" href="https://github.com/" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="hero__inner">
          <h1 className="hero__title">Pick a country. Everything else updates.</h1>
          <p className="hero__sub">
            One API for tax IDs, payroll, banking, labor and immigration metadata across the world.
          </p>

          <div className="picker">
            <label htmlFor="country-search" className="picker__label">
              Country
            </label>
            <input
              id="country-search"
              className="picker__search"
              type="search"
              placeholder="Search by name, ISO code, or currency…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
            <div className="picker__row">
              <span className="picker__flag" aria-hidden="true">
                {current?.flag}
              </span>
              <select
                id="country-select"
                className="picker__select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                size={1}
              >
                {filtered.map((o) => (
                  <option key={o.iso} value={o.iso}>
                    {o.name} · {o.iso} · {o.currency}
                    {o.tier === "T1" ? " ★" : ""}
                  </option>
                ))}
                {filtered.length === 0 && <option disabled>No matches</option>}
              </select>
            </div>
            <div className="picker__hint">
              {countryOptions.length} countries loaded ·{" "}
              {countryOptions.filter((o) => o.tier === "T1").length} with full payroll & tax data
              (★) · the rest carry country, currency & authority metadata.
            </div>
          </div>

          <nav className="tabs" aria-label="Sections">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className="tab"
                data-active={tab === t.id}
                onClick={() => setTab(t.id)}
              >
                <span className="tab__label">{t.label}</span>
                <span className="tab__desc">{t.description}</span>
              </button>
            ))}
          </nav>
        </div>
      </section>

      <main className="content">
        {tab === "overview" && <CountryOverview country={country} />}
        {tab === "validators" && <ValidatorPlayground country={country} />}
        {tab === "form" && <ComplianceForm country={country} />}
        {tab === "payroll" && <PayrollSimulator country={country} />}
      </main>

      <footer className="footer">
        <span>Regium · Apache-2.0 · {new Date().getFullYear()}</span>
        <span className="footer__sep">·</span>
        <span>Pure metadata · deterministic · framework-agnostic</span>
      </footer>
    </div>
  );
}

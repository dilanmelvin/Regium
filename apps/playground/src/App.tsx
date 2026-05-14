import { useRegium } from "@regium/react";
import { useState } from "react";
import { ComplianceForm } from "./views/ComplianceForm";
import { CountryOverview } from "./views/CountryOverview";
import { PayrollSimulator } from "./views/PayrollSimulator";
import { ValidatorPlayground } from "./views/ValidatorPlayground";

type Tab = "overview" | "validators" | "form" | "payroll";

const FLAGS: Record<string, string> = {
  IN: "🇮🇳",
  US: "🇺🇸",
  GB: "🇬🇧",
  DE: "🇩🇪",
  FR: "🇫🇷",
  SG: "🇸🇬",
  AE: "🇦🇪",
  BR: "🇧🇷",
  AU: "🇦🇺",
  CA: "🇨🇦",
};

export function App() {
  const regium = useRegium();
  const isoList = regium.listCountries();
  const [country, setCountry] = useState(isoList[0] ?? "IN");
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__brand">
          <div className="topbar__brand-mark">R</div>
          <div>
            <div>Regium</div>
            <div className="topbar__tag">Global workforce compliance infrastructure</div>
          </div>
        </div>
        <nav className="topbar__nav">
          <button type="button" data-active={tab === "overview"} onClick={() => setTab("overview")}>
            Overview
          </button>
          <button
            type="button"
            data-active={tab === "validators"}
            onClick={() => setTab("validators")}
          >
            Validators
          </button>
          <button type="button" data-active={tab === "form"} onClick={() => setTab("form")}>
            Form
          </button>
          <button type="button" data-active={tab === "payroll"} onClick={() => setTab("payroll")}>
            Payroll
          </button>
        </nav>
      </header>

      <div className="shell">
        <aside className="sidebar">
          <div className="sidebar__title">Countries</div>
          {isoList.map((iso) => {
            const c = regium.getCountryConfig(iso);
            return (
              <button
                key={iso}
                type="button"
                className="sidebar__item"
                data-active={country === iso}
                onClick={() => setCountry(iso)}
              >
                <span className="sidebar__item-flag">{FLAGS[iso] ?? "🌐"}</span>
                {c.name}
                <span className="subtle" style={{ marginLeft: 6, fontSize: 11 }}>
                  {iso}
                </span>
              </button>
            );
          })}
        </aside>

        <main className="content">
          {tab === "overview" && <CountryOverview country={country} />}
          {tab === "validators" && <ValidatorPlayground country={country} />}
          {tab === "form" && <ComplianceForm country={country} />}
          {tab === "payroll" && <PayrollSimulator country={country} />}
        </main>
      </div>
    </div>
  );
}

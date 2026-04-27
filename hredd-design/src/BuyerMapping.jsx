// Buyer Compliance Mapping page

const data = {
  vol: "VOL I · NO V · APRIL 2026",
  sells: ["Germany", "France", "Netherlands"],
  sources: ["India", "Bangladesh", "Vietnam", "Türkiye"],
  sector: "Apparel & textiles",
  size: "€450M revenue · 1,200 employees",
};

const matrix = [
  { ttl: "Lieferkettensorgfaltspflichtengesetz", nm: "LkSG", juris: "Germany", yr: 2023, applies: true,
    obl: ["full", "full", "full", "partial", "full", "full", "partial"], gap: 2, gapHigh: false },
  { ttl: "Corporate Sustainability Due Diligence Directive", nm: "CSDDD", juris: "European Union", yr: 2024, applies: true,
    obl: ["full", "full", "full", "full", "full", "full", "full"], gap: 5, gapHigh: true },
  { ttl: "Loi sur le devoir de vigilance", nm: "Vigilance Law", juris: "France", yr: 2017, applies: true,
    obl: ["full", "partial", "full", "none", "full", "full", "none"], gap: 1, gapHigh: false },
  { ttl: "Wet zorgplicht kinderarbeid", nm: "WZK", juris: "Netherlands", yr: 2022, applies: true,
    obl: ["none", "full", "none", "none", "full", "partial", "none"], gap: 0, gapHigh: false },
  { ttl: "Modern Slavery Act", nm: "MSA", juris: "United Kingdom", yr: 2015, applies: false,
    obl: ["partial", "full", "none", "none", "partial", "none", "none"], gap: 0, gapHigh: false },
  { ttl: "Uyghur Forced Labor Prevention Act", nm: "UFLPA", juris: "United States", yr: 2022, applies: false,
    obl: ["none", "full", "none", "none", "none", "full", "none"], gap: 0, gapHigh: false },
];

const oblColumns = ["Risk analysis", "Policy statement", "Preventive measures", "Remedial measures", "Grievance mechanism", "Reporting", "Civil liability"];

const obligations = [
  { num: "01", lbl: "Risk analysis", short: "Annual systematic risk identification across the buyer's own operations and direct suppliers." },
  { num: "02", lbl: "Policy statement", short: "Public-facing commitment to human-rights and environmental due diligence." },
  { num: "03", lbl: "Preventive measures", short: "Concrete steps to prevent identified risks from materialising in the chain." },
  { num: "04", lbl: "Remedial measures", short: "Procedures for ending or minimising violations once they have occurred." },
  { num: "05", lbl: "Grievance mechanism", short: "Accessible channel for affected persons inside and outside the company." },
  { num: "06", lbl: "Reporting", short: "Annual public report describing risks, measures, and outcomes." },
  { num: "07", lbl: "Civil liability", short: "Direct legal exposure to victims for failure to comply." },
];

function TopStrip() {
  return (
    <div className="topstrip">
      <div className="vol">{data.vol}</div>
      <div className="right">
        <a href="#">Archive</a>
        <a href="#">Contact</a>
        <a href="#">RSS</a>
        <a href="#">EN · ES · PT</a>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <nav className="nav">
      <div className="nav-left">
        <a href="Homepage.html">Home</a>
        <a href="Tracker.html">Tracker</a>
      </div>
      <div className="nav-center"><span className="serif">hredd<span className="glyph">·</span>org</span></div>
      <div className="nav-right">
        <a href="BuyerMapping.html" className="active">Buyer Mapping</a>
        <a href="Articles.html">Articles</a>
        <a href="About.html">About</a>
        <a href="Subscribe.html" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}>Subscribe</a>
      </div>
    </nav>
  );
}

function Header() {
  return (
    <header className="pheader">
      <div>
        <div className="eyebrow">A working tool · Updated weekly</div>
        <h1>Which laws govern <em>your</em> chain?</h1>
        <p className="lede">
          Tell us where you sell into and where you source from. We will
          return a personalised compliance map: the statutes that apply,
          the obligations they impose, and where the gaps sit.
        </p>
      </div>
      <div className="v"></div>
      <div className="stats">
        <div className="label">In the database</div>
        <div className="row"><span className="num">18</span><span className="lbl">statutes mapped to seven obligations</span></div>
        <div className="row"><span className="num">42</span><span className="lbl">jurisdictions covered, in force or pending</span></div>
        <div className="row"><span className="num">7</span><span className="lbl">canonical due-diligence obligations</span></div>
      </div>
    </header>
  );
}

function ToolBand() {
  return (
    <div className="toolband">
      <div className="copy">
        <strong>How this works.</strong> The mapping uses the statute scoping
        rules each parliament wrote, applied to the company profile you
        enter below. It is reference, not legal advice.
      </div>
      <div className="meta">
        <div className="upd">UPDATED · 14 APRIL 2026</div>
        <div style={{ marginTop: 4 }}>METHODOLOGY · v3.2</div>
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="form">
      <div className="field">
        <div className="label">Sells into</div>
        <div className="pills">
          {data.sells.map(s => (
            <span className="pill" key={s}>{s}<span className="x">×</span></span>
          ))}
        </div>
        <input className="text" placeholder="Add a market…" />
        <div className="suggest">
          Common: <a>EU-27</a> <a>UK</a> <a>USA</a>
        </div>
      </div>

      <div className="field">
        <div className="label">Sources from</div>
        <div className="pills">
          {data.sources.map(s => (
            <span className="pill" key={s}>{s}<span className="x">×</span></span>
          ))}
        </div>
        <input className="text" placeholder="Add an origin country…" />
        <div className="suggest">
          Common: <a>Bangladesh</a> <a>India</a> <a>China</a> <a>Brazil</a>
        </div>
      </div>

      <div className="field">
        <div className="label">Profile</div>
        <input className="text" defaultValue={data.sector} style={{ marginBottom: 14 }} />
        <input className="text" defaultValue={data.size} />
        <div className="suggest">Sector · revenue · headcount</div>
      </div>

      <div className="submit">
        <button>Map my obligations →</button>
      </div>
    </div>
  );
}

function Summary() {
  const apply = matrix.filter(m => m.applies).length;
  const total = matrix.length;
  const highGap = matrix.filter(m => m.gapHigh).length;
  return (
    <div className="summary">
      <div>
        <div className="label">Mapped result</div>
        <h2>Four statutes apply directly. <em>One</em> has material gaps.</h2>
        <div className="meta-line">
          For a profile of <strong>{data.sector}</strong>, <strong>{data.size}</strong>, selling into <strong>{data.sells.join(", ")}</strong>, sourcing from <strong>{data.sources.join(", ")}</strong>.
        </div>
      </div>
      <div className="v"></div>
      <div className="counts">
        <div className="c"><div className="n">{apply}</div><div className="l">Statutes apply</div></div>
        <div className="c"><div className="n">{total - apply}</div><div className="l">Watch-list</div></div>
        <div className="c"><div className="n accent">{highGap}</div><div className="l">High-gap exposure</div></div>
      </div>
    </div>
  );
}

function Matrix() {
  return (
    <section className="matrix-wrap">
      <div className="matrix-head">
        <h3>Obligation matrix · <em>your chain</em></h3>
        <div className="legend">
          <span><span className="sw full"></span>Applies</span>
          <span><span className="sw partial"></span>Partial / conditional</span>
          <span><span className="sw gap"></span>Not required</span>
        </div>
      </div>
      <div className="matrix">
        <table>
          <thead>
            <tr>
              <th className="law">Statute</th>
              <th className="juris">Jurisdiction</th>
              {oblColumns.map(c => (
                <th className="obl" key={c}><span>{c}</span></th>
              ))}
              <th className="gap">Gap</th>
            </tr>
          </thead>
          <tbody>
            {matrix.filter(m => m.applies).map(m => (
              <tr key={m.nm}>
                <td className="law-cell">
                  <div className="ttl">{m.ttl}</div>
                  <div className="nm">{m.nm}</div>
                </td>
                <td className="juris-cell">{m.juris}<span className="yr">{m.yr}</span></td>
                {m.obl.map((o, i) => (
                  <td key={i} className="obl-cell"><span className={"dot " + o}></span></td>
                ))}
                <td className={"gap-cell" + (m.gapHigh ? " high" : "")}>{m.gap > 0 ? m.gap : "—"}</td>
              </tr>
            ))}
            <tr style={{ background: 'var(--bg-warm)' }}>
              <td colSpan="9" style={{ fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)', padding: '10px 12px' }}>Watch-list — not currently in scope, monitor</td>
            </tr>
            {matrix.filter(m => !m.applies).map(m => (
              <tr key={m.nm} style={{ opacity: 0.55 }}>
                <td className="law-cell">
                  <div className="ttl">{m.ttl}</div>
                  <div className="nm">{m.nm}</div>
                </td>
                <td className="juris-cell">{m.juris}<span className="yr">{m.yr}</span></td>
                {m.obl.map((o, i) => (
                  <td key={i} className="obl-cell"><span className={"dot " + o}></span></td>
                ))}
                <td className="gap-cell">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Breakdown() {
  const active = 0;
  return (
    <section className="breakdown">
      <div className="left">
        <div className="label">Obligation detail</div>
        <h2>Seven obligations, <em>read in full</em></h2>
        <p>
          Every statute in the database is decomposed into the same seven
          due-diligence obligations. Read each one in detail, with the
          source language and the variations across jurisdictions.
        </p>
        <div className="nav-list">
          {obligations.map((o, i) => (
            <div key={o.num} className={"item" + (i === active ? " active" : "")}>
              <span className="num">{o.num}</span>
              <span className="lbl">{o.lbl}</span>
              <span className="arr">→</span>
            </div>
          ))}
        </div>
      </div>
      <div className="v"></div>
      <div className="obl-detail">
        <div className="head">
          <div>
            <div className="num">OBLIGATION 01</div>
            <h3>Risk analysis</h3>
          </div>
          <div className="when">
            <div>Required by · 4 of 4 statutes</div>
            <span className="acc">Annual cadence, in writing</span>
          </div>
        </div>
        <p className="body">
          A systematic identification of human-rights and environmental
          risks across a buyer's own operations and its direct
          suppliers, conducted at least annually, documented in writing,
          and reviewed when a substantial change in circumstance arises.
          The scope and depth varies. <em>The cadence does not.</em>
        </p>
        <div className="grid">
          <div>
            <h4>What is required</h4>
            <ul>
              <li>Written annual analysis<span className="src">LkSG · §5</span></li>
              <li>Substantive ad-hoc review on change<span className="src">CSDDD · Art 8</span></li>
              <li>Reasonable-vigilance plan, public<span className="src">VL · L225-102-4</span></li>
              <li>Identification of severity & likelihood<span className="src">CSDDD · Art 8</span></li>
              <li>Prioritisation of identified risks<span className="src">LkSG · §5(3)</span></li>
            </ul>
          </div>
          <div className="v"></div>
          <div>
            <h4>What is not</h4>
            <ul>
              <li>Verification by independent third party<span className="src">—</span></li>
              <li>Coverage of indirect Tier-2+ suppliers<span className="src">except CSDDD</span></li>
              <li>Worker consultation in risk methodology<span className="src">—</span></li>
              <li>Disclosure of supplier identities<span className="src">—</span></li>
              <li>Risk-weighted procurement decisions<span className="src">—</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Example() {
  return (
    <section className="example">
      <div>
        <div className="label">Worked example</div>
        <h2>A medium apparel buyer, <em>read end to end</em></h2>
        <p>
          To make the obligations concrete, here is one synthetic
          buyer's chain, mapped through the four statutes that bind
          them. The buyer is fictional; the obligations are real.
        </p>
        <p>
          The single largest exposure is <strong>civil liability under
          CSDDD</strong>, which permits affected persons in supplier
          countries to bring claims directly in Member State courts.
          For the other three statutes, exposure is regulatory.
        </p>
      </div>
      <div className="v"></div>
      <div className="scenario">
        <div className="h">Synthetic profile</div>
        <h4 className="ttl">Buyer · cotton-sourced apparel into the EU</h4>
        <dl>
          <dt>Headquarters</dt><dd>Düsseldorf, Germany</dd>
          <dt>Revenue</dt><dd>€450M FY 2025</dd>
          <dt>Headcount</dt><dd>1,200 (DE) · 80 (NL) · 40 (FR)</dd>
          <dt>Markets</dt><dd>Germany, France, Netherlands</dd>
          <dt>Origins</dt><dd>India, Bangladesh, Vietnam, Türkiye</dd>
          <dt>Tier-1 count</dt><dd>62 direct suppliers</dd>
          <dt>Tier-2 estimate</dt><dd>~ 380 (mills, dye houses)</dd>
          <dt>Sub-contracting</dt><dd>Permitted with notice</dd>
          <dt>Audit programme</dt><dd>SMETA · annual</dd>
        </dl>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="cta">
      <div className="label">Take it further</div>
      <h2>Save this map. <em>Or, share it.</em></h2>
      <p>
        Export your compliance map as a structured PDF for legal
        counsel, share a private link with your supplier teams, or
        subscribe to be alerted when any statute on your map changes.
      </p>
      <div className="actions">
        <button className="primary">Export PDF</button>
        <button className="ghost">Share private link</button>
        <button className="ghost">Alert me on changes</button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <span>© 2026 HREDD · Built with care from Noida, India · contact@hredd.org</span>
      <div className="links">
        <a href="#">Methodology</a>
        <a href="#">Data sources</a>
        <a href="#">Republish</a>
      </div>
    </footer>
  );
}

function Page() {
  return (
    <div className="page">
      <TopStrip />
      <Nav />
      <Header />
      <ToolBand />
      <Form />
      <Summary />
      <Matrix />
      <Breakdown />
      <Example />
      <CTA />
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Page />);

const { useState, useEffect, useMemo, useRef } = React;

const data = JSON.parse(document.getElementById('page-data').textContent);

// Countries that have laws (ISO_A3)
const LAW_COUNTRIES = new Set(Object.keys(data.byCountry));

// Country code → display name
const COUNTRY_NAMES = {
  DEU: 'Germany', FRA: 'France', NOR: 'Norway', GBR: 'United Kingdom',
  NLD: 'Netherlands', CHE: 'Switzerland', AUT: 'Austria', BEL: 'Belgium',
  ESP: 'Spain', ITA: 'Italy', SWE: 'Sweden', FIN: 'Finland', DNK: 'Denmark',
  USA: 'United States', CAN: 'Canada', AUS: 'Australia', JPN: 'Japan',
};

// ---------- Top strip / Nav (shared) ----------
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
        <a href="Tracker.html" className="active">Tracker</a>
      </div>
      <div className="nav-center"><span className="serif">hredd<span className="glyph">·</span>org</span></div>
      <div className="nav-right">
        <a href="BuyerMapping.html">Buyer Mapping</a>
        <a href="Articles.html">Articles</a>
        <a href="About.html">About</a>
        <a href="Subscribe.html" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}>Subscribe</a>
      </div>
    </nav>
  );
}

// ---------- Page header ----------
function PageHeader() {
  return (
    <header className="pgh">
      <div>
        <div className="eyebrow">The Tracker</div>
        <h1>A working ledger of <em>HREDD</em> statutes on the books.</h1>
        <p className="lede">
          Eighteen laws across four jurisdictions, updated monthly. Click a
          country to read the statutes that apply, or scroll to the full
          ledger below.
        </p>
      </div>
      <div className="v"></div>
      <div className="stats">
        <div className="label">As of April 2026</div>
        {data.stats.map((s, i) => (
          <React.Fragment key={i}>
            <div className="row">
              <div className="n">{s.n}</div>
              <div className="k">{s.k}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </header>
  );
}

// ---------- Date banner ----------
function Banner() {
  return (
    <div className="banner">
      <div>Updated · 14 April 2026</div>
      <div className="right">
        <span>Next update · 12 May 2026</span>
        <span className="arrow">→ Sign up for changelog</span>
      </div>
    </div>
  );
}

// ---------- Map ----------
function WorldMap({ selected, onSelect }) {
  const [topo, setTopo] = useState(null);
  const wrapRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 450 });

  useEffect(() => {
    fetch('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
      .then(r => r.json())
      .then(setTopo)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => {
      const r = e.contentRect;
      setSize({ w: r.width, h: r.height });
    });
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const { countries, paths, graticule } = useMemo(() => {
    if (!topo) return { countries: [], paths: '', graticule: '' };
    const features = topojson.feature(topo, topo.objects.countries).features;
    // Numeric ISO id → ISO_A3 mapping for the countries we care about
    const NUM_TO_A3 = {
      '276': 'DEU', '250': 'FRA', '578': 'NOR', '826': 'GBR',
      '528': 'NLD', '756': 'CHE', '040': 'AUT', '56': 'BEL', '056': 'BEL',
      '724': 'ESP', '380': 'ITA', '752': 'SWE', '246': 'FIN', '208': 'DNK',
      '840': 'USA', '124': 'CAN', '036': 'AUS', '36': 'AUS', '392': 'JPN',
      '40': 'AUT',
    };
    const projection = d3.geoNaturalEarth1()
      .fitSize([size.w, size.h], { type: 'Sphere' });
    const path = d3.geoPath(projection);

    const grat = d3.geoGraticule10();

    const enriched = features.map(f => {
      const id = String(f.id);
      const a3 = NUM_TO_A3[id] || NUM_TO_A3[id.padStart(3, '0')];
      return {
        d: path(f),
        a3,
        hasLaw: a3 && LAW_COUNTRIES.has(a3),
        id,
      };
    }).filter(f => f.d);

    return { countries: enriched, paths: '', graticule: path(grat) };
  }, [topo, size.w, size.h]);

  return (
    <div className="map-canvas" ref={wrapRef}>
      <svg viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="xMidYMid meet">
        <g className="grat">
          <path d={graticule} />
        </g>
        <g>
          {countries.map((c, i) => (
            <path
              key={i}
              d={c.d}
              className={`country ${c.hasLaw ? 'has-law' : ''} ${selected === c.a3 ? 'selected' : ''}`}
              onClick={() => c.hasLaw && onSelect(c.a3)}
            >
              {c.a3 && <title>{COUNTRY_NAMES[c.a3] || c.a3}</title>}
            </path>
          ))}
        </g>
      </svg>
      <div className="overlay">
        <div className="row"><span className="swatch" style={{ background: 'var(--dark-fill)' }}></span><span>HREDD law on the books</span></div>
        <div className="row"><span className="swatch" style={{ background: 'var(--light-fill)' }}></span><span>No law tracked</span></div>
      </div>
      <div className="scale">NATURAL EARTH PROJECTION · 1:120M</div>
    </div>
  );
}

function Panel({ selected }) {
  const laws = selected ? data.byCountry[selected] : null;
  if (!selected) {
    return (
      <aside className="panel">
        <div className="label">Country detail</div>
        <p className="empty">
          Select a country from the map to read the statutes that apply within
          its jurisdiction.
          <span className="hint">Tip · only dark countries are clickable.</span>
        </p>
      </aside>
    );
  }
  return (
    <aside className="panel">
      <div className="label">Country detail</div>
      <h3 className="country-name">{COUNTRY_NAMES[selected] || selected}</h3>
      <div className="meta-line">{laws.length} {laws.length === 1 ? 'statute' : 'statutes'} on the tracker</div>
      <div>
        {laws.map((l) => (
          <a key={l.id} className="law" href={`#law-${l.id}`}>
            <div className="yr">{l.year}</div>
            <div className="ttl" dangerouslySetInnerHTML={{ __html: l.name }} />
            <div className={`st ${l.status}`}>{l.statusLabel} →</div>
          </a>
        ))}
      </div>
    </aside>
  );
}

function MapBlock() {
  const [selected, setSelected] = useState('DEU');
  return (
    <section className="map-wrap">
      <WorldMap selected={selected} onSelect={setSelected} />
      <div className="v"></div>
      <Panel selected={selected} />
    </section>
  );
}

// ---------- Ledger ----------
function Ledger() {
  const [filter, setFilter] = useState('all');
  const filtered = useMemo(() => {
    if (filter === 'all') return data.ledger;
    return data.ledger.filter(l => l.status === filter);
  }, [filter]);
  return (
    <section>
      <div className="ledger-head">
        <h2>The full ledger <em>·</em> {filtered.length} of {data.ledger.length}</h2>
        <div className="filters">
          {[
            { k: 'all', label: 'All' },
            { k: 'in-force', label: 'In force' },
            { k: 'pending', label: 'Pending' },
            { k: 'proposed', label: 'Proposed' },
          ].map(f => (
            <span
              key={f.k}
              className={`pill ${filter === f.k ? 'active' : ''}`}
              onClick={() => setFilter(f.k)}
            >{f.label}</span>
          ))}
        </div>
      </div>
      <table className="ledger">
        <thead>
          <tr>
            <th></th>
            <th>Statute</th>
            <th>Jurisdiction</th>
            <th>Enacted</th>
            <th>Scope</th>
            <th style={{ textAlign: 'right' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(l => (
            <tr key={l.n}>
              <td className="num">{l.n}</td>
              <td className="name" dangerouslySetInnerHTML={{ __html: l.name }} />
              <td className="juris">{l.juris}</td>
              <td className="year">{l.year}</td>
              <td className="scope" dangerouslySetInnerHTML={{ __html: l.scope }} />
              <td className={`status ${l.status}`}>{l.statusLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <span>© 2026 HREDD · Built with care from Noida, India · contact@hredd.org</span>
      <div className="links">
        <a href="#">Methodology</a>
        <a href="#">Data download (CSV)</a>
        <a href="#">RSS · Tracker changelog</a>
      </div>
    </footer>
  );
}

// d3-geo CDN exposes its functions on window.d3 already

function Page() {
  return (
    <div className="page">
      <TopStrip />
      <Nav />
      <PageHeader />
      <Banner />
      <MapBlock />
      <Ledger />
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Page />);

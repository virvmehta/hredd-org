const { useState, useMemo } = React;
const data = JSON.parse(document.getElementById('page-data').textContent);

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
    </div>);

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
        <a href="BuyerMapping.html">Buyer Mapping</a>
        <a href="Articles.html" className="active">Articles</a>
        <a href="About.html">About</a>
        <a href="Subscribe.html" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}>Subscribe</a>
      </div>
    </nav>
  );
}

function PageHeader() {
  return (
    <header className="pgh">
      <div>
        <div className="eyebrow">Articles</div>
        <h1>Reporting from the <em>other end</em> of the supply chain.</h1>
        <p className="lede">Field reports, analyses, interviews, and short polemics on the world of HREDD.


        </p>
      </div>
      <div className="v"></div>
      <aside className="meta-side">
        <div className="label">The archive</div>
        {data.stats.map((s, i) =>
        <div className="row" key={i}>
            <div className="n">{s.n}</div>
            <div className="k">{s.k}</div>
          </div>
        )}
      </aside>
    </header>);

}

const CATS = ['All', 'Analysis', 'Field report', 'Interview', 'Commentary', 'Case study', 'Dispatch'];

function CategoryBar({ active, setActive }) {
  return (
    <div className="cats">
      <div className="group">
        {CATS.map((c) =>
        <span key={c} className={`pill ${active === c ? 'active' : ''}`} onClick={() => setActive(c)}>{c}</span>
        )}
      </div>
      <div className="sort">
        Sort{' '}
        <a className="active">Newest</a>{' · '}
        <a>Most read</a>{' · '}
        <a>By section</a>
      </div>
    </div>);

}

function Lead({ d }) {
  return (
    <article className="lead">
      <div className="figure"><span className="cap">{d.figcap}</span></div>
      <div className="eyebrow">{d.category}</div>
      <h2>{d.title}</h2>
      <p className="deck">{d.deck}</p>
      <div className="byline">
        <span className="author">By {d.author}</span>
        <span className="sep">/</span>
        <span>{d.date}</span>
        <span className="sep">/</span>
        <span>{d.read}</span>
      </div>
    </article>);

}

function Stacked({ d }) {
  return (
    <article className="item">
      <div className="eyebrow">{d.category}</div>
      <h3>{d.title}</h3>
      <p className="excerpt">{d.excerpt}</p>
      <div className="byline">
        <span className="author">By {d.author}</span>
        <span className="sep">/</span>
        <span>{d.date}</span>
        <span className="sep">/</span>
        <span>{d.read}</span>
      </div>
    </article>);

}

function LeadRow() {
  return (
    <section className="lead-row">
      <Lead d={data.lead} />
      <div className="v"></div>
      <div className="stacked">
        {data.stacked.map((s, i) => <Stacked key={i} d={s} />)}
      </div>
    </section>);

}

function Archive() {
  return (
    <section className="archive">
      <div className="archive-head">
        <h2>From the <em>archive</em></h2>
        <span className="meta">Showing 10 of 62 · February 2026 onward</span>
      </div>
      {data.archive.map((a, i) =>
      <a className="row" key={i} href="#">
          <div className="date">{a.date}</div>
          <div className="cat">{a.cat}</div>
          <div className="ttl">
            {a.title}
            <span className="deck">{a.deck}</span>
          </div>
          <div className="by">By {a.author}</div>
          <div className="read">{a.read}</div>
        </a>
      )}
      <div className="more"><span>Load more →</span></div>
    </section>);

}

function Footer() {
  return (
    <footer>
      <span>© 2026 HREDD · Built with care from Noida, India · contact@hredd.org</span>
      <div className="links">
        <a href="#">Methodology</a>
        <a href="#">Contribute</a>
        <a href="#">RSS · Articles feed</a>
      </div>
    </footer>);

}

function Page() {
  const [cat, setCat] = useState('All');
  return (
    <div className="page">
      <TopStrip />
      <Nav />
      <PageHeader />
      <CategoryBar active={cat} setActive={setCat} />
      <LeadRow />
      <Archive />
      <Footer />
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<Page />);
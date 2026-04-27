const { useMemo } = React;

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
        <a href="Homepage.html" className="active">Home</a>
        <a href="Tracker.html">Tracker</a>
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

function Masthead() {
  return (
    <section className="masthead">
      <div>
        <h1>
          Human rights
          <span className="l2" style={{ fontSize: "86px", textAlign: "left", width: "21.208px" }}>&amp; environmental</span>
          <span className="l3">due diligence.</span>
        </h1>
        <p className="lede">
          A monthly publication tracking the laws written in capitals far from
          where their consequences land. Reporting, analysis, and a working
          tracker of every statute on the books.
        </p>
        <div className="stamp">
          <span className="dot"></span>
          <span>Established 2026</span>
          <span style={{ color: 'var(--rule)' }}>/</span>
          <span>Independent</span>
          <span style={{ color: 'var(--rule)' }}>/</span>
          <span>Monthly</span>
        </div>
      </div>
      <div className="divider"></div>
      <aside className="thismonth">
        <div className="label">This month</div>
        {data.stats.map((s, i) =>
        <div className="row" key={i}>
            <div className="n">{s.n}</div>
            <div className="k">{s.k}</div>
          </div>
        )}
        <div className="foot">View the tracker  →</div>
      </aside>
    </section>);

}

function ContentsHead() {
  return (
    <header className="contents-head">
      <h2>Latest <em>·</em> April</h2>
      <div className="right">
        Issue contents <span style={{ color: 'var(--rule)', margin: '0 10px' }}>/</span>
        <a href="#">All articles →</a>
      </div>
    </header>);

}

function Lead({ d }) {
  return (
    <article className="lead">
      <div className="figure">
        <span className="cap">{d.figcap}</span>
      </div>
      <div className="eyebrow">{d.category}</div>
      <h3>{d.title}</h3>
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

function Secondary({ d }) {
  return (
    <article className="sec">
      <div className="eyebrow">{d.category}</div>
      <h4>{d.title}</h4>
      <p className="excerpt">{d.excerpt}</p>
      <div className="byline">
        <span className="author">By {d.author}</span>
        <span className="sep">/</span>
        <span>{d.read}</span>
      </div>
    </article>);

}

function LowerCol({ d }) {
  return (
    <article className="col">
      <div className="eyebrow">{d.category}</div>
      <h4>{d.title}</h4>
      <p className="excerpt">{d.excerpt}</p>
      <div className="byline">
        <span className="author">By {d.author}</span>
        <span className="sep">/</span>
        <span>{d.read}</span>
      </div>
    </article>);

}

function Latest() {
  return (
    <section>
      <ContentsHead />
      <div className="lead-grid">
        <Lead d={data.lead} />
        <div className="v"></div>
        <div className="secondaries">
          {data.secondaries.map((s, i) => <Secondary key={i} d={s} />)}
        </div>
      </div>
      <div className="three">
        {data.lower.map((s, i) => <LowerCol key={i} d={s} />)}
      </div>
    </section>);

}

function Tracker() {
  return (
    <section className="tracker">
      <div className="tracker-head">
        <div>
          <div className="eyebrow">The Tracker</div>
          <h2>Eighteen laws, <em>four</em> jurisdictions, one ledger.</h2>
        </div>
        <p className="blurb">
          A working catalogue of every human rights and environmental due
          diligence statute, updated monthly.
        </p>
      </div>

      <div className="tracker-grid">
        <div>
          {data.laws.map((l) =>
          <div className="law-row" key={l.n}>
              <div className="num">{l.n}</div>
              <div className="name">{l.name}</div>
              <div className="juris">{l.juris}</div>
              <div className={`status ${l.status}`}>{l.statusLabel}</div>
            </div>
          )}
        </div>
        <div className="v"></div>
        <aside className="tracker-side">
          <div className="label">From the editors</div>
          <p className="pull">
            “The text of a law is the easy part. The cost of complying with it,
            and who bears that cost, is the story.”
          </p>
          <div className="stat"><span className="k">In force</span><span className="n">04</span></div>
          <div className="stat"><span className="k">Pending or in trilogue</span><span className="n">07</span></div>
          <div className="stat"><span className="k">Proposed</span><span className="n">07</span></div>
          <div className="cta">Open the full tracker  →</div>
        </aside>
      </div>
    </section>);

}

function Subscribe() {
  return (
    <section className="subscribe">
      <div className="subscribe-grid">
        <div>
          <div className="eyebrow">Subscribe</div>
          <h2>Once a month, <em>by post</em>.</h2>
          <p>
            A monthly briefing: every new statute on the tracker, the field
            reports our editors found worth your time, and nothing else. Free.
          </p>
        </div>
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <div className="row">
            <input placeholder="your name" />
            <button type="button">Optional</button>
          </div>
          <div className="row">
            <input placeholder="your email address" type="email" />
            <button type="submit">Subscribe →</button>
          </div>
          <div className="promises">
            <span><span className="dot"></span>No tracking</span>
            <span><span className="dot"></span>No third parties</span>
            <span><span className="dot"></span>Unsubscribe anytime</span>
          </div>
        </form>
      </div>
    </section>);

}

function Footer() {
  return (
    <footer>
      <div className="foot-grid">
        <div className="about">
          <div className="mast">hredd<em>·</em>org</div>
          <p>
            A publication on human rights and environmental due diligence
            legislation, written from a Global South perspective. Built with
            care from Noida, India.
          </p>
          <p className="meta" style={{ color: 'var(--ink-3)' }}>contact@hredd.org</p>
        </div>
        <div>
          <h5>Sections</h5>
          <ul>
            <li>The Tracker</li>
            <li>Buyer Compliance Mapping</li>
            <li>Articles</li>
            <li>Field Reports</li>
            <li>Interviews</li>
          </ul>
        </div>
        <div>
          <h5>About</h5>
          <ul>
            <li>Editorial position</li>
            <li>Editor</li>
            <li>Contribute</li>
            <li>Methodology</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h5>Elsewhere</h5>
          <ul>
            <li>RSS feed</li>
            <li>Mastodon</li>
            <li>Newsletter archive</li>
            <li>Press inquiries</li>
            <li>Republish a piece</li>
          </ul>
        </div>
      </div>
      <div className="colophon">
        <span>© 2026 HREDD · Set in EB Garamond &amp; Inter</span>
        <span>{data.vol}</span>
        <span>Site built quietly, on Astro &amp; Cloudflare</span>
      </div>
    </footer>);

}

function Page() {
  return (
    <div className="page">
      <TopStrip />
      <Nav />
      <Masthead />
      <Latest />
      <Tracker />
      <Subscribe />
      <Footer />
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<Page />);
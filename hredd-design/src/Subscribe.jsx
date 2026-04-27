// Subscribe page — single email-capture
const data = { vol: "VOL I · NO V · APRIL 2026" };

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
        <a href="BuyerMapping.html">Buyer Mapping</a>
        <a href="Articles.html">Articles</a>
        <a href="About.html">About</a>
        <a href="Subscribe.html" className="active" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}>Subscribe</a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="eyebrow">The fortnightly letter · Free · No advertising</div>
      <h1>Read the letter, <em>every other Friday</em>.</h1>
      <p className="lede">
        A short reading list and an editor's view on what changed in the
        last two weeks across human-rights and environmental due-diligence
        legislation. No advertising. No tracking pixels. Unsubscribe at
        the bottom of any issue.
      </p>

      <form className="form" onSubmit={e => e.preventDefault()}>
        <input type="email" placeholder="your.name@domain.org" autoFocus />
        <button type="submit">Subscribe →</button>
      </form>
      <div className="micro">
        We use your email only to send the letter. We do not share it,
        sell it, or pass it to any third party.
      </div>

      <div className="meta-row">
        <div className="cell">
          <div className="num">~ 4,200</div>
          <div className="lbl">Subscribers · 64 countries</div>
        </div>
        <div className="cell">
          <div className="num">26</div>
          <div className="lbl">Issues a year, fortnightly</div>
        </div>
        <div className="cell">
          <div className="num">EN · ES · PT</div>
          <div className="lbl">Three editions, your choice</div>
        </div>
      </div>
    </section>
  );
}

function Sample() {
  return (
    <section className="sample">
      <div className="label">A recent issue, in short</div>
      <h3>“On the quiet drafting of the EU Omnibus”</h3>
      <p className="byline">No 18 · Friday, 04 April 2026 · 1,820 words · 7 min read</p>
      <p className="excerpt">
        This week, the Council quietly published a forty-page Omnibus
        proposal that would, among other things, narrow the scope of
        CSDDD's civil-liability provision. We read it. Three things
        worth noting, and one we cannot yet explain. Plus: a Tracker
        change-log of seven jurisdictions, and a reading list of four
        pieces from the supplier-country press we found useful this
        fortnight.
      </p>
      <a className="link" href="#">Read this issue in full →</a>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <span>© 2026 hredd.org · Built with care from Noida, India · contact@hredd.org</span>
      <div className="links">
        <a href="#">Methodology</a>
        <a href="#">Past issues</a>
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
      <Hero />
      <Sample />
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Page />);

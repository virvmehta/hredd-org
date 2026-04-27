// About page

const data = {
  vol: "VOL I · NO V · APRIL 2026",
};

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
        <a href="About.html" className="active">About</a>
        <a href="Subscribe.html" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}>Subscribe</a>
      </div>
    </nav>
  );
}

function Header() {
  return (
    <header className="pheader">
      <div>
        <div className="eyebrow">A working publication · Independent · Reader-funded</div>
        <h1>A publication on due diligence, <em>read from below</em></h1>
        <p className="lede">
          hredd.org reports on human-rights and environmental due-diligence
          legislation from the place that legislation is supposed to protect.
          We work in English, Spanish, and Portuguese.
        </p>
      </div>
      <div className="v"></div>
      <div className="colophon">
        <div className="label">Colophon</div>
        <div className="row"><span className="k">Founded</span><span className="v2">November 2025</span></div>
        <div className="row"><span className="k">Edited from</span><span className="v2">Noida, India</span></div>
        <div className="row"><span className="k">Frequency</span><span className="v2">Weekly · monthly issue</span></div>
        <div className="row"><span className="k">Readership</span><span className="v2">11,400 across 64 countries</span></div>
        <div className="row"><span className="k">Languages</span><span className="v2">EN · ES · PT</span></div>
      </div>
    </header>
  );
}

function Manifesto() {
  return (
    <section className="manifesto">
      <div className="label">Why this exists</div>
      <p>
        Most reporting on supply-chain due diligence is written in
        Brussels, Berlin, or Washington, for an audience of compliance
        officers and trade-policy professionals in those same cities.
        The workers and communities the laws are written about are
        treated, when they appear at all, as data points.
      </p>
      <p>
        hredd.org begins from the other end. We report from the floors,
        the fields, and the mines that European and American
        legislation now claims to govern. We read every statute. We
        read every guidance note. We then ask whether what they require
        is, in fact, what is happening — and if not, <em>why not</em>.
      </p>
      <p>
        The publication is a working tool as much as a magazine. Our
        Tracker is meant to be useful to a labour lawyer in São Paulo
        and a procurement officer in Hamburg in the same week, for
        different reasons. Our long-form journalism is meant to be
        worth a subscriber's twenty minutes.
      </p>
      <p className="signoff">— The editors, Noida</p>
    </section>
  );
}

function Pillars() {
  return (
    <section className="pillars">
      <div className="top">
        <h2>What we publish, <em>and how</em></h2>
        <div className="meta">Four standing sections</div>
      </div>
      <div className="grid">
        <div className="col">
          <div className="num">01</div>
          <h3>The <em>Tracker</em></h3>
          <p>
            A working ledger of every HREDD statute on the books or in
            draft. Updated within fourteen days of any material change.
            Source-linked, in three languages.
          </p>
        </div>
        <div className="col">
          <div className="num">02</div>
          <h3>Field <em>reporting</em></h3>
          <p>
            Long-form journalism from the supplier countries the laws
            address. Tamil Nadu, Katanga, Espírito Santo, the Mekong.
            Reported on the ground, edited at distance.
          </p>
        </div>
        <div className="col">
          <div className="num">03</div>
          <h3>Buyer <em>mapping</em></h3>
          <p>
            A reference tool for procurement, legal, and sustainability
            teams to read their obligations across jurisdictions.
            Reference, not legal advice.
          </p>
        </div>
        <div className="col">
          <div className="num">04</div>
          <h3>Analysis &amp; <em>commentary</em></h3>
          <p>
            Periodic essays from contributors in supplier countries,
            buyer countries, and the regulatory cities in between. We
            commission, we edit, we pay.
          </p>
        </div>
      </div>
    </section>
  );
}

function People() {
  const team = [
    { initials: "VM", name: "Vir Mehta", role: "Founding editor", bio: "Reporter on labour and trade for twelve years; previously with the Centre for Responsible Business." },
    { initials: "AN", name: "Adaeze Nwosu", role: "Africa correspondent", bio: "Field reporter based in Lagos; covers cobalt, cocoa, and the regional implications of CSDDD." },
    { initials: "RR", name: "Ratna Ramaiah", role: "Legal editor", bio: "Trade-policy lawyer; leads the Tracker and the Buyer Mapping methodology." },
    { initials: "LP", name: "Lucas Pereira", role: "Latin America correspondent", bio: "Reporter based in São Paulo; covers Mercosur supply chains and the EU's deforestation regulation." },
    { initials: "HS", name: "Hema Sankar", role: "Photo editor", bio: "Documentary photographer; commissions all field photography for hredd.org." },
    { initials: "TJ", name: "Tomás Junqueira", role: "Translations", bio: "Editor of the Spanish and Portuguese editions; translates from English to both." },
  ];
  return (
    <section className="people">
      <div className="left">
        <div className="label">Who is behind it</div>
        <h2>A small <em>masthead</em>, in three time zones.</h2>
        <p>
          hredd.org is run by a permanent team of six and a rotating
          group of about a dozen contributing reporters and analysts.
          We hire from the regions we report on, and we pay our
          contributors at parity with the buyer-country press.
        </p>
        <p>
          We are not a foundation, not an NGO, and not the editorial
          arm of any consultancy. We are an independent publication.
        </p>
      </div>
      <div className="v"></div>
      <div>
        <div className="list">
          {team.map((p, i) => {
            const total = team.length;
            const isLast1 = i === total - 2;
            const isLast2 = i === total - 1;
            const cls = "person" + (isLast1 ? " last1" : "") + (isLast2 ? " last2" : "");
            return (
              <div key={p.name} className={cls}>
                <div className="av">{p.initials}</div>
                <div>
                  <h4 className="name">{p.name}</h4>
                  <p className="role">{p.role}</p>
                  <p className="bio">{p.bio}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Method() {
  return (
    <section className="method">
      <div className="left">
        <div className="label">How we work</div>
        <h2>Six rules, <em>read in full</em></h2>
        <p>
          Our methodology is published in full and revised annually. It
          governs how we choose statutes, how we report from supplier
          countries, what we do with anonymous sources, how we handle
          corrections, and how we declare conflicts.
        </p>
        <p>
          The full methodology runs to about nine pages and is read by
          our editors, our contributors, and — increasingly — by our
          subscribers in legal and procurement teams.
        </p>
        <a href="#" style={{ fontFamily: 'var(--sans)', fontSize: 11.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)', borderBottom: '1px solid var(--accent)', paddingBottom: 2 }}>Read the full methodology →</a>
      </div>
      <div className="v"></div>
      <ol>
        <li><div><h4 className="h">Read the statute, not the press release</h4><p>Every entry in the Tracker is read from the official source language, not from a buyer's summary or a lobbying brief.</p></div></li>
        <li><div><h4 className="h">Report from supplier countries first</h4><p>Field reporting is commissioned from journalists who live in the country reported on, not flown in for a week.</p></div></li>
        <li><div><h4 className="h">Pay at parity</h4><p>A reporter in Tiruppur is paid the same per-word rate as a reporter in Berlin. We publish our rate card.</p></div></li>
        <li><div><h4 className="h">Anonymous sources are last-resort</h4><p>We grant anonymity only where named identification creates real risk. We disclose, in the article, why anonymity was granted.</p></div></li>
        <li><div><h4 className="h">Corrections are public</h4><p>Every correction is dated, attached to the original article, and listed on a single page.</p></div></li>
        <li><div><h4 className="h">Conflicts are declared</h4><p>Editors and contributors declare any current or former relationship with a buyer, supplier, or regulator named in their reporting.</p></div></li>
      </ol>
    </section>
  );
}

function Funding() {
  return (
    <section className="funding">
      <div className="label">How this is funded</div>
      <h2>Reader-funded. <em>No grants. No advertising.</em> No editorial input from anyone.</h2>
      <p className="lede">
        hredd.org is an independent publication with no affiliation
        with any organisation, public or private. The views contained
        herein are personal. hredd.org is not funded by any
        organisation.
      </p>
      <div className="stmt">
        <div>
          <h4>Revenue source</h4>
          <p><em>100%</em> reader subscriptions and one-time contributions from individual readers.</p>
        </div>
        <div className="v"></div>
        <div>
          <h4>What we do not accept</h4>
          <p>Foundation grants, corporate sponsorships, advertising, sponsored content, or paid placement.</p>
        </div>
        <div className="v"></div>
        <div>
          <h4>Editorial firewall</h4>
          <p>Subscribers do not have editorial input. Neither do contributors' employers, past or present.</p>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact">
      <div className="left">
        <div className="label">Reach the desk</div>
        <h2>Tips, corrections, <em>and republication</em>.</h2>
        <p>
          We read every email. Tips reach the editors directly; corrections
          are processed within seven days; republication is generally free
          for non-commercial outlets in supplier countries.
        </p>
        <p>
          For media requests, please write to the editor with at least
          three working days' notice. We do not generally do live broadcast.
        </p>
      </div>
      <div className="v"></div>
      <div>
        <dl className="lines">
          <dt>Editor</dt><dd><a href="mailto:editor@hredd.org">editor@hredd.org</a></dd>
        </dl>
        <dl className="lines">
          <dt>Tips</dt><dd><a href="mailto:tips@hredd.org">tips@hredd.org</a> · PGP available</dd>
        </dl>
        <dl className="lines">
          <dt>Corrections</dt><dd><a href="mailto:corrections@hredd.org">corrections@hredd.org</a></dd>
        </dl>
        <dl className="lines">
          <dt>Republish</dt><dd><a href="mailto:republish@hredd.org">republish@hredd.org</a></dd>
        </dl>
        <dl className="lines">
          <dt>Press</dt><dd><a href="mailto:press@hredd.org">press@hredd.org</a></dd>
        </dl>
        <dl className="lines">
          <dt>Post</dt><dd>hredd.org · Sector 62, Noida 201301, India</dd>
        </dl>
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
        <a href="#">Corrections</a>
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
      <Manifesto />
      <Pillars />
      <People />
      <Method />
      <Funding />
      <Contact />
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Page />);

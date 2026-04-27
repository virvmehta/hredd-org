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
        <a href="Articles.html" className="active">Articles</a>
        <a href="About.html">About</a>
        <a href="Subscribe.html" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}>Subscribe</a>
      </div>
    </nav>
  );
}

function Crumb() {
  return (
    <div className="crumb">
      <a href="Homepage.html">HREDD</a>
      <span className="sep">/</span>
      <a href="Articles.html">Articles</a>
      <span className="sep">/</span>
      <span style={{ color: 'var(--ink)' }}>Analysis · April 2026</span>
    </div>
  );
}

function Mast() {
  return (
    <header className="art-mast">
      <div className="eyebrow">Analysis · 18 April 2026</div>
      <h1>When the Supply Chain Speaks Back</h1>
      <p className="deck">
        Germany's Lieferkettengesetz promised accountability for workers
        half a world away. Three years on, the workers it was written for
        tell a different story.
      </p>
      <div className="byline">
        <span className="author">By Vir Mehta</span>
        <span className="sep">/</span>
        <span>Reporting from Tiruppur, Tamil Nadu</span>
        <span className="sep">/</span>
        <span>22 min read</span>
        <span className="sep">/</span>
        <span>Issued 18 April 2026</span>
      </div>
    </header>
  );
}

function HeroFigure() {
  return (
    <figure className="art-figure">
      <div className="frame"><span className="cap">PHOTOGRAPH · TIRUPPUR, TAMIL NADU · APRIL 2026</span></div>
      <figcaption className="credit">
        A garment unit in Tiruppur at 04:30. The morning shift waits at the
        gate before the supervisor arrives with the day's order. <em>Photograph by Hema Sankar for HREDD.</em>
      </figcaption>
    </figure>
  );
}

function Article() {
  return (
    <article className="article">
      <p>
        On a Tuesday morning in March, in a single-storey unit on the
        outskirts of Tiruppur, a forewoman named Selvi sat down with a
        stack of attendance registers and a German legal questionnaire,
        translated into Tamil by an NGO in Coimbatore. The questionnaire
        had thirty-eight items. It asked, among other things, whether her
        unit's complaint mechanism was accessible, whether workers had
        been informed of their rights, and whether there had been any
        instances of forced or child labour in the previous twelve months.
      </p>
      <p>
        Selvi had not, when this conversation began, heard of the law that
        the questionnaire claimed to enforce. By the end of an hour, she
        had a serviceable summary of it. She also had a clearer picture
        than most German compliance officers of how the law's provisions,
        translated through a chain of buyers, sub-buyers, agents, and
        sub-contractors, finally landed on a shop floor in southern India:
        as a printed form, in the wrong language, asking the wrong person.
      </p>

      <h2><span className="num">I</span>The shape of the obligation</h2>
      <p>
        The Lieferkettensorgfaltspflichtengesetz, almost universally
        shortened to LkSG, requires large German enterprises to identify
        and address human-rights and environmental risks in their direct
        supply chains. The statute is procedural where international
        soft-law instruments are aspirational, and it is granular where
        existing German corporate law is silent. It also stops, in
        practical terms, at the Tier-1 supplier. Below that, the obligation
        thins to vanishing.
      </p>
      <p>
        It is a feature of the Act, not a bug, that the workers in
        Tiruppur are not its addressee. The Act addresses the German
        buyer. Its theory of change is that the buyer, properly motivated
        by fines and reputational risk, will pull contractual levers that
        improve conditions downstream. The Act trusts the contract. It
        does not, by design, talk to the worker.
      </p>

      <blockquote>
        The law was written in a language none of us speak, by people who
        have never visited our floor, about a chain of contracts we are at
        the wrong end of.
        <cite>— Forewoman, Tiruppur, March 2026</cite>
      </blockquote>

      <h2><span className="num">II</span>What the audits find</h2>
      <p>
        Three full reporting cycles have now been completed under the LkSG.
        The Bundesamt für Wirtschaft und Ausfuhrkontrolle, BAFA, reports a
        compliance rate above ninety per cent for in-scope companies.
        Almost all in-scope companies file. Almost all in-scope companies
        report a satisfactory or near-satisfactory finding. Almost no
        in-scope companies have been fined.
      </p>
      <p>
        Worker testimony, gathered by our editors and partner organisations
        across Tamil Nadu, São Paulo, and Katanga Province, suggests that
        most workers do not know the Act exists, much less how to access
        its grievance mechanism. The complaints that have reached BAFA
        have, with notable exceptions, been brought by European NGOs
        acting on behalf of unnamed complainants in supplier countries.
      </p>

      <figure className="inline-fig">
        <div className="frame"><span className="cap">FIGURE · BAFA COMPLAINTS BY ORIGIN, 2023–2025</span></div>
        <figcaption className="meta">Source: BAFA annual statistics, computed by HREDD. <em>Of 314 complaints received, 11 originated from named complainants in supplier countries.</em></figcaption>
      </figure>

      <h2><span className="num">III</span>The middle of the chain</h2>
      <p>
        What our reporting has tried to do, in this issue and in the four
        that came before it, is to look at the middle of the chain. Not
        the boardroom in Stuttgart and not the cutting floor in Tiruppur,
        but the broker in Ho Chi Minh City, the auditor flying in from
        Mumbai, the freight forwarder in Hamburg. It is in this middle
        that the Act's claims about due diligence either become real or
        evaporate.
      </p>
      <p>
        The findings are uneven, and they are local. There are buyer-side
        compliance teams that take the work seriously and have, in
        documented cases, used the Act to refuse orders that earlier
        regimes would have allowed. There are also auditors who continue
        to certify factories they have never entered, and grievance
        mechanisms that route complaints to the very supervisors the
        complaint concerns.
      </p>

      <h2><span className="num">IV</span>What a better law would do</h2>
      <p>
        The most consistent recommendation that has emerged from our
        interviews, with both Indian trade-policy lawyers and German
        compliance counsel, is that the next iteration of the Act, and
        the EU Directive that will partly subsume it, must shift its
        addressee. The duty must be owed not only by the buyer to the
        regulator, but to the worker.
      </p>
      <p>
        Whether that shift is politically possible is a separate question.
        It is not technically difficult. It is the question, and the
        answer to it, that the next year of HREDD reporting will pursue.
      </p>
    </article>
  );
}

function Side() {
  return (
    <aside className="side">
      <div className="progress">
        <span>VOL I · NO V</span>
        <span>34% read</span>
      </div>

      <div className="block" style={{ marginTop: 24 }}>
        <div className="label">Laws referenced</div>
        <a className="item" href="Law.html">
          <h5 className="ttl">Lieferkettensorgfaltspflichtengesetz</h5>
          <div className="juris">Germany · 2023<span className="st">In force</span></div>
        </a>
        <a className="item" href="#">
          <h5 className="ttl">Corporate Sustainability Due Diligence Directive</h5>
          <div className="juris">European Union · 2024<span className="st">In force</span></div>
        </a>
      </div>

      <div className="block">
        <div className="label">Continue reading</div>
        <a className="item article-item" href="#">
          <div className="cat">Field report</div>
          <h5 className="ttl">Cobalt, Cabinets, and the Limits of Self-Audit</h5>
          <div className="by">Adaeze Nwosu · 14 min</div>
        </a>
        <a className="item article-item" href="#">
          <div className="cat">Interview</div>
          <h5 className="ttl">Ratna Ramaiah on the Quiet Drafting of CSDDD</h5>
          <div className="by">Editors · 9 min</div>
        </a>
        <a className="item article-item" href="#">
          <div className="cat">Commentary</div>
          <h5 className="ttl">Against the Universal Buyer</h5>
          <div className="by">Lucas Pereira · 7 min</div>
        </a>
      </div>

      <div className="block">
        <div className="label">Cite this article</div>
        <p style={{ fontFamily: 'var(--serif)', fontSize: 14, lineHeight: 1.5, color: 'var(--ink-2)', margin: 0 }}>
          Mehta, V. <em>When the Supply Chain Speaks Back.</em> HREDD,
          18 April 2026.{' '}
          <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-3)' }}>
            hredd.org/articles/supply-chain-speaks-back
          </span>
        </p>
      </div>
    </aside>
  );
}

function Bio() {
  return (
    <section className="bio">
      <div className="avatar">VM</div>
      <div>
        <div className="label">About the author</div>
        <h3>Vir Mehta</h3>
        <p>
          Vir Mehta is the founding editor of HREDD. He has reported on
          labour, supply chains, and trade policy for the last twelve years,
          most recently from Bengaluru and Berlin. His field work in this
          piece was supported by a grant from the Centre for Responsible
          Business.
        </p>
        <span className="more">More from this author →</span>
      </div>
    </section>
  );
}

function Disclaimer() {
  return (
    <div className="disclaimer">
      <div className="label">Editorial disclosure</div>
      <p style={{ margin: 0, maxWidth: 720, marginInline: 'auto' }}>
        hredd.org is an independent publication with no affiliation with
        any organisation, public or private. The views contained herein
        are personal. hredd.org is not funded by any organisation.
        Corrections may be sent to{' '}
        <a href="mailto:corrections@hredd.org" style={{ color: 'var(--accent)' }}>corrections@hredd.org</a>.
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <span>© 2026 HREDD · Built with care from Noida, India · contact@hredd.org</span>
      <div className="links">
        <a href="#">Methodology</a>
        <a href="#">Republish</a>
        <a href="#">RSS · Articles feed</a>
      </div>
    </footer>
  );
}

function Page() {
  return (
    <div className="page">
      <TopStrip />
      <Nav />
      <Crumb />
      <Mast />
      <HeroFigure />
      <div className="body-grid">
        <Article />
        <div className="v"></div>
        <Side />
      </div>
      <Bio />
      <Disclaimer />
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Page />);

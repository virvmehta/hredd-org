const data = JSON.parse(document.getElementById('page-data').textContent);
const law = data.law;

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

function Crumb() {
  return (
    <div className="crumb">
      <a href="Homepage.html">HREDD</a>
      <span className="sep">/</span>
      <a href="Tracker.html">The Tracker</a>
      <span className="sep">/</span>
      <span style={{ color: 'var(--ink)' }}>Germany · LkSG</span>
    </div>
  );
}

function Mast() {
  return (
    <section className="law-mast">
      <div>
        <div className="eyebrow">Germany · 2023 · In force</div>
        <h1>
          Lieferketten&shy;sorgfalts&shy;pflichten&shy;gesetz
          <span className="native">Act on Corporate Due Diligence Obligations in Supply Chains · LkSG</span>
        </h1>
        <p className="deck">{law.deck}</p>
        <div className="meta-line">
          <span className="pip"></span>
          <span>Enacted 1 Jan 2023</span>
          <span className="sep">/</span>
          <span>Extended to ≥ 1,000 employees in 2024</span>
          <span className="sep">/</span>
          <span>Last amended Mar 2026</span>
        </div>
      </div>
      <div className="v"></div>
      <aside className="facts">
        <div className="label">Quick facts</div>
        <dl>
          <dt>Status</dt>
          <dd className="status">{law.status}</dd>
          <dt>Jurisdiction</dt>
          <dd>{law.jurisdiction}</dd>
          <dt>Enacted</dt>
          <dd>{law.year}<span className="small">In force since 1 January</span></dd>
          <dt>Scope</dt>
          <dd>{law.scope}</dd>
          <dt>Enforcement</dt>
          <dd>BAFA<span className="small">{law.enforcement}</span></dd>
          <dt>Maximum penalty</dt>
          <dd>{law.penalty}</dd>
        </dl>
      </aside>
    </section>
  );
}

function Article() {
  return (
    <article className="article">
      <h2>Overview</h2>
      <p>
        <span className="lead-letter">T</span>he Lieferkettensorgfaltspflichtengesetz, almost universally
        shortened to LkSG by those who must comply with it, is the first
        binding statute in the German legal system to extend a private
        company's obligations beyond its own four walls and into the
        operations of its suppliers. From January 2023 it bound enterprises
        with more than three thousand employees domiciled in Germany; the
        threshold dropped to one thousand at the start of 2024, and a
        further extension into the small and medium tier has been under
        cabinet review since the autumn.
      </p>
      <p>
        The Act is, in form, a hybrid. It is procedural where international
        soft-law instruments are aspirational, and it is granular where
        existing German corporate law is silent. It does not create a new
        cause of action for affected workers, nor does it grant them
        standing to sue in the German courts. Instead, it concentrates
        enforcement in a single federal agency, the Bundesamt für
        Wirtschaft und Ausfuhrkontrolle, and equips it with the power to
        levy fines that are large by the standards of European supply-chain
        legislation but, as the field reports collected in our tracker
        suggest, vanishingly rare in practice.
      </p>
      <p>
        For the worker in Tiruppur or the cobalt processor in Lubumbashi,
        the LkSG is therefore best read not as a remedy but as a
        documentation regime: a framework that compels the German buyer to
        write down what it knows, and what it has chosen not to know, about
        the labour conditions that produce its goods.
      </p>

      <h2><span className="num">II</span>Key provisions</h2>
      <ol className="provisions">
        <li>
          <div>
            <h4>Risk analysis, conducted annually</h4>
            <p>
              Companies must perform a documented risk analysis of their
              own operations and direct suppliers at least once per year,
              and ad hoc when a substantiated complaint is received.
            </p>
          </div>
        </li>
        <li>
          <div>
            <h4>Preventive measures and codes of conduct</h4>
            <p>
              Where risks are identified, the company must adopt
              preventive measures, including supplier training, contractual
              assurances, and where appropriate, audits.
            </p>
          </div>
        </li>
        <li>
          <div>
            <h4>Remediation in the company's own operations</h4>
            <p>
              If a violation occurs in the company's own operations,
              immediate remedial action is required. For direct suppliers
              the obligation is to take action; for indirect suppliers, only
              upon substantiated knowledge.
            </p>
          </div>
        </li>
        <li>
          <div>
            <h4>Grievance mechanism, accessible to non-employees</h4>
            <p>
              An internal complaint procedure must be established that is
              accessible to persons in the supply chain, including those
              outside the employment relationship of the German company.
            </p>
          </div>
        </li>
        <li>
          <div>
            <h4>Annual public reporting to BAFA</h4>
            <p>
              An annual report is filed with BAFA and published. Failure to
              file, or filing of a deficient report, is itself a fineable
              offence under the Act.
            </p>
          </div>
        </li>
      </ol>

      <blockquote>
        The text says due diligence; the practice is desk research. Most of
        what BAFA receives is a compliance product, not a finding of fact.
        <cite>— Ratna Ramaiah, in a 2025 interview with this journal</cite>
      </blockquote>

      <h2><span className="num">III</span>How it has worked in practice</h2>
      <p>
        Three full reporting cycles have now been completed under the LkSG,
        and the empirical record is mixed. BAFA's own statistics show a
        compliance rate above ninety per cent for in-scope companies, but
        the agency has confirmed only a handful of substantive
        investigations and a still smaller number of fines.
      </p>
      <p>
        Worker testimony from supplier countries, gathered by our editors
        and partner organisations across Tamil Nadu, Sao Paulo, and the
        Katanga Province, suggests that most workers do not know the Act
        exists, much less how to access its grievance mechanism. The few
        complaints that have reached BAFA have, with notable exceptions,
        been brought by European NGOs acting on behalf of unnamed
        complainants in supplier countries.
      </p>

      <h2><span className="num">IV</span>Timeline</h2>
      <div className="timeline">
        <div className="tl-row">
          <div className="yr">2016</div>
          <p className="what">National Action Plan for Business and Human Rights adopted; voluntary in scope.</p>
        </div>
        <div className="tl-row">
          <div className="yr">2020</div>
          <p className="what">Government monitoring concludes that fewer than one in five large companies meets the NAP's voluntary expectations.</p>
        </div>
        <div className="tl-row">
          <div className="yr">JUN 2021</div>
          <p className="what">Bundestag passes the LkSG with cross-party support after a two-year drafting process.</p>
        </div>
        <div className="tl-row">
          <div className="yr">JAN 2023</div>
          <p className="what">Act enters into force for companies with ≥ 3,000 employees.</p>
        </div>
        <div className="tl-row">
          <div className="yr">JAN 2024</div>
          <p className="what">Threshold lowered to ≥ 1,000 employees, expanding scope to roughly 4,800 companies.</p>
        </div>
        <div className="tl-row">
          <div className="yr">MAR 2026</div>
          <p className="what">Amendment introducing alignment with the EU CSDDD and an extended grievance-mechanism standard.</p>
        </div>
      </div>

      <h2><span className="num">V</span>Open questions</h2>
      <p>
        The principal unresolved question is one of jurisdictional reach.
        The Act binds the German parent; it does not bind the Tier-2
        subcontractor in Bangladesh or the labour-supply agent in the
        Persian Gulf. The agency has consistently declined to read
        "substantiated knowledge" expansively, and the result has been a
        compliance regime that the very workers it names rarely
        encounter.
      </p>
      <p>
        Whether the EU Corporate Sustainability Due Diligence Directive,
        as transposed into German law, will close that gap is the subject
        of our next field report.
      </p>
    </article>
  );
}

function Side() {
  return (
    <aside className="side">
      <div className="block">
        <div className="label">Related laws</div>
        <a className="item" href="#">
          <h5 className="ttl">Loi de Vigilance</h5>
          <div className="juris">France · 2017<span className="st">In force</span></div>
        </a>
        <a className="item" href="#">
          <h5 className="ttl">Corporate Sustainability Due Diligence Directive</h5>
          <div className="juris">European Union · 2024<span className="st">In force</span></div>
        </a>
        <a className="item" href="#">
          <h5 className="ttl">Åpenhetsloven · Transparency Act</h5>
          <div className="juris">Norway · 2022<span className="st">In force</span></div>
        </a>
      </div>

      <div className="block">
        <div className="label">From our reporting</div>
        <a className="item article-item" href="#">
          <div className="cat">Analysis</div>
          <h5 className="ttl">When the Supply Chain Speaks Back</h5>
          <div className="by">Vir Mehta · 22 min</div>
        </a>
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
      </div>

      <div className="block">
        <div className="label">Cite this entry</div>
        <p style={{ fontFamily: 'var(--serif)', fontSize: 15, lineHeight: 1.5, color: 'var(--ink-2)', margin: 0 }}>
          HREDD Editors. <em>Lieferkettensorgfaltspflichtengesetz.</em>{' '}
          HREDD Tracker, accessed April 2026.{' '}
          <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink-3)' }}>
            hredd.org/tracker/lksg
          </span>
        </p>
      </div>
    </aside>
  );
}

function Footer() {
  return (
    <footer>
      <span>© 2026 HREDD · Built with care from Noida, India · contact@hredd.org</span>
      <div className="links">
        <a href="#">Methodology</a>
        <a href="#">Suggest a correction</a>
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
      <Crumb />
      <Mast />
      <div className="body-grid">
        <Article />
        <div className="v"></div>
        <Side />
      </div>
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Page />);

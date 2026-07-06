export const A3_TO_NUM = {
  AUT: 40, BEL: 56, BGR: 100, HRV: 191, CYP: 196, CZE: 203, DNK: 208,
  EST: 233, FIN: 246, FRA: 250, DEU: 276, GRC: 300, HUN: 348, IRL: 372,
  ITA: 380, LVA: 428, LTU: 440, LUX: 442, MLT: 470, NLD: 528, POL: 616,
  PRT: 620, ROU: 642, SVK: 703, SVN: 705, ESP: 724, SWE: 752,
  NOR: 578, CHE: 756, GBR: 826, USA: 840, CAN: 124, AUS: 36,
  JPN: 392, KOR: 410
};

const EU_A3 = [
  "AUT", "BEL", "BGR", "HRV", "CYP", "CZE", "DNK", "EST", "FIN", "FRA",
  "DEU", "GRC", "HUN", "IRL", "ITA", "LVA", "LTU", "LUX", "MLT", "NLD",
  "POL", "PRT", "ROU", "SVK", "SVN", "ESP", "SWE"
];

function lawCodesA3(law) {
  return law.countryCodes || (law.countryCode ? [law.countryCode] : []);
}

export function geoIds(law) {
  return lawCodesA3(law)
    .map((c) => A3_TO_NUM[c])
    .filter((n) => n !== undefined);
}

export function clientLaws(laws) {
  return laws.map((l) => ({
    slug: l.slug,
    name: l.name,
    short: l.shortName || l.name,
    jur: l.jurisdiction,
    status: l.status,
    group: l.statusType,
    latest: l.tableUpdateText,
    geo: geoIds(l)
  }));
}

export function buildMovements(laws, limit = 6) {
  return [...laws]
    .sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0))
    .slice(0, limit)
    .map((l) => ({
      slug: l.slug,
      tag: l.shortName || l.name,
      date: new Date(l.lastUpdated).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric"
      }),
      latest: l.tableUpdateText
    }));
}

const isEuLaw = (law) => law.region === "European Union";

export function buildBuyers(laws) {
  const defs = [
    { id: "eu", label: "European Union (any member)", a3: null },
    { id: "de", label: "Germany", a3: "DEU" },
    { id: "fr", label: "France", a3: "FRA" },
    { id: "nl", label: "Netherlands", a3: "NLD" },
    { id: "no", label: "Norway", a3: "NOR" },
    { id: "ch", label: "Switzerland", a3: "CHE" },
    { id: "uk", label: "United Kingdom", a3: "GBR" },
    { id: "us", label: "United States", a3: "USA" },
    { id: "ca", label: "Canada", a3: "CAN" },
    { id: "au", label: "Australia", a3: "AUS" },
    { id: "jp", label: "Japan", a3: "JPN" },
    { id: "kr", label: "South Korea", a3: "KOR" }
  ];

  return defs.map((d) => {
    let slugs;
    if (d.id === "eu") {
      slugs = laws.filter(isEuLaw).map((l) => l.slug);
    } else {
      slugs = laws
        .filter((l) => {
          if (isEuLaw(l)) return EU_A3.includes(d.a3);
          return lawCodesA3(l).includes(d.a3);
        })
        .map((l) => l.slug);
    }
    return { id: d.id, label: d.label, laws: slugs };
  });
}

export function trackedGeoIds(laws) {
  const ids = new Set();
  for (const law of laws) geoIds(law).forEach((n) => ids.add(n));
  return [...ids];
}

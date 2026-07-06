import { geoEqualEarth, geoPath } from 'd3-geo';
import * as topojson from 'topojson-client';
import world from 'world-atlas/countries-110m.json' with { type: 'json' };

/**
 * Natural Earth 110m names mapped to ISO 3166-1 alpha-3 codes for every
 * country the tracker can highlight. Countries absent from this map
 * render as non-interactive background geography.
 */
const NAME_TO_A3 = {
  'Germany': 'DEU', 'France': 'FRA', 'Netherlands': 'NLD', 'Norway': 'NOR',
  'Switzerland': 'CHE', 'United Kingdom': 'GBR', 'United States of America': 'USA',
  'Canada': 'CAN', 'Australia': 'AUS', 'Japan': 'JPN', 'South Korea': 'KOR',
  'Austria': 'AUT', 'Belgium': 'BEL', 'Bulgaria': 'BGR', 'Croatia': 'HRV',
  'Cyprus': 'CYP', 'Czechia': 'CZE', 'Denmark': 'DNK', 'Estonia': 'EST',
  'Finland': 'FIN', 'Greece': 'GRC', 'Hungary': 'HUN', 'Ireland': 'IRL',
  'Italy': 'ITA', 'Latvia': 'LVA', 'Lithuania': 'LTU', 'Luxembourg': 'LUX',
  'Malta': 'MLT', 'Poland': 'POL', 'Portugal': 'PRT', 'Romania': 'ROU',
  'Slovakia': 'SVK', 'Slovenia': 'SVN', 'Spain': 'ESP', 'Sweden': 'SWE'
};

const DISPLAY_NAME = {
  'United States of America': 'United States',
  'Czechia': 'Czech Republic'
};

const WIDTH = 960;
const HEIGHT = 470;

/**
 * Build static SVG path data for the tracker world map, marking every
 * country that carries at least one tracked law. Rendered at build time
 * so the map ships inside the static HTML, never fetched client-side.
 */
export function buildWorldMap(laws) {
  const lawCodes = new Set();
  for (const law of laws) {
    const codes = law.countryCodes || (law.countryCode ? [law.countryCode] : []);
    for (const c of codes) lawCodes.add(c);
  }

  const countries = topojson.feature(world, world.objects.countries).features
    .filter((f) => f.properties?.name !== 'Antarctica');

  const projection = geoEqualEarth();
  projection.fitSize([WIDTH, HEIGHT], { type: 'FeatureCollection', features: countries });
  const path = geoPath(projection).digits(1);

  const paths = countries.map((f) => {
    const neName = f.properties?.name || '';
    const code = NAME_TO_A3[neName] || null;
    const hasLaws = code ? lawCodes.has(code) : false;
    return {
      d: path(f),
      code: hasLaws ? code : null,
      name: DISPLAY_NAME[neName] || neName,
      hasLaws
    };
  });

  return { paths, width: WIDTH, height: HEIGHT };
}

/**
 * Build the lookup that the client-side click handler uses to populate
 * the country detail panel. Laws are stored once in a flat list and
 * each country references them by index, so EU-wide laws are not
 * duplicated across all twenty-seven member state entries.
 */
export function buildCountryLawIndex(laws) {
  const list = [];
  const byCountry = {};
  const indexOfLaw = new Map();

  for (const law of laws) {
    const codes = law.countryCodes || (law.countryCode ? [law.countryCode] : []);
    if (!codes.length) continue;
    let idx = indexOfLaw.get(law.slug);
    if (idx === undefined) {
      idx = list.length;
      indexOfLaw.set(law.slug, idx);
      list.push({
        slug: law.slug,
        name: law.name,
        status: law.status,
        statusType: law.statusType,
        summary: law.oneLineSummary || ''
      });
    }
    for (const code of codes) {
      if (!byCountry[code]) byCountry[code] = [];
      byCountry[code].push(idx);
    }
  }

  return { laws: list, byCountry };
}

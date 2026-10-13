/**
 * Dataset schema for the Regulated Trade Index, shared by /trade/ and
 * /methodology/ so the two pages can never describe the dataset differently.
 *
 * Only the published data files are openly licensed (CC BY 4.0, see LICENSE),
 * so the licence here refers to those files and not to the site.
 *
 * `sample_data` is honoured deliberately: if the published files are ever the
 * illustrative sample rather than live Comtrade figures, the schema says so
 * instead of presenting sample numbers as real statistics.
 */
export function buildDatasetSchema(data, scope, pageUrl) {
  const sample = data.sample_data === true;
  // The projection runs across the years in each country's series (2024 to
  // 2030 at present), which is what temporalCoverage should state.
  const years = Object.values(data.countries || {})
    .flatMap((c) => (c.series || []).map((s) => s.year))
    .filter((y) => Number.isInteger(y))
    .sort((a, b) => a - b);
  const temporal = years.length ? `${years[0]}/${years[years.length - 1]}` : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: sample
      ? 'Regulated Trade Index (illustrative sample data)'
      : 'Regulated Trade Index: HREDD-regulated export exposure by country',
    description: sample
      ? 'Illustrative sample data for the Regulated Trade Index, published while the live pipeline run is pending. Not real trade statistics.'
      : 'How much of each tracked producing country\'s exports falls within the scope of human rights and environmental due diligence regimes, by destination market, product chapter and enforcement mechanism. Built from UN Comtrade mirror statistics, which use what buyer markets reported importing rather than what the origin country reported exporting.',
    url: pageUrl,
    version: data.dataset_version,
    dateModified: data.generated,
    ...(temporal ? { temporalCoverage: temporal } : {}),
    inLanguage: 'en-GB',
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creditText: 'hredd.org',
    creator: {
      '@type': 'Organization',
      name: 'hredd.org',
      url: 'https://hredd.org'
    },
    publisher: {
      '@type': 'Organization',
      name: 'hredd.org',
      url: 'https://hredd.org'
    },
    ...(data.sources?.length ? { citation: data.sources } : {}),
    measurementTechnique: 'Mirror statistics from UN Comtrade, decomposed by destination market, HS chapter and enforcement mechanism, with published coverage bands for regimes whose scope depends on buyer characteristics.',
    variableMeasured: [
      { '@type': 'PropertyValue', name: 'Exposed export value', unitText: 'USD' },
      { '@type': 'PropertyValue', name: 'Exposed share of tracked-market exports', unitText: 'fraction' }
    ],
    ...(scope?.mapping_version ? {
      includedInDataCatalog: {
        '@type': 'DataCatalog',
        name: `hredd.org law-scope mapping v${scope.mapping_version}`,
        url: 'https://hredd.org/methodology/'
      }
    } : {}),
    distribution: [
      {
        '@type': 'DataDownload',
        name: 'Trade exposure dataset (JSON)',
        encodingFormat: 'application/json',
        contentUrl: 'https://hredd.org/data/trade-exposure.json'
      },
      {
        '@type': 'DataDownload',
        name: 'Trade exposure dataset (CSV)',
        encodingFormat: 'text/csv',
        contentUrl: 'https://hredd.org/data/trade-exposure.csv'
      },
      {
        '@type': 'DataDownload',
        name: 'Law scope mapping (JSON)',
        encodingFormat: 'application/json',
        contentUrl: 'https://hredd.org/data/law-scope.json'
      }
    ]
  };
}

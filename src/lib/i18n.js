// Translation dictionary. Kept as plain data so a fluent reviewer can correct
// strings without touching component code. Legal facts (exact dates, penalty
// figures, statutory thresholds) are deliberately NOT translated here; they
// stay in English wherever they appear, so a translation can never garble a
// compliance fact. Only chrome and explanatory prose are localised.
//
// STATUS: the Bangla ('bn') strings are a first machine-assisted draft and must
// be reviewed by a fluent speaker before this locale is promoted beyond a
// pilot. Marked draft in the language switcher until then.

export const LOCALES = ['en', 'bn'];
export const DEFAULT_LOCALE = 'en';
export const LOCALE_LABEL = { en: 'English', bn: 'বাংলা' };
export const LOCALE_DRAFT = { en: false, bn: true };

// Which locale a path belongs to, and the same path in the other locale.
export function localeOf(pathname) {
  return pathname.startsWith('/bn/') || pathname === '/bn' ? 'bn' : 'en';
}
export function pathInLocale(pathname, locale) {
  const stripped = pathname.replace(/^\/bn(?=\/|$)/, '') || '/';
  return locale === 'en' ? stripped : ('/bn' + (stripped === '/' ? '/' : stripped));
}

const DICT = {
  en: {
    'nav.tracker': 'Tracker', 'nav.timeline': 'Timelines', 'nav.trade': 'Trade',
    'nav.buyers': 'Your buyers', 'nav.report': 'Your report', 'nav.articles': 'Articles',
    'nav.about': 'About', 'nav.subscribe': 'Subscribe',
    'nav.search': 'Search laws and articles',
    'foot.sections': 'Sections', 'foot.brand': 'hredd.org',
    'foot.about': 'About', 'foot.methodology': 'Methodology', 'foot.subscribe': 'Subscribe',
    'foot.contact': 'Contact', 'foot.published': 'Published from Noida, India',
    'foot.tradeExposure': 'Trade exposure', 'foot.yourReport': 'Your exposure report',

    'home.kicker': 'A Global South perspective',
    'home.h1': 'The due diligence laws,<br />read from the<br /><em>supplier side</em>',
    'home.standfirst': "Eighteen human rights and environmental due diligence laws now set the terms of trade with the world's largest markets. We track every one of them monthly and explain what each will ask of you.",
    'home.cta.report': 'Get your exposure report',
    'home.cta.tracker': 'Explore the tracker',
    'home.start.kicker': 'Start here',
    'home.start.h2': 'Four steps through <em>the tracker</em>',
    'home.open': 'Open',
    'home.step1.title': 'Track the laws',
    'home.step1.text': 'All eighteen due diligence laws, reviewed monthly against primary sources.',
    'home.step2.title': 'Check your buyers',
    'home.step2.text': 'Pick your buyer countries and see which laws reach those relationships.',
    'home.step3.title': 'Get your exposure report',
    'home.step3.text': 'Answer a few questions for a brief report on your current exposure level.',
    'home.step4.title': "See your country's exposure",
    'home.step4.text': "How much of your country's trade each law will reach by 2030.",
    'home.changelog.kicker': 'Changelog',
    'home.changelog.h2': 'What changed <em>this month</em>',
    'home.changelog.full': 'Full changelog',
    'home.changelog.updated': 'Updated',
    'home.articles.kicker': 'Articles',
    'home.articles.h2': 'Latest <em>analysis</em>',
    'home.articles.all': 'All articles',
    'home.statement': 'These rules are written in Brussels, Washington and Canberra, but they are answered on factory floors in Dhaka, Hanoi and Nairobi. We publish for <em>the businesses that answer them</em>.',
    'home.sub.kicker': 'The monthly digest',
    'home.sub.h2': 'One monthly briefing on <em>everything that moved</em>',
    'home.sub.blurb': 'Each issue covers what changed, what it means for your orders, and what to prepare before your buyers ask.',
    'home.sub.button': 'Subscribe',
    'home.sub.note': 'Monthly · Free · Unsubscribe anytime',
  },
  bn: {
    'nav.tracker': 'ট্র্যাকার', 'nav.timeline': 'সময়রেখা', 'nav.trade': 'বাণিজ্য',
    'nav.buyers': 'আপনার ক্রেতা', 'nav.report': 'আপনার রিপোর্ট', 'nav.articles': 'নিবন্ধ',
    'nav.about': 'পরিচিতি', 'nav.subscribe': 'সাবস্ক্রাইব',
    'nav.search': 'আইন ও নিবন্ধ খুঁজুন',
    'foot.sections': 'বিভাগসমূহ', 'foot.brand': 'hredd.org',
    'foot.about': 'পরিচিতি', 'foot.methodology': 'পদ্ধতি', 'foot.subscribe': 'সাবস্ক্রাইব',
    'foot.contact': 'যোগাযোগ', 'foot.published': 'ভারতের নয়ডা থেকে প্রকাশিত',
    'foot.tradeExposure': 'বাণিজ্য এক্সপোজার', 'foot.yourReport': 'আপনার এক্সপোজার রিপোর্ট',

    'home.kicker': 'একটি গ্লোবাল সাউথ দৃষ্টিভঙ্গি',
    'home.h1': 'ডিউ ডিলিজেন্স আইন,<br />পড়া হয়েছে<br /><em>সরবরাহকারীর দিক থেকে</em>',
    'home.standfirst': 'আঠারোটি মানবাধিকার ও পরিবেশগত ডিউ ডিলিজেন্স আইন এখন বিশ্বের বৃহত্তম বাজারগুলোর সঙ্গে বাণিজ্যের শর্ত নির্ধারণ করছে। আমরা প্রতি মাসে এগুলোর প্রতিটি অনুসরণ করি এবং ব্যাখ্যা করি প্রতিটি আপনার কাছে কী চাইবে।',
    'home.cta.report': 'আপনার এক্সপোজার রিপোর্ট নিন',
    'home.cta.tracker': 'ট্র্যাকার দেখুন',
    'home.start.kicker': 'এখান থেকে শুরু করুন',
    'home.start.h2': 'ট্র্যাকারের <em>চারটি ধাপ</em>',
    'home.open': 'খুলুন',
    'home.step1.title': 'আইনগুলো অনুসরণ করুন',
    'home.step1.text': 'আঠারোটি ডিউ ডিলিজেন্স আইন, প্রতি মাসে মূল উৎসের সঙ্গে মিলিয়ে যাচাই করা।',
    'home.step2.title': 'আপনার ক্রেতা যাচাই করুন',
    'home.step2.text': 'আপনার ক্রেতা দেশগুলো বেছে নিন এবং দেখুন কোন আইনগুলো সেই সম্পর্কে পৌঁছায়।',
    'home.step3.title': 'আপনার এক্সপোজার রিপোর্ট নিন',
    'home.step3.text': 'কয়েকটি প্রশ্নের উত্তর দিন, আপনার বর্তমান এক্সপোজার স্তরের একটি সংক্ষিপ্ত রিপোর্ট পান।',
    'home.step4.title': 'আপনার দেশের এক্সপোজার দেখুন',
    'home.step4.text': '2030 সালের মধ্যে প্রতিটি আইন আপনার দেশের বাণিজ্যের কতটা স্পর্শ করবে।',
    'home.changelog.kicker': 'পরিবর্তনের নথি',
    'home.changelog.h2': 'এই মাসে <em>যা পরিবর্তিত হয়েছে</em>',
    'home.changelog.full': 'সম্পূর্ণ নথি',
    'home.changelog.updated': 'হালনাগাদ',
    'home.articles.kicker': 'নিবন্ধ',
    'home.articles.h2': 'সর্বশেষ <em>বিশ্লেষণ</em>',
    'home.articles.all': 'সব নিবন্ধ',
    'home.statement': 'এই নিয়মগুলো লেখা হয় ব্রাসেলস, ওয়াশিংটন ও ক্যানবেরায়, কিন্তু এগুলোর জবাব দিতে হয় ঢাকা, হ্যানয় ও নাইরোবির কারখানার মেঝেতে। আমরা প্রকাশ করি <em>সেই ব্যবসাগুলোর জন্য যারা এগুলোর জবাব দেয়</em>।',
    'home.sub.kicker': 'মাসিক সংক্ষিপ্তসার',
    'home.sub.h2': 'যা কিছু ঘটেছে তার <em>একটি মাসিক ব্রিফিং</em>',
    'home.sub.blurb': 'প্রতিটি সংখ্যা জানায় কী পরিবর্তিত হয়েছে, আপনার অর্ডারের জন্য এর অর্থ কী, এবং আপনার ক্রেতারা জিজ্ঞাসা করার আগে কী প্রস্তুত করতে হবে।',
    'home.sub.button': 'সাবস্ক্রাইব',
    'home.sub.note': 'মাসিক · বিনামূল্যে · যেকোনো সময় আনসাবস্ক্রাইব',
  },
};

// Look up a key for a locale, falling back to English if a string is not yet
// translated, so a missing Bangla string never renders blank.
export function t(locale, key) {
  return (DICT[locale] && DICT[locale][key]) || DICT.en[key] || key;
}

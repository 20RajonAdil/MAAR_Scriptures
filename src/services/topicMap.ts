// bible-api.com only resolves references, not keyword search, and Sefaria's
// search index does not always align cleanly with plain-English topic words.
// This curated map gives MAAR a small, honest starting set of well-known
// reference passages per topic, so a Bible/Torah "topic" search returns real,
// attributed verses instead of nothing. It is intentionally small — extend it
// in this file as more topics are verified. Quran search does NOT use this
// map; it queries the live Al Quran Cloud search API directly.
export const BIBLE_TOPIC_REFS: Record<string, string[]> = {
  pork: ['Leviticus 11:7'],
  food: ['Genesis 1:29'],
  alcohol: ['Proverbs 20:1', 'Ephesians 5:18'],
  marriage: ['Genesis 2:24', 'Ephesians 5:25'],
  prayer: ['Matthew 6:9', 'Philippians 4:6'],
  fasting: ['Matthew 6:16'],
  charity: ['2 Corinthians 9:7', 'Proverbs 19:17'],
  creation: ['Genesis 1:1'],
  adam: ['Genesis 2:7'],
  moses: ['Exodus 3:10'],
  jesus: ['John 3:16'],
  abraham: ['Genesis 12:1'],
  forgiveness: ['Matthew 6:14'],
  afterlife: ['John 14:2'],
  justice: ['Micah 6:8'],
  family: ['Ephesians 6:1'],
};

export const TORAH_TOPIC_REFS: Record<string, string[]> = {
  food: ['Genesis 1.29'],
  pork: ['Leviticus 11.7'],
  marriage: ['Genesis 2.24'],
  creation: ['Genesis 1.1'],
  adam: ['Genesis 2.7'],
  moses: ['Exodus 3.10'],
  abraham: ['Genesis 12.1'],
  justice: ['Deuteronomy 16.20'],
  family: ['Exodus 20.12'],
};

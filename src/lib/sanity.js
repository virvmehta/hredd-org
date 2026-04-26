import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});

export function renderPortableText(blocks) {
  if (!blocks || !Array.isArray(blocks)) return '';
  return blocks.map(block => {
    if (block._type === 'block') {
      const children = block.children || [];
      const text = children.map(child => {
        let t = child.text || '';
        if (child.marks && child.marks.includes('em')) t = `<em>${t}</em>`;
        if (child.marks && child.marks.includes('strong')) t = `<strong>${t}</strong>`;
        return t;
      }).join('');
      const style = block.style || 'normal';
      if (style === 'h2') return `<h2 class="article-h2">${text}</h2>`;
      if (style === 'pullQuote') return `<div class="pull-quote"><blockquote><p>${text}</p></blockquote></div>`;
      return `<p class="article-p">${text}</p>`;
    }
    if (block._type === 'callout') {
      return `<div class="callout-block"><span class="callout-label">${block.label || ''}</span><p>${block.body || ''}</p></div>`;
    }
    if (block._type === 'sectionBreak') {
      return `<div class="section-break"><div class="section-break-line"></div><span>· · ·</span><div class="section-break-line"></div></div>`;
    }
    if (block._type === 'dataBlock') {
      return `<div class="data-block">
        <div class="data-stat"><span class="data-number">${block.stat1number || ''}</span><span class="data-label">${block.stat1label || ''}</span></div>
        <div class="data-stat"><span class="data-number">${block.stat2number || ''}</span><span class="data-label">${block.stat2label || ''}</span></div>
        <div class="data-stat"><span class="data-number">${block.stat3number || ''}</span><span class="data-label">${block.stat3label || ''}</span></div>
      </div>`;
    }
    return '';
  }).join('');
}

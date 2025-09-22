import DOMPurify from 'dompurify';

// Hook : filtre le style inline sur les <span>
DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
  if (data.attrName !== 'style') return;        // on ne touche qu'à style
  if (!node || node.nodeName.toLowerCase() !== 'span') {
    data.keepAttr = false;                     // style interdit sur les autres tags
    return;
  }

  // Propriétés CSS autorisées
  const allowedProps = ['background-color', 'color'];

  // Garde uniquement les propriétés sûres
  const safeStyles = data.attrValue
    .split(';') // sépare chaque propriété
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => {
      const [propRaw, ...valParts] = s.split(':'); // On sépare le nom et la valeur de la propriété
      if (!propRaw || valParts.length === 0) return null;

      const prop = propRaw.trim().toLowerCase();
      const val = valParts.join(':').trim(); // On reconstitue la valeur au cas où elle contient des ':'

      // rejette les valeurs dangereuses
      if (/url\s*\(|expression|javascript:|!important/i.test(val)) return null;
      if (!allowedProps.includes(prop)) return null;

      return `${prop}: ${val}`;
    })
    .filter(Boolean);

  data.attrValue = safeStyles.join('; ');
  if (!data.attrValue) data.keepAttr = false;  // supprime si vide
});

export default function sanitizeHtmlSoft(rawHtml) {
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'p','br','h1','h2','h3','h4','h5','h6',
      'strong','em','b','i','u','del','code','pre',
      'ul','ol','li','blockquote','hr',
      'a','img','span','table','thead','tbody','tr','th','td'
    ],
    ALLOWED_ATTR: [
      'href','title','target','rel', // pour <a>
      'src','alt','width','height',   // pour <img>
      'class',                       // pour <code>
      'style'                        // autorisé mais filtré par le hook
    ],
    FORBID_ATTR: ['onerror','onclick','onload','srcdoc','formaction','action'],
    FORBID_TAGS: ['script','iframe','embed','object','link','meta','form','video','audio']
  });
}

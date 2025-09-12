import DOMPurify from 'dompurify';

export default function sanitizeHtmlSoft(rawHtml) {
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'p','br','h1','h2','h3','h4','h5','h6',
      'strong','em','b','i','u','del','code','pre',
      'ul','ol','li','blockquote','hr',
      'a','img','span','table','thead','tbody','tr','th','td'
    ],
    ALLOWED_ATTR: {
      a: ['href','title','target','rel'],
      img: ['src','alt','title','width','height'],
      code: ['class'],
      span: ['style']
    },
    FORBID_ATTR: ['onerror','onclick','onload','srcdoc','formaction','action'],
    FORBID_TAGS: ['script','iframe','embed','object','link','style','meta','form','video','audio']
  });
}

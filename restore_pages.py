import glob
import re

html_files = glob.glob('*.html')

# Common replacements to normalize any corrupted tags/words from earlier
tag_fixes = [
    (r'<di\s*v', '<div'),
    (r'</\s*di\s*v>', '</div>'),
    (r'<se\s*ct\s*io\s*n', '<section'),
    (r'</\s*se\s*ct\s*io\s*n>', '</section>'),
    (r'<ar\s*ti\s*cl\s*e', '<article'),
    (r'</\s*ar\s*ti\s*cl\s*e>', '</article>'),
    (r'<he\s*ad\s*er>', '<header>'),
    (r'</\s*he\s*ad\s*er>', '</header>'),
    (r'<ma\s*in', '<main'),
    (r'</\s*ma\s*in>', '</main>'),
    (r'<fo\s*ot\s*er>', '<footer>'),
    (r'</\s*fo\s*ot\s*er>', '</footer>'),
    (r'<na\s*v', '<nav'),
    (r'</\s*na\s*v>', '</nav>'),
    (r'<bu\s*tt\s*on', '<button'),
    (r'</\s*bu\s*tt\s*on>', '</button>'),
    (r'<sp\s*an', '<span'),
    (r'</\s*sp\s*an>', '</span>'),
    (r'<st\s*ro\s*ng>', '<strong>'),
    (r'</\s*st\s*ro\s*ng>', '</strong>'),
    (r'<sm\s*al\s*l>', '<small>'),
    (r'</\s*sm\s*al\s*l>', '</small>'),
    (r'<im\s*g\s*s\s*rc=', '<img src='),
    (r'cl\s*as\s*s=', 'class='),
    (r'hr\s*ef=', 'href='),
    (r'al\s*t=', 'alt='),
    (r'wi\s*dt\s*h=', 'width='),
    (r'he\s*ig\s*ht=', 'height='),
    (r'fe\s*tc\s*hp\s*ri\s*or\s*it\s*y=', 'fetchpriority='),
    (r'lo\s*ad\s*in\s*g=', 'loading='),
    (r'da\s*ta\s*-\s*do\s*na\s*te=', 'data-donate='),
    (r'da\s*ta\s*-\s*de\s*ta\s*il\s*s=', 'data-details='),
    (r'da\s*ta\s*-\s*ev\s*en\s*t=', 'data-event='),
    (r'da\s*ta\s*-\s*fi\s*lt\s*er=', 'data-filter='),
    (r'da\s*ta\s*-\s*ca\s*te\s*go\s*ry=', 'data-category='),
    (r'da\s*ta\s*-\s*se\s*ar\s*ch=', 'data-search='),
    (r'da\s*ta\s*-\s*fo\s*rm=', 'data-form='),
    (r'ro\s*le=', 'role='),
    (r'ar\s*ia\s*-\s*la\s*be\s*l=', 'aria-label='),
    (r'ar\s*ia\s*-\s*ex\s*pa\s*nd\s*ed=', 'aria-expanded='),
    (r'ar\s*ia\s*-\s*va\s*lu\s*en\s*ow=', 'aria-valuenow='),
    (r'ar\s*ia\s*-\s*va\s*lu\s*em\s*in=', 'aria-valuemin='),
    (r'ar\s*ia\s*-\s*va\s*lu\s*em\s*ax=', 'aria-valuemax='),
    (r'st\s*yl\s*e=', 'style='),
    (r'id=', 'id='),
    (r'pl\s*ac\s*eh\s*ol\s*de\s*r=', 'placeholder='),
    (r're\s*qu\s*ir\s*ed', 'required'),
    (r'no\s*va\s*li\s*da\s*te', 'novalidate'),
    (r'de\s*fe\s*r', 'defer'),
    (r'ty\s*pe=', 'type='),
    (r'na\s*me=', 'name='),
]

for filepath in html_files:
    if filepath in ['404.html', 'signin.html', 'register.html', 'donor-dashboard.html', 'admin-dashboard.html']:
        continue
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()

    for pattern, replacement in tag_fixes:
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)

    # Clean up double quotes and spacing in class names
    text = re.sub(r'class="([^"]+)"', lambda m: 'class="' + ' '.join(m.group(1).split()) + '"', text)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

print('Cleaned HTML tags across all pages.')


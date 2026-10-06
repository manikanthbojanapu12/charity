import glob
import re

def clean_html(text):
    # Fix paths
    text = re.sub(r'as\s*se\s*ts\s*/\s*([a-zA-Z0-9_\-\.]+)', lambda m: 'assets/' + m.group(1).replace(' ', ''), text)
    text = re.sub(r'hr\s*ef\s*=\s*"([^"]+)"', lambda m: 'href="' + m.group(1).replace(' ', '') + '"', text)
    text = re.sub(r'sr\s*c\s*=\s*"([^"]+)"', lambda m: 'src="' + m.group(1).replace(' ', '') + '"', text)
    text = re.sub(r'ty\s*pe\s*=\s*"([^"]+)"', lambda m: 'type="' + m.group(1).replace(' ', '') + '"', text)
    text = re.sub(r're\s*l\s*=\s*"([^"]+)"', lambda m: 'rel="' + m.group(1).replace(' ', '') + '"', text)
    text = re.sub(r'na\s*me\s*=\s*"([^"]+)"', lambda m: 'name="' + m.group(1).replace(' ', '') + '"', text)
    text = re.sub(r'co\s*nt\s*en\s*t\s*=\s*"([^"]+)"', lambda m: 'content="' + ' '.join(m.group(1).split()) + '"', text)
    text = re.sub(r'id\s*=\s*"([^"]+)"', lambda m: 'id="' + m.group(1).replace(' ', '') + '"', text)
    text = re.sub(r'ar\s*ia\s*-\s*la\s*be\s*l\s*=\s*"([^"]+)"', lambda m: 'aria-label="' + ' '.join(m.group(1).split()) + '"', text)
    text = re.sub(r'ar\s*ia\s*-\s*ex\s*pa\s*nd\s*ed\s*=\s*"([^"]+)"', lambda m: 'aria-expanded="' + m.group(1).replace(' ', '') + '"', text)
    text = re.sub(r'da\s*ta\s*-\s*do\s*na\s*te\s*=\s*"([^"]+)"', lambda m: 'data-donate="' + m.group(1).replace(' ', '') + '"', text)
    text = re.sub(r'da\s*ta\s*-\s*de\s*ta\s*il\s*s\s*=\s*"([^"]+)"', lambda m: 'data-details="' + m.group(1).replace(' ', '') + '"', text)
    text = re.sub(r'da\s*ta\s*-\s*ev\s*en\s*t\s*=\s*"([^"]+)"', lambda m: 'data-event="' + m.group(1).replace(' ', '') + '"', text)
    text = re.sub(r'da\s*ta\s*-\s*fi\s*lt\s*er\s*=\s*"([^"]+)"', lambda m: 'data-filter="' + ' '.join(m.group(1).split()) + '"', text)
    text = re.sub(r'da\s*ta\s*-\s*ca\s*te\s*go\s*ry\s*=\s*"([^"]+)"', lambda m: 'data-category="' + ' '.join(m.group(1).split()) + '"', text)
    text = re.sub(r'da\s*ta\s*-\s*se\s*ar\s*ch\s*=\s*"([^"]+)"', lambda m: 'data-search="' + ' '.join(m.group(1).split()) + '"', text)
    text = re.sub(r'da\s*ta\s*-\s*fo\s*rm\s*=\s*"([^"]+)"', lambda m: 'data-form="' + m.group(1).replace(' ', '') + '"', text)

    def normalize_style(match):
        value = match.group(1)
        value = re.sub(r'\s+', '', value)
        return 'style="' + value + '"'

    text = re.sub(r'st\s*yl\s*e\s*=\s*"([^"]+)"', normalize_style, text)

    # Restore malformed attribute names that were split by the original corruption.
    text = re.sub(r'\bar\s*ia\s*-\s*la\s*be\s*l\b', 'aria-label', text)
    text = re.sub(r'\bar\s*ia\s*-\s*ex\s*pa\s*nd\s*ed\b', 'aria-expanded', text)
    text = re.sub(r'\bar\s*ia\s*-\s*va\s*lu\s*en\s*ow\b', 'aria-valuenow', text)
    text = re.sub(r'\bar\s*ia\s*-\s*va\s*lu\s*em\s*in\b', 'aria-valuemin', text)
    text = re.sub(r'\bar\s*ia\s*-\s*va\s*lu\s*em\s*ax\b', 'aria-valuemax', text)
    text = re.sub(r'\bar\s*ia\s*-\s*pr\s*op\s*er\s*ty\b', 'aria- property', text)

    # Fix broken tags like <divc la ss=" -> <div class="
    text = re.sub(r'<([a-zA-Z0-9]+)c\s*la\s*ss\s*=', r'<\1 class=', text)
    text = re.sub(r'<ac\s*la\s*ss\s*=', r'<a class=', text)
    text = re.sub(r'<ah\s*re\s*f\s*=', r'<a href=', text)
    text = re.sub(r'<im\s*gs\s*rc\s*=', r'<img src=', text)
    text = re.sub(r'<na\s*va\s*ri\s*a\s*-', r'<nav aria-', text)
    text = re.sub(r'<in\s*pu\s*tc\s*la\s*ss\s*=', r'<input class=', text)
    text = re.sub(r'<ar\s*ti\s*cl\s*ec\s*la\s*ss\s*=', r'<article class=', text)
    text = re.sub(r'<se\s*ct\s*io\s*nc\s*la\s*ss\s*=', r'<section class=', text)
    text = re.sub(r'<di\s*vc\s*la\s*ss\s*=', r'<div class=', text)

    # Fix closing tags like </ sp an> -> </span>
    text = re.sub(r'</\s*([a-zA-Z0-9]+)\s*>', r'</\1>', text)
    text = re.sub(r'</\s*di\s*v>', '</div>', text)
    text = re.sub(r'</\s*sp\s*an>', '</span>', text)
    text = re.sub(r'</\s*st\s*ro\s*ng>', '</strong>', text)
    text = re.sub(r'</\s*sm\s*al\s*l>', '</small>', text)
    text = re.sub(r'</\s*bu\s*tt\s*on>', '</button>', text)
    text = re.sub(r'</\s*se\s*ct\s*io\s*n>', '</section>', text)
    text = re.sub(r'</\s*ar\s*ti\s*cl\s*e>', '</article>', text)
    text = re.sub(r'</\s*he\s*ad\s*er>', '</header>', text)
    text = re.sub(r'</\s*fo\s*ot\s*er>', '</footer>', text)
    text = re.sub(r'</\s*ma\s*in>', '</main>', text)
    text = re.sub(r'</\s*na\s*v>', '</nav>', text)
    text = re.sub(r'</\s*he\s*ad>', '</head>', text)
    text = re.sub(r'</\s*bo\s*dy>', '</body>', text)
    text = re.sub(r'</\s*ht\s*ml>', '</html>', text)
    text = re.sub(r'</\s*sc\s*ri\s*pt>', '</script>', text)

    # Fix opening tags
    text = re.sub(r'<\s*di\s*v', '<div', text)
    text = re.sub(r'<\s*sp\s*an', '<span', text)
    text = re.sub(r'<\s*st\s*ro\s*ng>', '<strong>', text)
    text = re.sub(r'<\s*sm\s*al\s*l>', '<small>', text)
    text = re.sub(r'<\s*bu\s*tt\s*on', '<button', text)
    text = re.sub(r'<\s*se\s*ct\s*io\s*n', '<section', text)
    text = re.sub(r'<\s*ar\s*ti\s*cl\s*e', '<article', text)
    text = re.sub(r'<\s*he\s*ad\s*er>', '<header>', text)
    text = re.sub(r'<\s*fo\s*ot\s*er>', '<footer>', text)
    text = re.sub(r'<\s*ma\s*in', '<main', text)
    text = re.sub(r'<\s*na\s*v', '<nav', text)
    text = re.sub(r'<\s*he\s*ad>', '<head>', text)
    text = re.sub(r'<\s*bo\s*dy>', '<body>', text)
    text = re.sub(r'<\s*ht\s*ml', '<html', text)
    text = re.sub(r'<\s*sc\s*ri\s*pt', '<script', text)
    text = re.sub(r'<\s*me\s*ta', '<meta', text)
    text = re.sub(r'<\s*li\s*nk', '<link', text)
    text = re.sub(r'<\s*ti\s*tl\s*e>', '<title>', text)
    text = re.sub(r'</\s*ti\s*tl\s*e>', '</title>', text)

    # Fix class values. Match complete corrupted class values before applying
    # the class map so values such as "wr ap na v" become "wrap nav".
    class_map = {
        'to pb ar': 'topbar',
        'wr ap': 'wrap',
        'na v': 'nav',
        'lo go': 'logo',
        'lo go - im g': 'logo-img',
        'ac ti ve': 'active',
        'na v - ac ti on s': 'nav-actions',
        'bt n': 'btn',
        'me nu': 'menu',
        'he ro': 'hero',
        'he ro - gr id': 'hero-grid',
        'ey eb ro w': 'eyebrow',
        'bu tt on - ro w': 'button-row',
        'bt no ut li ne': 'btn outline',
        'btn out li ne': 'btn outline',
        'su pp or te rs': 'supporters',
        'av at ar s': 'avatars',
        'av at ar': 'avatar',
        'st ar s': 'stars',
        'he ro - ph ot o': 'hero-photo',
        'ph ot o - ta g': 'photo-tag',
        'ph ot o - no te': 'photo-note',
        'no te - ic on': 'note-icon',
        'tr us t - st ri p': 'trust-strip',
        'se ct io n': 'section',
        'se ct io n - he ad': 'section-head',
        'te xt - li nk': 'text-link',
        'gr id': 'grid',
        'ca rd': 'card',
        'im ag e': 'image',
        'ta g': 'tag',
        'ca rd - bo dy': 'card-body',
        'me ta': 'meta',
        'fu nd in g': 'funding',
        'pr og re ss': 'progress',
        'pr og re ss ba r': 'progressbar',
        'ca rd - ac ti on s': 'card-actions',
        'ta bl e - bu tt on': 'table-button',
        'sp li t': 'split',
        'ur ge nt': 'urgent',
        'ur ge nt - la be l': 'urgent-label',
        'im pa ct - ba nd': 'impact-band',
        'st at s': 'stats',
        'st at': 'stat',
        'st ep s': 'steps',
        'st ep': 'step',
        'nu m': 'num',
        'fe at ur e - ca rd s': 'feature-cards',
        'fe at ur e': 'feature',
        'sy mb ol': 'symbol',
        'ca us e - gr id': 'cause-grid',
        'ca us e': 'cause',
        'te st im on ia l': 'testimonial',
        'pe rs on': 'person',
        'ne ws le tt er': 'newsletter',
        'fo ot er': 'footer',
        'fo ot er - gr id': 'footer-grid',
        'so ci al - li nk s': 'social-links',
        'fo ot er - bo tt om': 'footer-bottom',
        'fi lt er ba r': 'filterbar',
        'ch ip': 'chip',
        'ch ip   ac ti ve': 'chip active',
        'se ar ch': 'search',
        'tw o - fi el ds': 'two-fields',
        'fi el d - er ro r': 'field-error',
        'fo rm - pa ne l': 'form-panel',
        'fo rm - re su lt': 'form-result',
        'wi de - bt n': 'wide-btn',
        'br ea dc ru mb': 'breadcrumb',
        're ad in g': 'reading',
        'ar ti cl e - la yo ut': 'article-layout',
        'ar ti cl e - in tr o': 'article-intro',
        'ar ti cl e - im ag e': 'article-image',
        'ar ti cl e - as id e': 'article-aside',
        'te am - ca rd': 'team-card',
        'ga ll er y': 'gallery',
        'da sh': 'dash',
        'si de ba r': 'sidebar',
        'si de - li nk s': 'side-links',
        'si de - bo tt om': 'side-bottom',
        'da sh - ma in': 'dash-main',
        'da sh - to p': 'dash-top',
        'no ti fi ca ti on': 'notification',
        'da sh - gr id': 'dash-grid',
        'da sh - st at': 'dash-stat',
        'pa ne l': 'panel',
        'ch ar ts': 'charts',
        'ch ar tb ox': 'chartbox',
        'ac ti vi ty': 'activity',
        'ta bl e - sc ro ll': 'table-scroll',
        'st at us': 'status',
        'au th': 'auth',
        'au th - ar t': 'auth-art',
        'au th - bg - im g': 'auth-bg-img',
        'au th - fe at ur e - li st': 'auth-feature-list',
        'au th - fe at ur e - it em': 'auth-feature-item',
        'au th - fe at ur e - ic on': 'auth-feature-icon',
        'au th - ma in': 'auth-main',
        'au th - ca rd - bo x': 'auth-card-box',
        'au th - su b': 'auth-sub',
        'au th - ba ck': 'auth-back',
        'pa ss wo rd - wr ap': 'password-wrap',
        'pa ss wo rd - to gg le': 'password-toggle',
        'ch ec k': 'check',
        'de mo - no te': 'demo-note',
        'ro le - ca rd s': 'role-cards',
        'ro le - ca rd': 'role-card',
        'is - se le ct ed': 'is-selected',
        'so ci al - au th': 'social-auth',
        'au th - di vi de r': 'auth-divider',
    }

    def normalize_class_value(match):
        value = match.group(1)
        original = value
        for corrupted, corrected in sorted(class_map.items(), key=lambda item: len(item[0]), reverse=True):
            value = re.sub(rf'(?<!\S){re.escape(corrupted)}(?!\S)', corrected, value)
        return 'class="' + (' '.join(value.split()) if value != original else value) + '"'

    text = re.sub(r'class\s*=\s*"([^"]+)"', normalize_class_value, text)

    # Remove extra blank lines (more than 2 consecutive newlines)
    text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)
    return text

for fp in glob.glob('*.html'):
    with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()

    cleaned = clean_html(text)

    with open(fp, 'w', encoding='utf-8') as f:
        f.write(cleaned)

print('Cleaned all HTML markup successfully.')


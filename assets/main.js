const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)], money = n => '₹' + Number(n).toLocaleString('en-IN');

function field(l, n, t = 'text', ext = '') {
  return `<label>${l}<input name="${n}" type="${t}" required ${ext}><span class="field-error"></span></label>`;
}

function modal(html) {
  $('dialog')?.remove();
  let d = document.createElement('dialog');
  d.className = 'modal';
  d.innerHTML = '<button class="close" aria-label="Close dialog">×</button>' + html;
  document.body.append(d);
  d.showModal();
  d.querySelector('.close').onclick = () => d.close();
  d.addEventListener('click', e => { if (e.target === d) d.close(); });
}

function toast(t) {
  $('.toast')?.remove();
  let d = document.createElement('div');
  d.className = 'toast';
  d.setAttribute('role', 'status');
  d.textContent = t;
  document.body.append(d);
  setTimeout(() => d.remove(), 4500);
}

function download(name, t) {
  let a = document.createElement('a'), u = URL.createObjectURL(new Blob([t], { type: 'text/plain' }));
  a.href = u;
  a.download = name + '.txt';
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}

function donate(i) {
  const campaign = campaigns[i];
  if (!campaign) return;
  modal(`<span class="eyebrow">✦ A little kindness goes a long way</span><h2 style="font-size:26px;margin-bottom:8px;">${campaign[0]}</h2><p>Preview a contribution for this verified campaign. No money will be charged.</p><form data-form="donate" novalidate><label>Frequency<select name="frequency"><option>One-time Contribution</option><option>Monthly Supporter</option></select></label><div class="amounts">${[500, 1000, 2500, 5000].map(amount => `<button type="button" data-amount="${amount}">${money(amount)}</button>`).join('')}</div>${field('Amount (₹)', 'amount', 'number', 'min="1" step="1" value="1000"')}${field('Your full name', 'name', 'text', 'placeholder="e.g. Priya Sharma"')}${field('Email address', 'email', 'email', 'placeholder="name@example.com"')}<button class="btn wide-btn" style="width:100%;margin-top:10px;">Preview contribution ♡</button><span class="form-result" aria-live="polite"></span></form>`);
}

let activeFilter = 'All Campaigns';
function filter() {
  let q = ($('#campaign-search')?.value || '').toLowerCase(), n = 0;
  $$('#campaign-grid .card').forEach(c => {
    c.hidden = !((activeFilter === 'All Campaigns' || c.dataset.category === activeFilter) && c.dataset.search.toLowerCase().includes(q));
    if (!c.hidden) n++;
  });
  if ($('#no-results')) $('#no-results').hidden = n > 0;
}

const donations = [
  ['STK-1048', 'Education for Every Child', '02 Oct 2026', 2500, 'Completed'],
  ['STK-1032', 'Clean Water. Brighter Futures.', '15 Sep 2026', 1500, 'Completed'],
  ['STK-0994', 'A Meal Today. Hope for Tomorrow.', '01 Sep 2026', 1000, 'Completed'],
  ['STK-0951', 'Grow a Greener Community', '18 Aug 2026', 2000, 'Processing'],
  ['STK-0921', 'Healthcare Within Reach', '05 Aug 2026', 1500, 'Completed']
];
const admin = $('.dash')?.dataset.admin === 'true';

function table(h, r) {
  return `<div class="table-scroll"><table><thead><tr>${h.map(x => `<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${r.map(row => `<tr>${row.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function dt() {
  return table(admin ? ['ID', 'Donor', 'Campaign', 'Amount', 'Date', 'Status', 'Receipt'] : ['ID', 'Campaign', 'Date', 'Amount', 'Status', 'Receipt'], donations.map((d, i) => {
    let row = [d[0], d[1], d[2], money(d[3]), `<span class="status">${d[4]}</span>`, `<a class="table-button" href="404.html" data-receipt="${i}">View receipt</a>`];
    if (admin) row = [d[0], ['Ananya Rao', 'Rohan Mehta', 'Priya Shah'][i % 3], d[1], money(d[3]), d[2], row[4], row[5]];
    return row;
  }));
}

function stats(impact = false) {
  let data = impact ? [
    ['People supported', '48,000+'], ['Meals funded', '34,200'], ['Learning kits delivered', '1,420'],
    ['Trees planted', '5,800'], ['Medical sessions', '640'], ['Clean water access', '3,200']
  ] : admin ? [
    ['Total funds raised', '₹4.8 Cr'], ['Active campaigns', '125'], ['Total donors', '25,480'],
    ['Registered volunteers', '8,500'], ['Upcoming events', '8'], ['Pending reviews', '6'],
    ['Completed projects', '94'], ['Monthly contributions', '₹12.6 L']
  ] : [
    ['Total donated', '₹8,500'], ['Campaigns supported', '5'], ['Active contributions', '2'],
    ['Lives impacted', '128'], ['Upcoming events', '3'], ['Giving streak', '6 months']
  ];
  return `<div class="dash-grid">${data.map(d => `<div class="dash-stat"><p>${d[0]}</p><strong>${d[1]}</strong><small>Live community metrics</small></div>`).join('')}</div>`;
}

function panel(title, html) {
  return `<div class="panel"><h3>${title}</h3>${html}</div>`;
}

function analytics() {
  let names = admin ? ['Donation revenue (₹ Lakhs)', 'Monthly contributions', 'Cause distribution', 'Donor growth rate', 'Campaign conversion', 'Regional support distribution'] : ['Monthly contributions (₹)', 'Giving by cause', 'Cause distribution', 'Annual giving trend', 'Community impact reach', 'Contribution frequency'];
  return '<div class="charts" style="grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:20px;">' + names.map((n, i) => panel(n, `<div class="chartbox"><canvas id="chart-${i}" aria-label="${n} interactive chart" role="img"></canvas></div>`)).join('') + '</div>';
}

function profile(settings = false) {
  return panel(settings ? 'Your giving preferences' : 'Your community profile', `<form data-form="profile" novalidate><div class="two-fields">${field(settings && admin ? 'Organization name' : 'Full name', 'name', 'text', 'placeholder="Priya Sharma"')}${field('Email address', 'email', 'email', 'placeholder="name@example.com"')}</div><div class="two-fields">${field('Phone number', 'phone', 'tel', 'placeholder="9876543210"')}<label>Preferred cause<select name="cause">${campaigns.map(c => `<option>${c[1]}</option>`).join('')}</select></label></div><label>Address<input name="address" placeholder="Bengaluru, Karnataka"></label><label>Giving preferences<select name="giving"><option>One-time contributions</option><option>Monthly recurring supporter</option></select></label><label class="check"><input type="checkbox" name="updates" checked>Receive transparent campaign progress and impact milestones</label><label class="check"><input type="checkbox" name="events" checked>Receive community event invitations and volunteer alerts</label>${settings ? '<label>Security preference<select name="security"><option>Sign in for each session</option><option>Remember my profile on this device</option></select></label><label class="check"><input type="checkbox" name="privacy" checked>Keep my profile private from public leaderboards</label>' : ''}<button class="btn">Save ${settings ? 'preferences' : 'profile'}</button><span class="form-result" aria-live="polite"></span></form>`);
}

function dash(s) {
  if (s === 'Overview') {
    const featuredBanner = `
      <div class="dash-banner">
        <div class="dash-banner-content">
          <span class="eyebrow" style="color:var(--lime);">✦ FEATURED CAMPAIGN</span>
          <h2>Nourish Futures: 50,000 Meals &amp; Learning Kits</h2>
          <p>Over 1,248 changemakers have united this month to support children and families across Karnataka and Rajasthan.</p>
          <div class="funding" style="color:white;margin-bottom:8px;"><strong>₹8,76,000 raised</strong><span>Goal: ₹12,00,000 (73%)</span></div>
          <div class="progress" style="background:rgba(255,255,255,0.25);margin-bottom:16px;"><span style="width:73%;background:var(--lime);"></span></div>
          <div class="button-row" style="margin-top:0;">
            <a class="btn light" href="404.html" data-donate="0">Support This Campaign ♡</a>
            <a class="btn outline" href="404.html" style="background:rgba(255,255,255,0.15);color:white;border-color:rgba(255,255,255,0.4);">View All Causes →</a>
          </div>
        </div>
        <div class="dash-banner-img">
          <img src="assets/education.webp" alt="Education initiative">
        </div>
      </div>
    `;

    const chartsRow = `
      <div class="charts">
        ${panel(admin ? 'Funds Raised Over Time (₹ Lakhs)' : 'Your Monthly Giving Journey (₹)', '<div class="chartbox"><canvas id="chart-0" role="img" aria-label="Monthly giving bar chart"></canvas></div>')}
        ${panel(admin ? 'Monthly Donor Growth & Participation' : 'Community Impact Reach', '<div class="chartbox"><canvas id="chart-1" role="img" aria-label="Community growth line chart"></canvas></div>')}
      </div>
    `;

    const recommended = `
      <div class="panel">
        <h3>Recommended Grassroots Causes</h3>
        <div class="dash-campaign-grid">
          ${campaigns.slice(0, 3).map((c, i) => `
            <div class="dash-impact-card">
              <img src="assets/${i === 0 ? 'education.webp' : i === 1 ? 'water.webp' : 'food.webp'}" alt="${c[0]}">
              <div class="dash-impact-body">
                <span class="tag" style="position:static;display:inline-block;margin-bottom:8px;">${c[1]}</span>
                <h4>${c[0]}</h4>
                <p>${c[8]}</p>
                <div class="funding" style="font-size:12px;"><strong>${money(c[3])}</strong><span>Goal ${money(c[4])}</span></div>
                <div class="progress"><span style="width:${Math.round(c[3]/c[4]*100)}%"></span></div>
                <a class="btn outline" href="404.html" data-donate="${i}" style="width:100%;margin-top:10px;text-align:center;">Support Cause</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    return stats() + featuredBanner + chartsRow + panel('Recent Donations & Receipts', dt()) + recommended;
  }

  if (['My Donations', 'Donations', 'Receipts'].includes(s)) return panel(s, dt());
  if (s === 'Analytics') return analytics();
  
  if (s === 'Impact') {
    const impactStories = `
      <div class="panel">
        <h3>Recent Verified Impact Milestones</h3>
        <div class="dash-campaign-grid">
          <div class="dash-impact-card">
            <img src="assets/education.webp" alt="Classrooms built">
            <div class="dash-impact-body">
              <span class="tag" style="position:static;display:inline-block;margin-bottom:8px;">Education</span>
              <h4>12 Classrooms Fully Equipped</h4>
              <p>Provided learning desks, digital projectors, and 500+ textbooks in rural Karnataka schools.</p>
              <small style="color:var(--green);font-weight:700;">✓ Milestone Verified by Field Team</small>
            </div>
          </div>
          <div class="dash-impact-card">
            <img src="assets/water.webp" alt="Clean water wells">
            <div class="dash-impact-body">
              <span class="tag" style="position:static;display:inline-block;margin-bottom:8px;">Clean Water</span>
              <h4>4 Sustainable Water Points Installed</h4>
              <p>Over 3,200 residents now have clean daily drinking water with community-trained technicians.</p>
              <small style="color:var(--green);font-weight:700;">✓ Milestone Verified by Field Team</small>
            </div>
          </div>
          <div class="dash-impact-card">
            <img src="assets/food.webp" alt="Meals delivered">
            <div class="dash-impact-body">
              <span class="tag" style="position:static;display:inline-block;margin-bottom:8px;">Hunger Relief</span>
              <h4>34,000+ Nutritious Meals Distributed</h4>
              <p>Partner community kitchens delivered dry rations and hot meals during monsoon displacement.</p>
              <small style="color:var(--green);font-weight:700;">✓ Milestone Verified by Field Team</small>
            </div>
          </div>
        </div>
        <div style="margin-top:20px;">
          <a class="btn outline" href="404.html" data-report="Impact Summary">Download impact summary</a>
        </div>
      </div>
    `;
    return stats(true) + panel('Regional Impact Distribution Across States', '<div class="chartbox"><canvas id="chart-0" role="img" aria-label="Regional impact bar chart"></canvas></div>') + impactStories;
  }

  if (s === 'Campaigns') {
    const campaignCards = `
      <div class="panel">
        <h3>${admin ? 'Active Campaign Administration' : 'Active Grassroots Campaigns'}</h3>
        <div class="chartbox" style="height:220px;margin-bottom:20px;"><canvas id="chart-0" role="img" aria-label="Campaign budget bar chart"></canvas></div>
        ${table(admin ? ['ID', 'Campaign', 'Cause', 'Goal', 'Raised', 'Progress', 'Donors', 'Status', 'Start', 'End'] : ['Campaign', 'Cause', 'Raised', 'Goal', 'Progress', 'Action'], campaigns.map((c, i) => admin ? ['CMP-10' + i, c[0], c[1], money(c[4]), money(c[3]), Math.round(c[3] / c[4] * 100) + '%', c[5], `<a class="table-button" href="404.html" data-status="${i}">${i === 7 ? 'Nearly Funded' : 'Active'}</a>`, '01 Sep 2026', '30 Nov 2026'] : [c[0], c[1], money(c[3]), money(c[4]), Math.round(c[3] / c[4] * 100) + '%', `<a class="btn outline" href="404.html" data-donate="${i}">Donate</a>`]))}
      </div>
    `;
    return campaignCards;
  }

  if (s === 'Donors') return panel('Supporter Community', table(['Name', 'Email', 'Total contributions', 'Campaigns', 'Last donation', 'Supporter type'], [['Ananya Rao', 'ananya@example.com', '₹28,500', 6, '02 Oct 2026', 'Monthly Donor'], ['Rohan Mehta', 'rohan@example.com', '₹12,000', 3, '28 Sep 2026', 'Regular Donor'], ['Priya Shah', 'priya@example.com', '₹55,000', 8, '01 Oct 2026', 'Major Supporter'], ['Arjun Nair', 'arjun@example.com', '₹1,000', 1, '03 Oct 2026', 'New Supporter']]));
  if (s === 'Volunteers') return panel('Volunteer Coordination', table(['Name', 'Event', 'Role', 'Hours', 'Status', 'Contact'], [['Rohan Mehta', 'Food Drive', 'Distribution lead', 24, 'Confirmed', 'rohan@example.com'], ['Meera Patel', 'Tree Plantation', 'Coordinator', 18, 'Confirmed', 'meera@example.com'], ['Arjun Nair', 'Walkathon', 'Route support', 8, 'Pending', 'arjun@example.com']]));
  
  if (s === 'Events') {
    const eventChart = '<div class="chartbox" style="height:220px;margin-bottom:20px;"><canvas id="chart-0" role="img" aria-label="Event turnout bar chart"></canvas></div>';
    return panel('Community Events Coordination', eventChart + table(['Event', 'Date', 'Time', 'Venue', 'Participants', 'Action'], events.map((v, i) => [v[0], v[2] + ' 2026', v[3], v[4], v[6], `<a class="table-button" href="404.html" data-event="${i}">View registration</a>`])));
  }

  if (s === 'Reports') return '<div class="feature-cards">' + ['Donation Summary Report', 'Campaign Performance Report', 'Donor Engagement Report', 'Volunteer Log Report', 'Community Event Report', 'Verified Impact Milestone Summary'].map(x => `<div class="feature"><h3>${x}</h3><p>October 2026 · Verified Summary</p><a class="btn outline" href="404.html" data-report="${x}">Download report</a></div>`).join('') + '</div>';
  if (s === 'Messages') return panel('Community Inbox', [['Ananya Rao', 'Can I receive monthly education updates?', 'Donor inquiry'], ['Rohan Mehta', 'I can help pack at the food drive.', 'Volunteer inquiry'], ['Priya Shah', 'Our team would like to discuss a partnership.', 'Campaign organiser'], ['Arjun Nair', 'Where does the walkathon start?', 'Event question']].map((m, i) => `<div class="activity"><strong>${m[0]}</strong><small>${m[2]} · Community message</small><p>${m[1]}</p><a class="table-button" href="404.html" data-reply="${i}">Reply</a></div>`).join(''));
  
  return profile(s === 'Settings');
}

function fill() {
  let f = $('[data-form="profile"]');
  if (!f) return;
  let d = { name: 'Priya Sharma', email: sessionStorage.getItem('stacklyEmail') || 'guest.supporter@stackly.org', phone: '9876543210', address: 'Bengaluru, Karnataka' };
  try { Object.assign(d, JSON.parse(localStorage.getItem('stacklyDemoProfile') || '{}')); } catch {}
  for (let [k, v] of Object.entries(d)) if (f.elements[k]) {
    if (f.elements[k].type === 'checkbox') f.elements[k].checked = v === 'on';
    else f.elements[k].value = v;
  }
}

function renderCharts() {
  if (!window.Chart) {
    $$('.chartbox').forEach(c => {
      c.innerHTML = '<p class="muted" style="padding:20px 0;">Monthly giving preview: May ₹500 · June ₹750 · July ₹1,000 · August ₹3,500 · September ₹2,500 · October ₹2,500.</p>';
    });
    return;
  }
  $$('canvas').forEach((c, i) => {
    try {
      if (Chart.getChart(c)) Chart.getChart(c).destroy();
      // Alternate chart types: bar, line, doughnut
      let type = i === 2 ? 'doughnut' : (i % 2 === 0 ? 'bar' : 'line');
      new Chart(c, {
        type,
        data: {
          labels: i === 2 ? ['Education', 'Clean Water', 'Hunger Relief', 'Healthcare', 'Environment'] : ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [{
            label: admin ? 'Contributions (₹ Lakhs)' : 'Funds Deployed (₹)',
            data: i === 2 ? [35, 24, 18, 15, 8] : admin ? [6.8, 8.2, 7.5, 10.3, 11.2, 12.6] : [500, 750, 1000, 3500, 2500, 2500],
            borderColor: '#174c3c',
            backgroundColor: i === 2 ? ['#174c3c', '#759a69', '#e1ef8a', '#236551', '#f3c246'] : type === 'bar' ? '#236551' : 'rgba(23, 76, 60, 0.15)',
            fill: true,
            borderRadius: type === 'bar' ? 6 : 0,
            tension: .35,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: type === 'doughnut', position: 'bottom' } },
          scales: type === 'doughnut' ? {} : { y: { beginAtZero: true, grid: { color: '#edf0e8' } }, x: { grid: { display: false } } }
        }
      });
    } catch (err) {
      console.warn('Chart render note:', err);
    }
  });
}

function charts() {
  if (window.Chart) {
    renderCharts();
  } else {
    window.addEventListener('load', renderCharts, { once: true });
    setTimeout(renderCharts, 400);
  }
}

if ($('#dash-content')) {
  $('#dash-content').innerHTML = dash('Overview');
  const storedEmail = sessionStorage.getItem('stacklyEmail');
  if ($('#session-email')) {
    $('#session-email').textContent = storedEmail ? `Signed in as: ${storedEmail}` : 'Signed in as: guest.supporter@stackly.org';
  }
  charts();
}

/* ========================================================
   FULL-SCREEN MOBILE NAVIGATION BUILDER (IMAGE 1 STYLE)
======================================================== */
function setupMobileNav() {
  const nav = $('nav');
  if (!nav) return;

  const page = location.pathname.split('/').pop() || 'index.html';
  const currentPage = page === 'donation-policy.html' ? 'campaigns.html' : page;
  nav.querySelectorAll('a[href]').forEach(link => {
    const isCurrent = link.getAttribute('href').split(/[?#]/)[0] === currentPage;
    link.classList.toggle('active', isCurrent);
    if (isCurrent) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  // Build structure inside nav if not present
  if (!nav.querySelector('.nav-drawer-header')) {
    const existingLinks = [...nav.querySelectorAll('a')];
    
    // Header row with logo and close button
    const headerDiv = document.createElement('div');
    headerDiv.className = 'nav-drawer-header';
    headerDiv.innerHTML = `
      <a href="index.html" class="logo">
        <img src="assets/logo_gold.webp" alt="STACKLY" class="logo-img" style="height:36px;">
      </a>
      <button class="nav-drawer-close" aria-label="Close navigation menu">×</button>
    `;

    // Links wrapper
    const linksWrap = document.createElement('div');
    linksWrap.className = 'nav-links-wrap';
    existingLinks.forEach(link => linksWrap.appendChild(link));

    // Footer actions with Portal Login and Donate Now (both redirect cleanly)
    const footerDiv = document.createElement('div');
    footerDiv.className = 'nav-drawer-footer';
    footerDiv.innerHTML = `
      <a href="signin.html" class="btn-portal">Portal Login</a>
      <a href="404.html" class="btn-donate">Donate Now ♡</a>
    `;

    nav.innerHTML = '';
    nav.appendChild(headerDiv);
    nav.appendChild(linksWrap);
    nav.appendChild(footerDiv);

    // Close handler
    headerDiv.querySelector('.nav-drawer-close').onclick = closeMobileNav;
  }
}

function closeMobileNav() {
  const nav = $('nav');
  if (!nav?.classList.contains('open')) return;
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
  const menuBtn = $('.menu');
  if (menuBtn) {
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open navigation menu');
    menuBtn.textContent = '☰';
  }
}

/* ========================================================
   CLICK EVENT DISPATCHER
======================================================== */
document.addEventListener('click', e => {
  // Mobile Hamburger Toggle
  let menuBtn = e.target.closest('.menu');
  if (menuBtn) {
    const nav = $('nav');
    if (nav) {
      const isOpen = nav.classList.toggle('open');
      document.body.classList.toggle('menu-open', isOpen);
      menuBtn.setAttribute('aria-expanded', isOpen);
      menuBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      menuBtn.textContent = isOpen ? '×' : '☰';
    }
    return;
  }

  // Close drawer if clicking any nav link
  let navLink = e.target.closest('nav a');
  if (navLink && $('nav')?.classList.contains('open')) closeMobileNav();

  // Handle Role Selector Cards (with click bounce and active state)
  let roleCard = e.target.closest('.role-card');
  if (roleCard) {
    let container = roleCard.closest('.role-cards');
    if (container) {
      container.querySelectorAll('.role-card').forEach(rc => rc.classList.remove('is-selected'));
      roleCard.classList.add('is-selected');
      let radio = roleCard.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    }
  }

  // Handle Go Back button across all pages (404, etc.)
  let goBackBtn = e.target.closest('#go-back, .btn-go-back');
  if (goBackBtn) {
    e.preventDefault();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = 'index.html';
    }
    return;
  }

  const actionEl = e.target.closest('[data-donate], [data-details], [data-receipt], [data-download-receipt], [data-report], [data-status], [data-event], [data-reply]');
  if (actionEl?.tagName === 'A') e.preventDefault();
  let b = e.target.closest('button') || actionEl;
  if (!b) return;

  if (b.dataset.donate !== undefined) donate(+b.dataset.donate);
  if (b.dataset.details !== undefined) {
    const campaign = campaigns[+b.dataset.details];
    if (campaign) {
      modal(`<span class="eyebrow">✦ ${campaign[1]} · ${campaign[6]}</span><h2 style="font-size:26px;margin-bottom:8px;">${campaign[0]}</h2><p>${campaign[8]}</p><h3>What your support helps provide</h3><p>Local partners coordinate resources and share milestones. The budget covers classroom kits, clean water pumps, hot meals, and transparency reporting.</p><p style="font-weight:700;color:var(--green);">${money(campaign[3])} raised of ${money(campaign[4])}</p><p class="demo-note">Demonstration campaign and figures.</p><button class="btn" data-donate="${b.dataset.details}">Donate Now ♡</button>`);
    }
  }
  if (b.dataset.event !== undefined) {
    const event = events[+b.dataset.event];
    if (event) {
      modal(`<span class="eyebrow">✦ ${event[2]} 2026 · ${event[3]}</span><h2 style="font-size:26px;margin-bottom:8px;">${event[0]}</h2><p>${event[4]} · ${event[7]}</p><form data-form="event" novalidate>${field('Full name', 'name', 'text', 'placeholder="Priya Sharma"')}${field('Email address', 'email', 'email', 'placeholder="priya@example.com"')}${field('Participants', 'participants', 'tel', 'value="1" placeholder="1"')}<p class="demo-note">Demo registration. No real booking is made.</p><button class="btn" style="width:100%">Confirm demo registration</button><span class="form-result" aria-live="polite"></span></form>`);
    }
  }
  if (b.dataset.receipt !== undefined) {
    const donation = donations[+b.dataset.receipt];
    if (donation) {
      modal(`<span class="eyebrow">✦ Sample Receipt</span><h2 style="font-size:26px;margin-bottom:8px;">Thank you for your kindness.</h2><p>${donation[0]} · ${donation[2]}</p><h3>${donation[1]}</h3><p>${money(donation[3])} · ${donation[4]}</p><p class="demo-note">Sample demonstration receipt. Not a tax invoice.</p><button class="btn" data-download-receipt="${b.dataset.receipt}">Download sample receipt</button>`);
    }
  }
  if (b.dataset.downloadReceipt !== undefined) {
    const donation = donations[+b.dataset.downloadReceipt];
    if (donation) download(donation[0] + '-sample', 'STACKLY DEMONSTRATION RECEIPT\nNot a tax receipt or payment confirmation\n' + donation.join('\n'));
  }
  if (b.dataset.report) {
    download('STACKLY-' + b.dataset.report.replaceAll(' ', '-'), 'STACKLY — ' + b.dataset.report + '\nDEMONSTRATION REPORT — October 2026\nFunds raised: ₹4.8 Cr\nCampaigns: 125\nVolunteers: 8,500\nLives supported: 48,000\n\n' + campaigns.map(campaign => campaign[0] + ': ' + money(campaign[3]) + ' / ' + money(campaign[4])).join('\n'));
    toast('Your demo report is ready.');
  }
  if (b.dataset.status !== undefined) {
    b.textContent = b.textContent === 'Paused' ? 'Active' : 'Paused';
    toast('Status updated in this preview.');
  }
  if (b.dataset.reply !== undefined) {
    modal('<h2 style="font-size:26px;margin-bottom:8px;">Reply to Community Message</h2><form data-form="reply" novalidate><label>Your reply<textarea name="message" rows="5" required placeholder="Write your response..."></textarea><span class="field-error"></span></label><button class="btn" style="width:100%">Save demo reply</button><span class="form-result" aria-live="polite"></span></form>');
  }

  if (b.dataset.amount) {
    let amtInput = $('input[name="amount"]');
    if (amtInput) amtInput.value = b.dataset.amount;
    $$('.amounts button').forEach(x => x.classList.toggle('active', x === b));
  }
  if (b.dataset.filter) {
    activeFilter = b.dataset.filter;
    $$('[data-filter]').forEach(x => x.classList.toggle('active', x === b));
    filter();
  }
  if (b.classList.contains('password-toggle') || b.classList.contains('toggle-password')) {
    let p = b.previousElementSibling || (b.dataset.target ? $('#' + b.dataset.target) : null);
    if (p && p.tagName === 'INPUT') {
      p.type = p.type === 'password' ? 'text' : 'password';
      b.textContent = p.type === 'password' ? 'Show' : 'Hide';
    }
  }
  if (b.id === 'logout') {
    sessionStorage.removeItem('stacklyEmail');
    sessionStorage.removeItem('stacklyRole');
    toast('Signed out successfully.');
    setTimeout(() => { location.href = 'signin.html'; }, 600);
  }
  if (b.dataset.section) {
    if (window.Chart) $$('canvas').forEach(c => Chart.getChart(c)?.destroy());
    if ($('#dash-heading')) $('#dash-heading').textContent = b.dataset.section;
    if ($('#dash-content')) $('#dash-content').innerHTML = dash(b.dataset.section);
    $$('.side-links button').forEach(x => {
      const isActive = x.dataset.section === b.dataset.section;
      x.classList.toggle('active', isActive);
      if (isActive) x.setAttribute('aria-current', 'page');
      else x.removeAttribute('aria-current');
    });
    charts();
    fill();
  }
});

/* ========================================================
   REAL-TIME INPUT SANITIZATION (STRICT NAMES & NUMBERS)
======================================================== */
$('#campaign-search')?.addEventListener('input', filter);

document.addEventListener('input', e => {
  const target = e.target;
  if (!target || !target.name) return;

  const nameAttr = target.name.toLowerCase();
  const inputType = (target.type || '').toLowerCase();
  const dataType = (target.dataset.type || '').toLowerCase();

  // Strict letter-only filtering for Name fields
  const isNameField = ['name', 'first', 'last', 'fullname', 'firstname', 'lastname'].includes(nameAttr) || dataType === 'name';
  if (isNameField) {
    const cleaned = target.value.replace(/[^a-zA-Z\s]/g, '');
    if (target.value !== cleaned) {
      target.value = cleaned;
    }
  }

  // Strict digit-only filtering for Number / Phone / Amount / Participants fields
  const isNumberField = ['phone', 'amount', 'participants', 'number', 'mobile', 'tel'].includes(nameAttr) || inputType === 'number' || inputType === 'tel' || dataType === 'number';
  if (isNumberField) {
    const cleaned = target.value.replace(/\D/g, '');
    if (target.value !== cleaned) {
      target.value = cleaned;
    }
  }

  target.classList.remove('invalid');
  const errorSpan = target.closest('label')?.querySelector('.field-error') || target.closest('.form-group')?.querySelector('.field-error');
  if (errorSpan) errorSpan.textContent = '';
});

/* ========================================================
   FORM SUBMISSION & VALIDATION
======================================================== */
document.addEventListener('submit', e => {
  let f = e.target;
  if (!f.dataset.form && !f.id) return;
  e.preventDefault();

  let valid = true, first = null;
  const inputs = [...f.querySelectorAll('input, select, textarea')].filter(el => el.type !== 'submit' && el.type !== 'button');

  inputs.forEach(p => {
    let v = p.value ? p.value.trim() : '', err = '';
    const nameAttr = (p.name || '').toLowerCase();
    const inputType = (p.type || '').toLowerCase();
    const isRequired = p.hasAttribute('required');

    if (isRequired && !v && p.type !== 'checkbox') {
      err = 'This field is required.';
    } else if (p.type === 'checkbox' && isRequired && !p.checked) {
      err = 'Please accept this item to continue.';
    } else if (v) {
      if (p.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        err = 'Enter a valid email address (e.g. name@example.com).';
      } else if (['name', 'first', 'last', 'fullname', 'firstname', 'lastname'].includes(nameAttr)) {
        if (!/^[A-Za-z\s]{2,50}$/.test(v)) {
          err = 'Please use letters and spaces only (min 2 characters).';
        }
      } else if (['phone', 'mobile', 'tel'].includes(nameAttr) || inputType === 'tel') {
        if (!/^\d{7,15}$/.test(v)) {
          err = 'Enter a valid phone number (7–15 digits).';
        }
      } else if (['amount', 'participants'].includes(nameAttr) || inputType === 'number') {
        if (!/^\d+$/.test(v) || +v < 1) {
          err = 'Enter a valid positive number.';
        }
      } else if (nameAttr.includes('password') && !nameAttr.includes('confirm') && v.length < 6) {
        err = 'Password must be at least 6 characters.';
      } else if ((nameAttr.includes('confirm') || nameAttr === 'confirm_password') && f.elements.password && v !== f.elements.password.value) {
        err = 'Passwords do not match.';
      }
    }

    p.classList.toggle('invalid', !!err);
    p.setAttribute('aria-invalid', !!err);
    let span = p.closest('label')?.querySelector('.field-error') || p.closest('.form-group')?.querySelector('.field-error');
    if (span) span.textContent = err;
    if (err) { valid = false; first ??= p; }
  });

  let result = f.querySelector('.form-result') || f.querySelector('.field-error-main');
  if (!valid) {
    if (result) result.textContent = 'Please check the highlighted fields above.';
    if (first) first.focus();
    return;
  }

  const formType = f.dataset.form || (f.id === 'loginForm' ? 'signin' : f.id === 'registerForm' ? 'register' : '');

  switch (formType) {
    case 'signin': {
      const email = f.elements.email ? f.elements.email.value.trim() : 'donor@example.com';
      let role = 'donor';
      if (f.elements.role) {
        role = f.elements.role.value || (f.querySelector('input[name="role"]:checked')?.value) || 'donor';
      }
      sessionStorage.setItem('stacklyEmail', email);
      sessionStorage.setItem('stacklyRole', role);

      if (result) result.textContent = 'Authentication successful! Loading dashboard...';
      toast(`Welcome back! Redirecting to ${role === 'admin' ? 'Admin' : 'Donor'} Dashboard...`);
      setTimeout(() => {
        location.href = role === 'admin' ? 'admin-dashboard.html' : 'donor-dashboard.html';
      }, 700);
      break;
    }
    case 'register': {
      const email = f.elements.email ? f.elements.email.value.trim() : '';
      let role = 'donor';
      if (f.elements.role) {
        role = f.elements.role.value || (f.querySelector('input[name="role"]:checked')?.value) || 'donor';
      }
      if (email) sessionStorage.setItem('stacklyEmail', email);
      sessionStorage.setItem('stacklyRole', role);

      if (result) result.textContent = 'Account created successfully! Redirecting to sign in...';
      toast('Registration successful! Redirecting to Sign In...');
      setTimeout(() => { location.href = 'signin.html'; }, 1100);
      break;
    }
    case 'contact':
      if (result) result.textContent = 'Thank you for your message! Our community team will get back to you shortly.';
      toast('Message sent successfully.');
      f.reset();
      break;
    case 'newsletter':
      if (result) result.textContent = 'Thank you for subscribing to STACKLY community updates!';
      toast('Subscribed to STACKLY updates.');
      f.reset();
      break;
    case 'donate':
      if (result) result.textContent = `Your ${money(f.elements.amount.value)} contribution was previewed. Thank you for your generosity!`;
      toast('Demonstration donation previewed.');
      break;
    case 'event':
      if (result) result.textContent = 'Demo event registration confirmed. Thank you for being part of change!';
      toast('Registration confirmed.');
      break;
    case 'profile':
      try {
        localStorage.setItem('stacklyDemoProfile', JSON.stringify(Object.fromEntries(new FormData(f))));
      } catch {}
      if (result) result.textContent = 'Profile preferences updated successfully.';
      toast('Profile preferences saved.');
      break;
    case 'reply':
      if (result) result.textContent = 'Demo response saved.';
      toast('Reply submitted.');
      break;
    default:
      if (result) result.textContent = 'Form submitted successfully.';
      toast('Submitted successfully.');
  }
});

let subject = new URLSearchParams(location.search).get('subject');
if (subject && $('[name="subject"]')) $('[name="subject"]').value = subject;

/* ========================================================
   TWINKLING STARS BACKGROUND GENERATOR
======================================================== */
function initStarsEffect() {
  const containers = $$('.hero, .page-hero, .impact-band, .newsletter, .auth-art, .stars-container-404');
  const starSymbols = ['✦', '★', '✧', '⋆', '•'];
  
  containers.forEach(container => {
    if (container.querySelector('.hero-stars')) return;
    const starField = document.createElement('div');
    starField.className = 'hero-stars';
    starField.setAttribute('aria-hidden', 'true');
    
    const count = container.classList.contains('impact-band') || container.classList.contains('newsletter') || container.classList.contains('stars-container-404') ? 16 : 22;
    for (let i = 0; i < count; i++) {
      const star = document.createElement('span');
      star.className = 'twinkle-star';
      if (Math.random() > 0.6) star.classList.add('lime');
      if (Math.random() > 0.8) star.classList.add('large');
      
      star.textContent = starSymbols[Math.floor(Math.random() * starSymbols.length)];
      star.style.left = (Math.random() * 95 + 2) + '%';
      star.style.top = (Math.random() * 90 + 5) + '%';
      star.style.animationDelay = (Math.random() * 4) + 's';
      star.style.animationDuration = (2.5 + Math.random() * 3.5) + 's';
      starField.appendChild(star);
    }
    container.prepend(starField);
  });
}

/* ========================================================
   SCROLL REVEAL (SAFE OPEN LEFT TO RIGHT)
======================================================== */
function initScrollAnimations() {
  const elementsToReveal = $$(
    '.split, .card, .feature, .step, .stat, .cause, .testimonial, .urgent, .newsletter, .timeline > div, .gallery img, .article-aside, .reading, .auth-card-box, .dash-banner, .dash-impact-card'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          entry.target.classList.remove('pending');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '50px 0px 50px 0px'
    });

    elementsToReveal.forEach(el => {
      el.classList.add('reveal-ltr');
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        el.classList.add('active');
      } else {
        el.classList.add('pending');
        observer.observe(el);
      }
    });
  } else {
    elementsToReveal.forEach(el => el.classList.add('active'));
  }
}

/* ========================================================
   DYNAMIC CURSOR MOVEMENT: SPOTLIGHT SHINE & HOVER EFFECTS
======================================================== */
function initCursorShineAndTilt() {
  const cardSelector = '.card, .feature, .testimonial, .step, .stat, .dash-stat, .panel, .urgent, .cause, .cause-card, .team-card, .article-aside, .dash-impact-card, .role-card, .auth-card-box, .timeline > div, .faq details, .form-panel, .activity, .photo-note, .card-404, .newsletter, .footer-links a, .footer-links, .footer-brand, .split, .hero-photo, .btn, .social-links a';

  let ticking = false;
  document.addEventListener('pointermove', e => {
    const target = e.target.closest(cardSelector);
    if (!target) return;
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPercent = Math.max(0, Math.min(100, Math.round((x / rect.width) * 100)));
      const yPercent = Math.max(0, Math.min(100, Math.round((y / rect.height) * 100)));

      target.style.setProperty('--mouse-x', `${xPercent}%`);
      target.style.setProperty('--mouse-y', `${yPercent}%`);
      ticking = false;
    });
  }, { passive: true });

  document.addEventListener('pointerout', e => {
    const target = e.target.closest(cardSelector);
    if (target && !target.contains(e.relatedTarget)) {
      target.style.setProperty('--mouse-x', '50%');
      target.style.setProperty('--mouse-y', '50%');
    }
  }, { passive: true });
}

function init() {
  setupMobileNav();
  initStarsEffect();
  initScrollAnimations();
  initCursorShineAndTilt();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


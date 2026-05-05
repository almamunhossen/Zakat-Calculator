
    // ---------- DATA ----------
    let dpsData = []; // { amount, months, startDate, profit, exemptYears }
    let currentCurrency = "BDT";
    const sarSvgSmall = `<svg width="16" height="16" viewBox="0 0 24.6 27.5" style="fill:currentColor;vertical-align:middle;"><path d="M15.3,24.4L15.3,24.4L15.3,24.4c-0.4,1-0.7,2-0.8,3.1l9.3-2c0.4-1,0.7-2,0.8-3.1L15.3,24.4z"/><path d="M23.8,19.6c0.4-1,0.7-2,0.8-3.1L17.4,18l0-3l6.4-1.4c0.4-1,0.7-2,0.8-3.1l-7.2,1.5l0-10.7c-1.1,0.6-2.1,1.5-2.9,2.4l0,8.8l-2.9,0.6l0-13.3c-1.1,0.6-2.1,1.5-2.9,2.4l0,11.5l-6.5,1.4c-0.4,1-0.7,2-0.8,3.1l7.3-1.6l0,3.7l-7.9,1.7c-0.4,1-0.7,2-0.8,3.1l8.2-1.7c0.7-0.1,1.2-0.5,1.6-1.1l1.5-2.2l0,0c0.2-0.2,0.2-0.5,0.2-0.8l0-3.3l2.9-0.6l0,5.9L23.8,19.6z"/></svg>`;
    const symbols = { BDT: "৳", SAR: sarSvgSmall, USD: "$" };
    const sarSvg = `<svg width="28" height="28" viewBox="0 0 24.6 27.5" style="fill: currentColor;"><path d="M15.3,24.4L15.3,24.4L15.3,24.4c-0.4,1-0.7,2-0.8,3.1l9.3-2c0.4-1,0.7-2,0.8-3.1L15.3,24.4z"/><path d="M23.8,19.6c0.4-1,0.7-2,0.8-3.1L17.4,18l0-3l6.4-1.4c0.4-1,0.7-2,0.8-3.1l-7.2,1.5l0-10.7c-1.1,0.6-2.1,1.5-2.9,2.4l0,8.8l-2.9,0.6l0-13.3c-1.1,0.6-2.1,1.5-2.9,2.4l0,11.5l-6.5,1.4c-0.4,1-0.7,2-0.8,3.1l7.3-1.6l0,3.7l-7.9,1.7c-0.4,1-0.7,2-0.8,3.1l8.2-1.7c0.7-0.1,1.2-0.5,1.6-1.1l1.5-2.2l0,0c0.2-0.2,0.2-0.5,0.2-0.8l0-3.3l2.9-0.6l0,5.9L23.8,19.6z"/></svg>`;

    function getCurSymbol() { return symbols[currentCurrency]; }

    function computeTotalZakat() {
      let totalZakat = 0;
      const today = new Date();

      // DPS with exemptYears
      let dpsTotal = 0;
      dpsData.forEach(plan => {
        let amt = parseFloat(plan.amount) || 0;
        let months = parseInt(plan.months) || 0;
        let startDate = plan.startDate ? new Date(plan.startDate) : null;
        let profit = parseFloat(plan.profit) || 0;
        let exemptYears = parseFloat(plan.exemptYears) || 0;
        let schemeZakat = 0;
        if (startDate && !isNaN(startDate) && months > 0 && amt > 0) {
          for (let i = 0; i < months; i++) {
            let depositDate = new Date(startDate);
            depositDate.setMonth(depositDate.getMonth() + i);
            let yearsDiff = (today - depositDate) / (1000 * 3600 * 24 * 365.25);
            let effective = Math.max(0, yearsDiff - exemptYears);
            if (effective >= 1) schemeZakat += amt * 0.025 * Math.floor(effective);
          }
        } else if (startDate && !isNaN(startDate) && amt > 0 && months === 0) {
          let yearsDiff = (today - startDate) / (1000 * 3600 * 24 * 365.25);
          let effective = Math.max(0, yearsDiff - exemptYears);
          if (effective >= 1) schemeZakat += amt * 0.025 * Math.floor(effective);
        }
        if (startDate && profit > 0) {
          let overallYears = (today - startDate) / (1000 * 3600 * 24 * 365.25);
          if (Math.max(0, overallYears - exemptYears) >= 1) schemeZakat += profit * 0.025;
        }
        dpsTotal += schemeZakat;
      });
      totalZakat += dpsTotal;

      // Assets
      const getVal = (id) => parseFloat(document.getElementById(id)?.value) || 0;
      let gold = getVal('goldValue'), silver = getVal('silverValue'), cash = getVal('cash'), saving = getVal('saving');
      let businessBank = getVal('businessBank'), insurance = getVal('insurance'), realEstate = getVal('realEstate');
      let inventory = getVal('inventory'), stocks = getVal('stocks'), liabilities = getVal('liabilities');
      let totalAssets = gold + silver + cash + saving + businessBank + insurance + realEstate + inventory + stocks;
      let assetZakat = totalAssets * 0.025;
      let liabilityAdj = liabilities * 0.025;
      let netAssetZakat = assetZakat - liabilityAdj;
      totalZakat += netAssetZakat;

      // Livestock
      let cows = parseInt(document.getElementById('cows')?.value) || 0, cowVal = getVal('cowValue');
      let goats = parseInt(document.getElementById('goats')?.value) || 0, goatVal = getVal('goatValue');
      let camels = parseInt(document.getElementById('camels')?.value) || 0, camelVal = getVal('camelValue');
      let livestockTotal = (cows * cowVal) + (goats * goatVal) + (camels * camelVal);
      let livestockZakat = livestockTotal * 0.025;
      totalZakat += livestockZakat;

      // Display with icon for SAR
      const outputDiv = document.getElementById('output');
      if (currentCurrency === 'SAR') {
        outputDiv.innerHTML = `${sarSvg} ${totalZakat.toFixed(2)} ${getCurSymbol()}`;
      } else {
        outputDiv.innerHTML = `${getCurSymbol()} ${totalZakat.toFixed(2)}`;
      }
      const summaryDiv = document.getElementById('summaryDetails');
      summaryDiv.innerHTML = `
        <div class="breakdown-grid">
          <div class="breakdown-card positive">
            <span class="bc-label">📈 DPS Plans</span>
            <span class="bc-value">${formatCurrency(dpsTotal)}</span>
            <span class="bc-sub">Exemption period applied</span>
          </div>
          <div class="breakdown-card positive">
            <span class="bc-label">🏦 Assets &amp; Trade</span>
            <span class="bc-value">${formatCurrency(netAssetZakat)}</span>
            <span class="bc-sub">Gross total: ${formatCurrency(totalAssets)}</span>
          </div>
          <div class="breakdown-card negative">
            <span class="bc-label">📉 Liabilities</span>
            <span class="bc-value">−${formatCurrency(liabilityAdj)}</span>
            <span class="bc-sub">Deducted from assets</span>
          </div>
          <div class="breakdown-card positive">
            <span class="bc-label">🐄 Livestock</span>
            <span class="bc-value">${formatCurrency(livestockZakat)}</span>
            <span class="bc-sub">Total value: ${formatCurrency(livestockTotal)}</span>
          </div>
        </div>
        <div class="breakdown-total">
          <span class="bt-label"><i class="fas fa-star-of-life"></i> Total Zakat Due (2.5%)</span>
          <span class="bt-value">${formatCurrency(totalZakat)}</span>
        </div>
        <p class="help-text" style="margin-top: 0.75rem;">Wealth must be held beyond the exempt period + 1 lunar year to qualify.</p>
      `;
    }

    function formatCurrency(value) {
      if (currentCurrency === 'SAR') return `${sarSvgSmall} ${value.toFixed(2)}`;
      return `${getCurSymbol()} ${value.toFixed(2)}`;
    }

    function refreshCalculation() { computeTotalZakat(); }

    // DPS render
    function renderDPS() {
      const container = document.getElementById('dpsList');
      if (!container) return;
      container.innerHTML = '';
      if (dpsData.length === 0) {
        container.innerHTML = '<div class="dps-item" style="text-align:center;"><i class="fas fa-info-circle"></i> No DPS plans. Add a plan to include in Zakat calculation.</div>';
      } else {
        dpsData.forEach((item, idx) => {
          const div = document.createElement('div');
          div.className = 'dps-item';
          div.innerHTML = `
          <div class="dps-plan-header">
            <strong><i class="fas fa-file-invoice"></i> Plan #${idx + 1}</strong>
            <button class="btn-danger remove-dps" data-index="${idx}"><i class="fas fa-trash-alt"></i> Remove</button>
          </div>
          <div class="grid-2col">
            <div class="input-group"><label>Monthly Amount (${getCurSymbol()})</label><input type="number" class="dps-amount" data-idx="${idx}" value="${item.amount || ''}" placeholder="Monthly deposit"></div>
            <div class="input-group"><label>Installments (months)</label><input type="number" class="dps-months" data-idx="${idx}" value="${item.months || ''}" placeholder="Total months"></div>
            <div class="input-group"><label>Start Date</label><input type="date" class="dps-date" data-idx="${idx}" value="${item.startDate || ''}"></div>
            <div class="input-group"><label>Profit/Return (${getCurSymbol()})</label><input type="number" class="dps-profit" data-idx="${idx}" value="${item.profit || ''}" placeholder="Total profit"></div>
            <div class="input-group"><label><i class="fas fa-hourglass-half"></i> Exempt Years (no Zakat first N years)</label><input type="number" step="0.5" class="dps-exempt" data-idx="${idx}" value="${item.exemptYears || '0'}" placeholder="e.g., 3"></div>
          </div>
          <p class="help-text">Example: Start May 2022, exempt 3 years → Zakat applies from May 2026.</p>
        `;
          container.appendChild(div);
        });
      }
      document.querySelectorAll('.dps-amount').forEach(el => el.addEventListener('change', handleDPSChange));
      document.querySelectorAll('.dps-months').forEach(el => el.addEventListener('change', handleDPSChange));
      document.querySelectorAll('.dps-date').forEach(el => el.addEventListener('change', handleDPSChange));
      document.querySelectorAll('.dps-profit').forEach(el => el.addEventListener('change', handleDPSChange));
      document.querySelectorAll('.dps-exempt').forEach(el => el.addEventListener('change', handleDPSChange));
      document.querySelectorAll('.remove-dps').forEach(btn => btn.addEventListener('click', handleRemoveDPS));
    }

    function handleDPSChange(e) {
      const idx = e.target.getAttribute('data-idx');
      if (idx === null) return;
      const i = parseInt(idx);
      if (e.target.classList.contains('dps-amount')) dpsData[i].amount = parseFloat(e.target.value) || 0;
      else if (e.target.classList.contains('dps-months')) dpsData[i].months = parseInt(e.target.value) || 0;
      else if (e.target.classList.contains('dps-date')) dpsData[i].startDate = e.target.value;
      else if (e.target.classList.contains('dps-profit')) dpsData[i].profit = parseFloat(e.target.value) || 0;
      else if (e.target.classList.contains('dps-exempt')) dpsData[i].exemptYears = parseFloat(e.target.value) || 0;
      refreshCalculation();
    }

    function handleRemoveDPS(e) {
      const idx = e.currentTarget.getAttribute('data-index');
      if (idx !== null) { dpsData.splice(parseInt(idx), 1); renderDPS(); refreshCalculation(); }
    }

    function addNewDPS() { dpsData.push({ amount: 0, months: 0, startDate: '', profit: 0, exemptYears: 0 }); renderDPS(); refreshCalculation(); }

    function attachStaticInputs() {
      const ids = ['goldValue', 'silverValue', 'cash', 'saving', 'businessBank', 'insurance', 'realEstate', 'inventory', 'stocks', 'liabilities', 'cows', 'goats', 'camels', 'cowValue', 'goatValue', 'camelValue'];
      ids.forEach(id => { const el = document.getElementById(id); if (el) el.addEventListener('input', refreshCalculation); });
    }

    function initTabs() {
      const tabs = document.querySelectorAll('.tab-btn');
      const sections = { dps: document.getElementById('dps'), assets: document.getElementById('assets'), livestock: document.getElementById('livestock'), result: document.getElementById('result') };
      function activate(tabId) { Object.values(sections).forEach(s => s.classList.add('hidden')); if (sections[tabId]) sections[tabId].classList.remove('hidden'); tabs.forEach(t => { if (t.getAttribute('data-tab') === tabId) t.classList.add('active'); else t.classList.remove('active'); }); }
      tabs.forEach(t => t.addEventListener('click', () => activate(t.getAttribute('data-tab'))));
      activate('assets');
    }

    function initDarkMode() {
      const toggle = document.getElementById('darkmodeToggle'), label = document.getElementById('themeLabel');
      const isDark = localStorage.getItem('theme') === 'dark';
      if (isDark) { document.body.classList.add('dark'); label.innerText = 'Dark'; } else { document.body.classList.remove('dark'); label.innerText = 'Light'; }
      toggle.addEventListener('click', () => { document.body.classList.toggle('dark'); const dark = document.body.classList.contains('dark'); localStorage.setItem('theme', dark ? 'dark' : 'light'); label.innerText = dark ? 'Dark' : 'Light'; });
    }

    function initCurrency() {
      const select = document.getElementById('currencySelect');
      const sarSpan = document.getElementById('sarIconPlaceholder');
      function update() {
        currentCurrency = select.value;
        if (currentCurrency === 'SAR') sarSpan.innerHTML = `<svg width="18" height="18" viewBox="0 0 24.6 27.5" fill="currentColor"><path d="M15.3,24.4L15.3,24.4L15.3,24.4c-0.4,1-0.7,2-0.8,3.1l9.3-2c0.4-1,0.7-2,0.8-3.1L15.3,24.4z"/><path d="M23.8,19.6c0.4-1,0.7-2,0.8-3.1L17.4,18l0-3l6.4-1.4c0.4-1,0.7-2,0.8-3.1l-7.2,1.5l0-10.7c-1.1,0.6-2.1,1.5-2.9,2.4l0,8.8l-2.9,0.6l0-13.3c-1.1,0.6-2.1,1.5-2.9,2.4l0,11.5l-6.5,1.4c-0.4,1-0.7,2-0.8,3.1l7.3-1.6l0,3.7l-7.9,1.7c-0.4,1-0.7,2-0.8,3.1l8.2-1.7c0.7-0.1,1.2-0.5,1.6-1.1l1.5-2.2l0,0c0.2-0.2,0.2-0.5,0.2-0.8l0-3.3l2.9-0.6l0,5.9L23.8,19.6z"/></svg>`;
        else sarSpan.innerHTML = '';
        refreshCalculation();
        renderDPS(); // update DPS labels currency
      }
      select.addEventListener('change', update);
      update();
    }

    function init() {
      document.getElementById('year').textContent = new Date().getFullYear();
      dpsData = [];
      renderDPS();
      attachStaticInputs();
      initTabs();
      initDarkMode();
      initCurrency();
      refreshCalculation();
      document.getElementById('addDpsBtn')?.addEventListener('click', addNewDPS);
      document.getElementById('recalcBtn')?.addEventListener('click', refreshCalculation);
    }
    init();
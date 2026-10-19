const headers = ['ID', 'Context / Step', 'Description', 'Type', 'Required data', 'Notes'];
const types = { A: 'alert', M: 'milestone', C: 'check', S: 'step' };
const container = document.querySelector('#table-container');
const status = document.querySelector('#status');

function applyFilters() {
    const phases = new Set(Array.from(document.querySelectorAll('[data-phase]:checked'), el => el.dataset.phase));
    const selectedTypes = new Set(Array.from(document.querySelectorAll('[data-type]:checked'), el => el.dataset.type));
    container.querySelectorAll('tbody tr').forEach(row => {
        row.hidden = !phases.has(row.dataset.phase) ||
            Boolean(row.dataset.type && !selectedTypes.has(row.dataset.type));
    });
    container.classList.toggle('compact', !document.querySelector('#details').checked);
}

function validateData(data) {
    const table = data?.tables?.[0];
    if (!table || !Array.isArray(table.rows) || !table.rows.length ||
        !headers.every(header => table.headers?.includes(header)) ||
        !table.rows.every(row => row && typeof row.ID === 'string' &&
            Object.values(row).every(value => typeof value === 'string')) ||
        !table.rows.some(row => /^PHASE\s+[A-Z]\b/i.test(row.ID))) {
        throw new Error('Expected an intra-op table with phase headings and the six original columns.');
    }
    return data;
}

function render(data) {
    validateData(data);
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const head = document.createElement('tr');
    thead.append(head);
    table.append(thead);
    headers.forEach((header, i) => {
        const th = document.createElement('th');
        th.textContent = header;
        th.scope = 'col';
        th.className = ['id', 'context', 'descr', 'type', 'reqd', 'notes'][i];
        head.append(th);
    });
    const body = document.createElement('tbody');
    table.append(body);
    let phase = '';
    const availablePhases = new Map();
    data.tables[0].rows.forEach(row => {
        const id = row.ID.trim();
        const heading = id.match(/^PHASE\s+([A-Z])\b/i);
        const item = id.match(/^([A-Z])-([AMCS])\d+/i);
        if (heading) {
            phase = heading[1].toUpperCase();
            availablePhases.set(phase, id);
        }
        const tr = document.createElement('tr');
        body.append(tr);
        tr.dataset.phase = item ? item[1].toUpperCase() : phase;
        const type = item ? types[item[2].toUpperCase()] : '';
        tr.dataset.type = heading ? '' : (type || 'alert');
        tr.className = heading ? 'phase' : (type || 'yellow');
        if (heading || !item) {
            const td = document.createElement('td');
            tr.append(td);
            td.colSpan = headers.length;
            td.textContent = id;
        } else {
            headers.forEach((header, i) => {
                const td = document.createElement('td');
                tr.append(td);
                td.textContent = row[header] || '';
                if ([2, 4, 5].includes(i)) td.className = 'detail-text';
                if ([0, 1, 3].includes(i)) td.style.fontWeight = 'bold';
            });
        }
    });
    const phaseChoices = document.querySelector('#phase-choices');
    phaseChoices.replaceChildren();
    availablePhases.forEach((title, letter) => {
        const label = document.createElement('label');
        label.title = title;
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = true;
        input.dataset.phase = letter;
        label.append(input, ` ${letter}`);
        phaseChoices.append(label);

    });
    container.replaceChildren(table);
    applyFilters();
}

document.querySelector('#filters').addEventListener('change', applyFilters);
document.querySelector('#all-phases').addEventListener('click', () => {
    document.querySelectorAll('input[data-phase]').forEach(input => { input.checked = true; });
    applyFilters();
});

const initialLoad = window.loadIntraopSource().then(({ data, filename }) => {
    render(data);
    document.querySelector('h3').textContent = filename;
}).catch(error => { status.textContent = error.message; });

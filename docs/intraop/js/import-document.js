// Source URL relative to docs/intraop/index.html
// Use a published repository path, not a filesystem path
const fileToConvert = 'data/Intra-op Script v12.docx';  // this can be either json or docx

/* The conversion library is loaded only for DOCX sources --> Mammoth: https://github.com/mwilliamson/mammoth.js*/
(() => {
    const headers = ['ID', 'Context / Step', 'Description', 'Type', 'Required data', 'Notes'];
    function packageRows(rows, source) {
        if (!rows.some(row => /^[A-Z]-[AMCS]\d+/i.test(row.ID || ''))) {
            throw new Error('No intra-op row IDs found. Use a document with the original table format.');
        }
        return { source, table_count: 1, tables: [{ table_index: 0, headers, row_count: rows.length, rows }] };
    }
    async function loadMammoth() {
        if (window.mammoth) return window.mammoth;
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mammoth@1.9.1/mammoth.browser.min.js';
            script.onload = resolve;
            script.onerror = () => { script.remove(); reject(new Error('Could not load the DOCX converter. Check your connection.')); };
            document.head.append(script);
        });
        return window.mammoth;
    }
    async function docxRows(buffer) {
        const mammoth = await loadMammoth();
        const result = await mammoth.convertToHtml({ arrayBuffer: buffer }, {
            convertImage: mammoth.images.imgElement(() => Promise.resolve({ src: '' }))
        });
        // Parse off-DOM; render only text, never imported markup or links.
        const doc = new DOMParser().parseFromString(result.value, 'text/html');
        const table = Array.from(doc.querySelectorAll('table')).find(table =>
            headers.every((header, i) => table.querySelector('tr')?.children[i]?.textContent.trim() === header));
        if (!table) throw new Error('No table with the six original column headings found.');
        const grid = [];
        const rows = Array.from(table.querySelectorAll('tr')).slice(1);
        rows.forEach((tr, r) => {
            grid[r] ||= [];
            let column = 0;
            Array.from(tr.children).forEach(cell => {
                while (grid[r][column] !== undefined) column++;
                cell.querySelectorAll('p, br').forEach(el => el.append('\n'));
                const text = cell.textContent.trim();
                const width = Number(cell.getAttribute('colspan') || 1);
                const height = Number(cell.getAttribute('rowspan') || 1);
                if (width > 6 || height > rows.length || column + width > 6) {
                    throw new Error('Unexpected merged cells in the DOCX table.');
                }
                for (let y = r; y < r + height; y++) {
                    grid[y] ||= [];
                    for (let x = column; x < column + width; x++) {
                        grid[y][x] = x === column ? text : '';
                    }
                }
                column += width;
            });
        });
        return grid.map(cells => Object.fromEntries(headers.map((header, i) => [header, cells[i] || ''])))
            .filter(row => row.ID);
    }
    window.importIntraop = async file => {
        const extension = file.name.split('.').pop().toLowerCase();
        if (extension === 'json') return JSON.parse(await file.text());
        if (extension === 'docx') return packageRows(await docxRows(await file.arrayBuffer()), file.name);
        throw new Error('Choose a DOCX or JSON file.');
    };
    window.loadIntraopSource = async () => {
        if (/^(?:file:|\/Users\/)/i.test(fileToConvert)) {
            throw new Error('Set fileToConvert to a published relative URL, such as data/Intra-op Script v12.docx.');
        }
        const filename = fileToConvert.split(/[?#]/)[0].split('/').pop();
        if (!/\.(docx|json)$/i.test(filename)) throw new Error('Source must be a DOCX or JSON file.');
        const response = await fetch(fileToConvert, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Unable to load ${fileToConvert} (${response.status}).`);
        const data = await window.importIntraop({
            name: filename,
            text: () => response.text(),
            arrayBuffer: () => response.arrayBuffer()
        });
        return { data, filename };
    };
})();

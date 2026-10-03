
// Load JSON file using fetch API
// const datafile = 'data/data.json';
const datafile = 'data/Intra-op-Script-v12.json';
fetch(datafile)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {

		// console.log(data);

		const tableContainer = document.querySelector('#table-container');
		const table = document.createElement('table');
        const thead = document.createElement('thead');
        thead.setAttribute('bgcolor', '#2c4d76')
        thead.setAttribute('style', 'color: #fff')
        const tbody = document.createElement('tbody');
        tableContainer.appendChild(table);        
        table.appendChild(thead);
        table.appendChild(tbody);

        const thWidths = [10, 20, 40, 8, 16, 16];
        const colCount = thWidths.length;
        const headers = data.tables[0].headers;
        headers.forEach((item, i) => {
        	const thEl = document.createElement('th');
        	thEl.textContent = item;
        	thEl.setAttribute("style", `width:${thWidths[i]}%`)

        	thead.appendChild(thEl);

        })
        // console.log(data.tables[0].rows);

        const rows = data.tables[0].rows;

        rows.forEach(row => {
            var rowEl = document.createElement('tr');
            var rowTypeIsNormal = true;
            headers.every((col_head, i) => {
            	var cellText = row[col_head];
            	const td = document.createElement('td');

            	// IF it is the first cell of a row
            	if ((cellText) && (i==0)) {
	            	var cellLeft6 = cellText.slice(0, 6);
	            	var cellLeft9 = cellText.slice(0, 9);
	            	var cellText2 = cellText.slice(2, 3);
	            	if (cellText2=='A') {
		            	rowEl.setAttribute('bgcolor', '#fdf2d0')
	            	} else if (cellText2=='M') {
		            	rowEl.setAttribute('bgcolor', '#ccd9f5')
	            	} else if (cellText2=='C') {
		            	rowEl.setAttribute('bgcolor', '#edcdcd')
	            	}
	            	if (cellLeft6=='PHASE ') {
	            		rowEl.setAttribute('bgcolor', '#6a99d0')
	            		rowEl.setAttribute('style', 'color: #fff')
	            	}
	            	if (cellLeft9=='The below') {
	            		rowEl.setAttribute('bgcolor', '#ffff54')
	            	}

	            	td.setAttribute('style', 'font-weight:bold');
	            	// IF the content means it should be full span
	            	if ((cellLeft6=='PHASE ') || (cellLeft9=='The below'))  {
		            	td.innerHTML = cellText;
		            	td.setAttribute('colspan', "9");
		            	rowTypeIsNormal = false;
	            		rowEl.appendChild(td);
		            	return true;
	            	}


	            // IF it is a later cell of a row
            	} else if (i>0) {

            		// IF it was a full span row - then break out of the headers loop
            		if (rowTypeIsNormal==false) {
            			return false;
            		
            		// IF it was not a full span row - don't break out of the headers loop
	            	} else {
	            		td.innerHTML = cellText;
	            		rowEl.appendChild(td);
	            		if ((i==1) || (i==3)) {
	            			td.setAttribute('style', 'font-weight:bold');
	            		}
	            		return true;
	            	}
	            }
    			td.innerHTML = cellText;
	            rowEl.appendChild(td);
	            return true;
            })
            tbody.appendChild(rowEl);
        });
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });





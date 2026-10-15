
// Load JSON file using fetch API
const datafile = 'data/Intra-op-Script-v12-1.json';
fetch(datafile)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {

    	// create the table
		const tableContainer = document.querySelector('#table-container');
		const table = document.createElement('table');
        const thead = document.createElement('thead');
        thead.setAttribute('bgcolor', '#2c4d76')
        thead.setAttribute('style', 'color: #fff')
        const tbody = document.createElement('tbody');
        tableContainer.appendChild(table);        
        table.appendChild(thead);
        table.appendChild(tbody);

        const thWidths = ['id', 'context', 'descr', 'type', 'reqd', 'notes'];
        const colCount = thWidths.length;
        const headers = data.tables[0].headers;
        headers.forEach((item, i) => {
        	const thEl = document.createElement('th');
        	thEl.textContent = item;
        	thEl.classList.add(thWidths[i])

        	thead.appendChild(thEl);

        })

        const rows = data.tables[0].rows;

        // populate the table rows
        rows.forEach(row => {
            var rowEl = document.createElement('tr');
            var rowTypeIsNormal = true;
            headers.every((col_head, i) => {
            	var cellText = row[col_head];
            	const td = document.createElement('td');

            	// IF it is the first cell of a row, set the row class based on the initial content
            	if ((cellText) && (i==0)) {
	            	var cellLeft1 = cellText.slice(0, 1);
	            	var cellLeft6 = cellText.slice(0, 6);
	            	var cellLeft9 = cellText.slice(0, 9);
	            	var cellText2 = cellText.slice(2, 3);
	            	if ((cellText2=='A') && (cellLeft6!='PHASE ')) {
		            	rowEl.classList.add('alert');
	            	} else if (cellText2=='M') {
		            	rowEl.classList.add('milestone');
	            	} else if (cellText2=='C') {
		            	rowEl.classList.add('check');
	            	} else if (cellText2=='S') {
		            	rowEl.classList.add('step');
	            	}
	            	if (cellLeft6=='PHASE ') {
		            	rowEl.classList.add('phase');
	            	}
	            	if (cellLeft9=='The below') {
		            	rowEl.classList.add('yellow');
	            	}
	            	if (cellLeft9=='REPEAT SA') {
		            	rowEl.classList.add('yellow');
	            	}
	            	if        (cellLeft1=='A') {
	            		rowEl.classList.add('phase-a');
	            	} else if (cellLeft1=='B') {
	            		rowEl.classList.add('phase-b');
	            	} else if (cellLeft1=='C') {
	            		rowEl.classList.add('phase-c');
	            	} else if (cellLeft1=='D') {
	            		rowEl.classList.add('phase-d');
	            	} else if (cellLeft1=='E') {
	            		rowEl.classList.add('phase-e');
	            	} else if (cellLeft1=='F') {
	            		rowEl.classList.add('phase-f');
	            	} else if (cellLeft1=='G') {
	            		rowEl.classList.add('phase-g');
	            	}

	            	td.setAttribute('style', 'font-weight:bold');
	            	// IF the content means it should be full span
	            	if ((cellLeft6=='PHASE ') || (cellLeft9=='The below') || (cellLeft9=='REPEAT SA'))  {
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
	            		const span = document.createElement('span');
	            		span.innerHTML = cellText;
	            		td.appendChild(span);
	            		rowEl.appendChild(td);
	            		if ((i==1) || (i==3)) {
	            			td.setAttribute('style', 'font-weight:bold');
	            		} else {
	            			span.classList.add('detail-text');
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
    .then(x => {
    	// Set up the first and second column width changes for toggling

		const thead = document.getElementsByTagName('thead')[0];
		const contextHead = thead.getElementsByTagName('th')[1]
		const descrHead = thead.getElementsByTagName('th')[2]

		const cellContents = document.querySelectorAll('.detail-text');
		toggleRows.addEventListener('click', () => {
			contextHead.classList.toggle('wide-context');
			descrHead.classList.toggle('slim-descr');
			cellContents.forEach(cell => {
				cell.classList.toggle('hide');
			})
		})    	

		const rowsA = document.querySelectorAll('.alert');
		const rowsY = document.querySelectorAll('.yellow');  // lumps all yellow full-width rows in with alerts for toggling
		toggleA.addEventListener('click', () => {
			rowsY.forEach(row => row.classList.toggle('hide'))
			rowsA.forEach(row => {
				row.classList.toggle('hide');
			})
		})    	

		const rowsM = document.querySelectorAll('.milestone');
		toggleM.addEventListener('click', () => {
			rowsM.forEach(row => {
				row.classList.toggle('hide');
			})
		})    	

		const rowsC = document.querySelectorAll('.check');
		toggleC.addEventListener('click', () => {
			rowsC.forEach(row => {
				row.classList.toggle('hide');
			})
		})    	

		const rowsS = document.querySelectorAll('.step');
		toggleS.addEventListener('click', () => {
			rowsS.forEach(row => {
				row.classList.toggle('hide');
			})
		})    	

		const rowsPhA = document.querySelectorAll('.phase-a');
		togglePhA.addEventListener('click', () => {
			rowsY.forEach(row => row.classList.toggle('hide'))  // first yellow full-width row lumped into phase A
			rowsPhA.forEach(row => {
				row.classList.toggle('phide');
			})
		})   
		const rowsPhB = document.querySelectorAll('.phase-b');
		togglePhB.addEventListener('click', () => {
			rowsPhB.forEach(row => {
				row.classList.toggle('phide');
			})
		})   

		const rowsPhC = document.querySelectorAll('.phase-c');
		togglePhC.addEventListener('click', () => {
			rowsPhC.forEach(row => {
				row.classList.toggle('phide');
			})
		})   
		const rowsPhD = document.querySelectorAll('.phase-d');
		togglePhD.addEventListener('click', () => {
			rowsPhD.forEach(row => {
				row.classList.toggle('phide');
			})
		})   
		const rowsPhE = document.querySelectorAll('.phase-e');
		togglePhE.addEventListener('click', () => {
			rowsPhE.forEach(row => {
				row.classList.toggle('phide');
			})
		})   
		const rowsPhF = document.querySelectorAll('.phase-f');
		togglePhF.addEventListener('click', () => {
			rowsPhF.forEach(row => {
				row.classList.toggle('phide');
			})
		})   
		const rowsPhG = document.querySelectorAll('.phase-g');
		togglePhG.addEventListener('click', () => {
			rowsPhG.forEach(row => {
				row.classList.toggle('phide');
			})
		})   









    })
    .catch(error => {
        console.error('Error loading JSON and making table:', error);
    });








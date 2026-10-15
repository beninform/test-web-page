

const divEl = document.getElementById("table-container");
const parEl1 = document.getElementById("key-para");
const parEl2 = document.createElement("p");

parEl1.textContent = "A brand new paragraph";
parEl2.textContent = "New added text";

divEl.appendChild(parEl2);
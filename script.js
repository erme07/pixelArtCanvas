const lienzo = document.querySelector(".canvas")

let grilla = document.createDocumentFragment();
for (i = 0; i < 980; i++) {
  const celda = document.createElement("DIV");
  celda.classList.add("cell")
  celda.id = `cell${i + 1}`
  grilla.appendChild(celda)
}
lienzo.appendChild(grilla);
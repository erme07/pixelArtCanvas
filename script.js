const lienzo = document.querySelector(".canvas")

let grilla = document.createDocumentFragment();
for (i = 0; i < 980; i++) {
  const celda = document.createElement("DIV");
  celda.classList.add("celda")
  grilla.appendChild(celda)
}
lienzo.appendChild(grilla);
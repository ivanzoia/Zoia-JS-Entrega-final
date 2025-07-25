const productos = [
  { nombre: "El Gran Bart Azul Marino", imagen: "imagenes/ropa1.webp", stock: 10, precio: 23999 },
  { nombre: "El Gran Bart Blanca", imagen: "imagenes/ropa2.webp", stock: 10, precio: 23999 },
  { nombre: "Lionel Hutz Gris Claro", imagen: "imagenes/ropa3.webp", stock: 10, precio: 23999 },
  { nombre: "Lionel Hutz Negro", imagen: "imagenes/ropa4.webp", stock: 10, precio: 23999 },
  { nombre: "Lionel Hutz Roja", imagen: "imagenes/ropa5.webp", stock: 10, precio: 23999 },
  { nombre: "Lionel Hutz Blanca", imagen: "imagenes/ropa6.webp", stock: 10, precio: 23999 },
  { nombre: "Lisa FLOREDA Azul Marino", imagen: "imagenes/ropa7.webp", stock: 10, precio: 23999 },
  { nombre: "Lisa FLOREDA Gris Claro", imagen: "imagenes/ropa8.webp", stock: 10, precio: 23999 },
  { nombre: "Lisa FLOREDA Negra", imagen: "imagenes/ropa9.webp", stock: 10, precio: 23999 },
  { nombre: "Peces del Infierno Azul Marino", imagen: "imagenes/ropa10.webp", stock: 10, precio: 23999 },
  { nombre: "Peces del Infierno Blanca", imagen: "imagenes/ropa11.webp", stock: 10, precio: 23999 },
  { nombre: "Peces del Infierno Gris", imagen: "imagenes/ropa12.webp", stock: 10, precio: 23999 },
  { nombre: "Peces del Infierno Negra", imagen: "imagenes/ropa13.webp", stock: 10, precio: 23999 },
  { nombre: "Plankton Blaca", imagen: "imagenes/ropa14.webp", stock: 10, precio: 23999 },
  { nombre: "Plankton Negras", imagen: "imagenes/ropa15.webp", stock: 10, precio: 23999 },
  { nombre: "Remera Básica", imagen: "imagenes/ropa16.webp", stock: 10, precio: 23999 }
];

const carrito = [];
const contenedor = document.getElementById("productos");
const listaPedido = document.getElementById("listaPedido");
const totalPedido = document.getElementById("totalPedido");
const iconoCarrito = document.getElementById("iconoCarrito");
const detallePedido = document.getElementById("detallePedido");
const formulario = document.getElementById("formulario");
const btnFinalizar = document.getElementById("btnFinalizar");

function renderProductos() {
  if (!contenedor) return;
  contenedor.innerHTML = "";
  productos.forEach((prod, index) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" />
      <h3>${prod.nombre}</h3>
      <p class="stock">Stock: ${prod.stock}</p>
      <p>$${prod.precio}</p>
      <button class="btn" onclick="agregarAlCarrito(${index})" ${prod.stock === 0 ? 'disabled' : ''}>Comprar</button>
    `;
    contenedor.appendChild(div);
  });
}

function agregarAlCarrito(index) {
  const prod = productos[index];
  if (prod.stock > 0) {
    carrito.push(prod);
    prod.stock--;
    actualizarCarrito();
    renderProductos();
  }
}

function actualizarCarrito() {
  if (!iconoCarrito) return;
  iconoCarrito.setAttribute("data-count", carrito.length);
  if (!listaPedido) return;
  listaPedido.innerHTML = "";
  let total = 0;
  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio}`;
    listaPedido.appendChild(li);
    total += item.precio;
  });
  if(totalPedido) totalPedido.textContent = total;
}

if (iconoCarrito) {
  iconoCarrito.addEventListener("click", () => {
    const miniResumen = document.getElementById("miniResumen");
    if(miniResumen) {
      miniResumen.style.display = miniResumen.style.display === "block" ? "none" : "block";
    }
  });
}

if (btnFinalizar) {
  btnFinalizar.addEventListener("click", () => {
    // carrito en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
    // pestaña formulario.html
    window.open("formulario.html", "_blank");
  });
}

if (formulario) {
  formulario.addEventListener("submit", function(e) {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const direccion = document.getElementById("direccion").value;
    const dni = document.getElementById("dni").value;
    const email = document.getElementById("email").value;

    if (carrito.length === 0) {
      alert("Debes seleccionar al menos un producto.");
      return;
    }

    const pedido = carrito.map(p => p.nombre).join(", ");

    emailjs.send("TU_SERVICE_ID", "TU_TEMPLATE_ID", {
      nombre,
      direccion,
      dni,
      email,
      pedido
    })
    .then(() => {
      alert("¡Correo enviado con éxito!");
      carrito.length = 0;
      productos.forEach(p => p.stock = 10);
      actualizarCarrito();
      renderProductos();
      formulario.reset();
      formulario.style.display = "none";
    })
    .catch((error) => {
      console.error("Error al enviar el correo:", error);
      alert("Hubo un error al enviar el correo.");
    });
  });
}

renderProductos();

document.addEventListener("DOMContentLoaded", () => {
  //en formulario.html, carga resumen y formulario
  if (window.location.pathname.includes("formulario.html")) {
    const resumen = JSON.parse(localStorage.getItem("carrito")) || [];
    const listaResumen = document.getElementById("listaResumen");
    const totalResumen = document.getElementById("totalResumen");
    const formulario = document.getElementById("formulario");

    if(listaResumen && totalResumen){
      let total = 0;
      resumen.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.nombre} - $${item.precio}`;
        listaResumen.appendChild(li);
        total += item.precio;
      });
      totalResumen.textContent = total;
    }

    if(formulario){
      formulario.addEventListener("submit", function(e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const direccion = document.getElementById("direccion").value;
        const dni = document.getElementById("dni").value;
        const email = document.getElementById("email").value;
        const pedido = resumen.map(p => p.nombre).join(", ");

        emailjs.send("TU_SERVICE_ID", "TU_TEMPLATE_ID", {
          nombre,
          direccion,
          dni,
          email,
          pedido
        })
        .then(() => {
          alert("Compra finalizada y correo enviado.");
          localStorage.removeItem("carrito");
          window.close();
        })
        .catch((error) => {
          console.error("Error al enviar el correo:", error);
          alert("Hubo un error al enviar el correo.");
        });
      });
    }
  }
});


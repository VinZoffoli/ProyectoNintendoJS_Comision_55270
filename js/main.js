let productos = [];
const productosPorPagina = 8; 
let paginaActual = 1;
const urlParams = new URLSearchParams(window.location.search);
const searchTerm = urlParams.get('search');

fetch("./js/productos.json")
  .then((response) => response.json())
  .then((data) => {
    productos = data;
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    
    if (searchTerm) {
      const productosFiltrados = productos.filter(producto =>
        producto.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      cargarProductos(productosFiltrados);
    } else {
      cargarProductos(productos);
    }
    
    actualizarNumerito();
  });

const searchIcon = document.getElementById('search-icon');
const searchInput = document.getElementById('search-input');
const productosFiltrados = [];
const botonesFiltro = document.querySelectorAll(".filters div[data-filter]");
const contenedorFiltros = document.querySelector(".filterswiper-wrapper");
const inputBuscador = document.querySelector(".Buscador input[type='text']");
const botonBuscador = document.querySelector(".Buscador .btn");
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    const filtro = boton.getAttribute("data-filter");
    const productosFiltrados = productos.filter(
      (producto) => filtro === "todos" || producto.categoria.id === filtro
    );
    paginaActual = 1;
    cargarProductos(productosFiltrados);
  });
});

searchIcon.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (searchTerm) {
    const productosFiltrados = productos.filter(producto =>
      producto.titulo.toLowerCase().includes(searchTerm)
    );
    cargarProductos(productosFiltrados);
  }
});

searchInput.addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
      const productosFiltrados = productos.filter(producto =>
        producto.titulo.toLowerCase().includes(searchTerm)
      );
      cargarProductos(productosFiltrados);
    }
  }
});



botonBuscador.addEventListener("click", () => {
  const searchTerm = inputBuscador.value.toLowerCase();
  const productosFiltrados = productos.filter((producto) =>
    producto.titulo.toLowerCase().includes(searchTerm)
  );
  cargarProductos(productosFiltrados);
});

inputBuscador.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const searchTerm = inputBuscador.value.toLowerCase();
    const productosFiltrados = productos.filter((producto) =>
      producto.titulo.toLowerCase().includes(searchTerm)
    );
    cargarProductos(productosFiltrados);
  }
});

if (searchTerm) {
  const productosFiltrados = productos.filter(producto =>
    producto.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  cargarProductos(productosFiltrados);
}

botonesCategorias.forEach((boton) =>
  boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
  })
);

function cargarProductos(productosElegidos) {
  contenedorProductos.innerHTML = "";
  const startIndex = (paginaActual - 1) * productosPorPagina;
  const endIndex = startIndex + productosPorPagina;
  const productosPagina = productosElegidos.slice(startIndex, endIndex);

  botonesFiltro.forEach((boton) => {
    boton.classList.remove("active");
    if (
      (boton.getAttribute("data-filter") === "todos" && paginaActual === 1) ||
      boton.getAttribute("data-filter") === productosElegidos[0].categoria.id
    ) {
      boton.classList.add("active");
    }
  });

  productosPagina.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("box", "item");

    div.innerHTML = `
        <div class="slide-img">
            <img src="${producto.imagen}" alt="${producto.titulo}" />
            <div class="overlay">
                <a href="#" class="buy-btn">Comprar</a>
            </div>
        </div>
        <div class="detail-box">
            <div class="type">
                <a href="#">${producto.titulo}</a>
                <span>${producto.categoria.nombre}</span>
            </div>
            <a href="#" class="price">$${producto.precio}</a>
        </div>
    `;

    const addToCartButton = div.querySelector(".buy-btn");
    addToCartButton.addEventListener("click", (event) => {
      event.preventDefault();
      agregarAlCarrito(producto);
    });

    contenedorProductos.append(div);
  });
  const totalPages = Math.ceil(productosElegidos.length / productosPorPagina);
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageNumber = document.createElement("a");
    pageNumber.href = "#";
    pageNumber.textContent = i;
    pageNumber.classList.add("link");
    if (i === paginaActual) {
      pageNumber.classList.add("active");
    }

    pageNumber.addEventListener("click", () => {
      paginaActual = i;
      cargarProductos(productosElegidos);
    });

    paginationContainer.appendChild(pageNumber);
  }

  updateBtn();
}

botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach((boton) => boton.classList.remove("active"));
    e.currentTarget.classList.add("active");

    paginaActual = 1;

    if (e.currentTarget.id != "todos") {
      const productoCategoria = productos.find(
        (producto) => producto.categoria.id === e.currentTarget.id
      );
      tituloPrincipal.innerText = productoCategoria.categoria.nombre;
      const productosBoton = productos.filter(
        (producto) => producto.categoria.id === e.currentTarget.id
      );
      cargarProductos(productosBoton);
    } else {
      tituloPrincipal.innerText = "Todos los productos";
      cargarProductos(productos);
    }
    botonBuscador.addEventListener("click", () => {
      const searchTerm = inputBuscador.value.toLowerCase();
      const categoriaActual = document.querySelector(
        ".boton-categoria.active"
      ).id;

      const productosFiltrados = productos.filter(
        (producto) =>
          (categoriaActual === "todos" ||
            producto.categoria.id === categoriaActual) &&
          producto.titulo.toLowerCase().includes(searchTerm)
      );

      cargarProductos(productosFiltrados);
    });

    inputBuscador.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        const searchTerm = inputBuscador.value.toLowerCase();
        const categoriaActual = document.querySelector(
          ".boton-categoria.active"
        ).id;

        const productosFiltrados = productos.filter(
          (producto) =>
            (categoriaActual === "todos" ||
              producto.categoria.id === categoriaActual) &&
            producto.titulo.toLowerCase().includes(searchTerm)
        );

        cargarProductos(productosFiltrados);
      }
    });
  });
});

function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".add-to-cart");

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", agregarAlCarrito);
  });
}

let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito") || "[]");
actualizarNumerito();
let totalProductosEnCarrito = 0;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
  productosEnCarrito = JSON.parse(productosEnCarritoLS);
  actualizarNumerito();
} else {
  productosEnCarrito = [];
}

function agregarAlCarrito(producto) {
  Toastify({
    text: "Producto agregado",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #4b33a8, #785ce9)",
      borderRadius: "2rem",
      textTransform: "uppercase",
      fontSize: ".75rem",
    },
    offset: {
      x: "1.5rem",
      y: "1.5rem",
    },
    onClick: function () {},
  }).showToast();

  const productoEnCarrito = productosEnCarrito.find(
    (p) => p.id === producto.id
  );

  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    producto.cantidad = 1;
    productosEnCarrito.push(producto);
  }

  totalProductosEnCarrito += producto.cantidad;
  actualizarNumerito();
  
  
  localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
  const nuevoNumerito = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );
  numerito.innerText = nuevoNumerito;

  const iconosCarrito = document.querySelectorAll(".fa-shopping-cart");
  iconosCarrito.forEach((icono) => {
    icono.nextElementSibling.textContent = nuevoNumerito;
  });
}

//PAGINATION//
const startBtn = document.querySelector("#startBtn"),
  endBtn = document.querySelector("#endBtn"),
  prevNext = document.querySelectorAll(".prevNext"),
  numbers = document.querySelectorAll(".link");

let currentStep = 0;

const updateBtn = () => {
  if (currentStep === 9) {
    endBtn.disabled = true;
    prevNext[1].disabled = true;
  } else if (currentStep === 0) {
    startBtn.disabled = true;
    prevNext[0].disabled = true;
  } else {
    endBtn.disabled = false;
    prevNext[1].disabled = false;
    startBtn.disabled = false;
    prevNext[0].disabled = false;
  }
};

prevNext.forEach((button) => {
  button.addEventListener("click", (e) => {
    if (e.target.id === "prev" && paginaActual > 1) {
      paginaActual--;
    } else if (e.target.id === "next" && paginaActual < totalPages) {
      paginaActual++;
    }
    cargarProductos(productos);
    updateBtn(); 
  });
});

numbers.forEach((number, numIndex) => {
  number.addEventListener("click", (e) => {
    e.preventDefault();
    paginaActual = numIndex + 1;
    cargarProductos(productos);
    updateBtn(); 
  });
});

startBtn.addEventListener("click", () => {
  document.querySelector(".active").classList.remove("active");
  numbers[0].classList.add("active");
  currentStep = 0;
  updateBtn();
  endBtn.disabled = false;
  prevNext[1].disabled = false;
});

endBtn.addEventListener("click", () => {
  document.querySelector(".active").classList.remove("active");
  numbers[9].classList.add("active");
  currentStep = 9;
  updateBtn();
  startBtn.disabled = false;
  prevNext[0].disabled = false;
});
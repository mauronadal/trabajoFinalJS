

const productosCarrito = "carritoproductosId";

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  cargarProductoCarrito();
});

function getProductosDb() {
  const url = "./dbProductos.json";

  return fetch(url)
    .then(response => {
      return response.json();
    })
    .then(result => {
      return result;
    })
    .catch(err => {
      console.log(err);
    });
}

async function cargarProductos() {
  const productos = await getProductosDb();


  let html = "";
  productos.forEach(producto => {
    html += `
        <div class="producto-container">
            <div class="card producto">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" />
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="extraInfo">${producto.extraInfo}</p>
                    <p class="card-text">$ ${producto.precio}</p>
                    <button type="button" class="btn btn-primary btn-cart" onClick=(agregarProductoCarrito(${producto.id}))>Añadir al carrito</button>
                </div>
            </div>
        </div>
      `;
  });

  document.getElementsByClassName("productos")[0].innerHTML = html;
}



function abrirCerrarCarrito() {
  const containerCarrito = document.getElementsByClassName("cart-productos")[0];

  containerCarrito.classList.forEach(item => {
    if (item === "hidden") {
      containerCarrito.classList.remove("hidden");
      containerCarrito.classList.add("active");
    }

    if (item === "active") {
      containerCarrito.classList.remove("active");
      containerCarrito.classList.add("hidden");
    }
  });
}

function agregarProductoCarrito(idProducto) {
  let arrayproductosId = [];

  let localStorageItems = localStorage.getItem(productosCarrito);


  if (localStorageItems === null) {
    arrayproductosId.push(idProducto);
    localStorage.setItem(productosCarrito, arrayproductosId);
  } else {
    let productosId = localStorage.getItem(productosCarrito);
    if (productosId.length > 0) {
      productosId += "," + idProducto;
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'El producto fue agregado correctamente',
        showConfirmButton: false,
        timer: 2000
      })
    } else {
      productosId = productId;
    }
    localStorage.setItem(productosCarrito, productosId);
  }

  cargarProductoCarrito();
}

async function cargarProductoCarrito() {
  const productos = await getProductosDb();


  const localStorageItems = localStorage.getItem(productosCarrito);

  let html = "";
  if (!localStorageItems) {
    html = `
        <div class="cart-producto empty">
            <p>Carrito vacio.</p>
        </div>
      `;
  } else {
    const idproductosSplit = localStorageItems.split(",");


    const idproductosCarrito = Array.from(new Set(idproductosSplit));

    idproductosCarrito.forEach(id => {
      productos.forEach(producto => {
        if (id == producto.id) {
          const cantidad = countDuplicatesId(id, idproductosSplit);
          const precioTotal = producto.precio * cantidad;



          html += `
  
            <div class="cart-producto">
                <img src="${producto.imagen}" alt="${producto.nombre}" />
                <div class="cart-producto-info">
                    <span class="cantidad">${cantidad}</span>
                    <p>${producto.nombre}</p>
                    <p>$ ${precioTotal.toFixed(2)}</p>
                    <p class="change-cantidad">
                        <button onClick="restarCantidad(${producto.id
            })">-</button>
                        <button onClick="aumentarCantidad(${producto.id
            })">+</button>
                    </p>
                    <p class="cart-producto-borrar">
                        <button onClick=(borrarProductoCarrrito(${producto.id
            }))>Eliminar</button>
                    </p>
                </div>
           </div>
         
        `;
        }
      });
    });
  }

  document.getElementsByClassName("cart-productos")[0].innerHTML = html;
}

function borrarProductoCarrrito(idProducto) {
  const idproductosCarrito = localStorage.getItem(productosCarrito);
  const arrayIdproductosCarrito = idproductosCarrito.split(",");
  const resultIdDelete = deleteAllIds(idProducto, arrayIdproductosCarrito);

  if (resultIdDelete) {
    let count = 0;
    let idsString = "";

    resultIdDelete.forEach(id => {
      count++;
      if (count < resultIdDelete.length) {
        idsString += id + ",";
      } else {
        idsString += id;
      }
    });
    localStorage.setItem(productosCarrito, idsString);
  }

  const idsLocalStorage = localStorage.getItem(productosCarrito);
  if (!idsLocalStorage) {
    localStorage.removeItem(productosCarrito);
  }

  cargarProductoCarrito();
}

function aumentarCantidad(idProducto) {
  const idproductosCarrito = localStorage.getItem(productosCarrito);
  const arrayIdproductosCarrito = idproductosCarrito.split(",");
  arrayIdproductosCarrito.push(idProducto);

  let count = 0;
  let idsString = "";
  arrayIdproductosCarrito.forEach(id => {
    count++;
    if (count < arrayIdproductosCarrito.length) {
      idsString += id + ",";
    } else {
      idsString += id;
    }
  });
  localStorage.setItem(productosCarrito, idsString);
  cargarProductoCarrito();
}

function restarCantidad(idProducto) {
  const idproductosCarrito = localStorage.getItem(productosCarrito);
  const arrayIdproductosCarrito = idproductosCarrito.split(",");

  const deleteItem = idProducto.toString();
  let index = arrayIdproductosCarrito.indexOf(deleteItem);
  if (index > -1) {
    arrayIdproductosCarrito.splice(index, 1);
  }

  let count = 0;
  let idsString = "";
  arrayIdproductosCarrito.forEach(id => {
    count++;
    if (count < arrayIdproductosCarrito.length) {
      idsString += id + ",";
    } else {
      idsString += id;
    }
  });
  localStorage.setItem(productosCarrito, idsString);
  cargarProductoCarrito();
}

function countDuplicatesId(value, arrayIds) {
  let count = 0;
  arrayIds.forEach(id => {
    if (value == id) {
      count++;
    }
  });
  return count;
}

function deleteAllIds(id, arrayIds) {
  return arrayIds.filter(itemId => {
    return itemId != id;
  });
}







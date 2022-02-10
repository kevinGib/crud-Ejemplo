const db = firebase.firestore(); //Creacion de una referencia de la BD

const registroform = document.getElementById("registro-form");
const editform = document.getElementById("edit-form");
const contenedorusuarios = document.getElementById("contenedor-usuarios");

let editStatus = false; //Variavle que controla la edición del formulario
let id = "";

///METODO PARA GUARDAR EN FIREBASE
const saveregistro = (clave, foto, nombre, edad, sexo, salario) =>
  db.collection("usuarios").doc().set({
    clave,
    foto,
    nombre,
    edad,
    sexo,
    salario,
  });

////METODO PARA OBTENER LA TABLA CON LOS REGISTROS
const obtenertabla = () => db.collection("usuarios").get();

const getDatos = (id) => db.collection("usuarios").doc(id).get();

const onGetTabla = (callback) => db.collection("usuarios").onSnapshot(callback);

const deleteusuario = (id) => db.collection("usuarios").doc(id).delete();

const updateDatos = (id, updateDatos) =>
  db.collection("usuarios").doc(id).update(updateDatos);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTabla((querySnapshot) => {
    contenedorusuarios.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const registro = doc.data();
      registro.id = doc.id;
      //console.log(registro);

      contenedorusuarios.innerHTML += `<div class="card">
                <table  align="center">  
                <tr>
                <td>${registro.clave}</td>
                <td><img src= ${registro.foto} width=100px height=100px></img></td>
                <td>${registro.nombre}</td>
                <td>${registro.edad}</td>
                <td>${registro.sexo}</td>
                <td>$ ${registro.salario}</td>
                <td><button type="button" class="btn btn-warning btn-edit boton" data-bs-toggle="modal" data-bs-target="#modalModificar"
                data-bs-whatever="@mdo" data-id="${registro.id}">Modificar</button>

                <button class="btn btn-danger btn-delete boton" data-id="${registro.id}">Eliminar</button>
                </td>
                </tr>            
                </table>    
            </div>`;

      const btnDelete = document.querySelectorAll(".btn-delete");
      btnDelete.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          await deleteusuario(e.target.dataset.id);
        });
      });

      const btnsEdit = document.querySelectorAll(".btn-edit");
      btnsEdit.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const doc = await getDatos(e.target.dataset.id);
          const modifica = doc.data();

          editStatus = true;
          id = doc.id;

          editform["modClave"].value = modifica.clave;
          editform["modfoto"].value = modifica.foto;
          editform["modNombre"].value = modifica.nombre;
          editform["modEdad"].value = modifica.edad;
          editform["modSalario"].value = modifica.salario;
          editform["btn-edit-form"].innerText = "Guardar";
        });
      });
    });
  });
});

///Obtener los valores del formulario para registrar
var sexo = "";
registroform.addEventListener("submit", async (e) => {
  e.preventDefault();

  const clave = registroform["clave"].value;
  const foto = registroform["foto"].value;
  const nombre = registroform["nombre"].value;
  const edad = registroform["edad"].value;
  const salario = registroform["salario"].value;

  // VALIDACION DE SEXO
  if (document.getElementById("hombre").checked) {
    sexo = "hombre";
  } else {
    sexo = "mujer";
  }

  // Utilizamos el método saveregistro para vaciar los datos a la base
  await saveregistro(clave, foto, nombre, edad, sexo, salario);
  //console.log(clave, foto, nombre, edad,sexo, salario);

  obtenertabla();
  registroform.reset();
});

/////////////PARA EDITAR
editform.addEventListener("submit", async (e) => {
  e.preventDefault();

  const clave = editform["modClave"];
  const foto = editform["modfoto"];
  const nombre = editform["modNombre"];
  const edad = editform["modEdad"];
  const salario = editform["modSalario"];
  sexo = "";

  // VALIDACION DE SEXO
  if (document.getElementById("modMasc").checked) {
    sexo = "hombre";
  } else {
    sexo = "mujer";
  }

  if (!editStatus) {
    await saveregistro(
      clave.value,
      foto.value,
      nombre.value,
      edad.value,
      sexo,
      salario.value
    );
  } else {
    await updateDatos(id, {
      clave: clave.value,
      foto: foto.value,
      nombre: nombre.value,
      edad: edad.value,
      sexo: sexo,
      salario: salario.value,
    });
  }

  await obtenertabla();
  editform.reset();
});

function buscar(valor) {
  onGetTabla((querySnapshot) => {
    //contenedorusuarios.innerHTML = "";

    var salariomenormil = 0;
    var salarioMayormil = 0;
    var salarioMayortresMil = 0;

    var edadMenor10 = 0;
    var edadMenor20 = 0;
    var edadMayor21 = 0;

    querySnapshot.forEach((doc) => {
      const registro = doc.data();
      registro.id = doc.id;
      //console.log(registro);
      var menor = document.getElementById("rango-inicial").value;
      var mayor = document.getElementById("rango-final").value;

      //validacion de salario
      if (registro.salario >= 0 && registro.salario <= 999) {
        salariomenormil++;
      } else if (registro.salario >= 1000 && registro.salario <= 2999) {
        salarioMayormil++;
      } else {
        salarioMayortresMil++;
      }

      //validacion de edad
      if (registro.edad >= 0 && registro.edad <= 10) {
        edadMenor10++;
      } else if (registro.edad >= 11 && registro.edad <= 20) {
        edadMenor20++;
      } else {
        edadMayor21++;
      }
      //conficional del edad
      if (registro.edad >= menor && registro.edad <= mayor) {
        contenedorusuarios.innerHTML += `<div class="card">
                <table  align="center">  
                    <tr>
                        <td>${registro.clave}</td>
                        <td><img src= ${registro.foto} width=100px height=100px></img></td>
                        <td>${registro.nombre}</td>
                        <td>${registro.edad}</td>
                        <td>${registro.sexo}</td>
                        <td>$ ${registro.salario}</td>
                        <td><button type="button" class="btn btn-warning btn-edit boton" data-bs-toggle="modal" data-bs-target="#modalModificar"
                        data-bs-whatever="@mdo" data-id="${registro.id}">Modificar</button>

                        <button class="btn btn-danger btn-delete boton" data-id="${registro.id}">Eliminar</button>
                        </td>
                    </tr>            
                </table>    
            </div>`;
      }
    });

    if (valor == "salario") {
      // Obtener una referencia al elemento canvas del DOM
      const $grafica = document.querySelector("#GraficarSalario");
      // Las etiquetas son las que van en el eje X.
      const etiquetas1 = ["Menor a 1000", "Mayor a 1000", "Mayor a 3000"];
      // Podemos tener varios conjuntos de datos
      const datosSalario = {
        label: "salario",
        data: [salariomenormil, salarioMayormil, salarioMayortresMil], // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
        backgroundColor: ["orange", "gray", "cyan"], // Color de fondo
        hoverBackgroundColor: "yellow",
        borderColor: "black", // Color del borde
        borderWidth: 1, // Ancho del borde
      };
      new Chart($grafica, {
        type: "bar", // Tipo de gráfica
        data: {
          labels: etiquetas1,
          datasets: [
            datosSalario,
            // Aquí más datos...
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
      ///--------
    } else if (valor == "edad") {
      // Obtener una referencia al elemento canvas del DOM
      const $grafica = document.querySelector("#GraficarEdades");
      // Las etiquetas son las que van en el eje X.
      const etiquetas2 = [
        "Menor a 10 años",
        "Menor a 20 años",
        "Mayor a 21 años",
      ];
      // Podemos tener varios conjuntos de datos

      const datosEdad = {
        label: "edades",
        data: [edadMenor10, edadMenor20, edadMayor21], // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
        backgroundColor: ["red", "blue", "green"], // Color de fondo
        hoverBackgroundColor: "yellow",
        borderColor: "black", // Color del borde
        borderWidth: 1, // Ancho del borde
      };
      new Chart($grafica, {
        type: "line", // Tipo de gráfica
        data: {
          labels: etiquetas2,
          datasets: [
            datosEdad,
            // Aquí más datos...
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
      ///--------
    }
  });
}




// Creación de PDF -->

//document.addEventListener("DOMContentLoaded", () => {
//const $boton = document.querySelector("#btnCrearPdf");
//$boton.addEventListener("click", () => {
//     // Elegimos que parte del documento imprimir
//     const $elementoParaConvertir = document.getElementById("idTabla");
//     html2pdf()
//       .set({
//         margin: 1,
//         filename: "documento.pdf",
//         image: {
//           type: "jpeg",
//           quality: 0.98,
//         },

//         html2canvas: {
//           // A mayo escala, mejores gráficos, pero mas peso
//           scale: 3,
//           letterRendering: true,
//         },

//         jsPDF: {
//           unit: "in",
//           format: "a1",
//           // Landscape o portrait
//           orientation: "portrait",
//         },
//       })
//       .from($elementoParaConvertir)
//       .save()
//       .catcher((err) => console.log(err));
//   });
// });

//creacion  del pdf

var btnPDF = document.getElementById("btnCrearPdf");
btnPDF.addEventListener('click', pdf);

function pdf() {
    var doc = new jsPDF();
    html2canvas(document.querySelector("#idTabla"), {
        allowTaint: true,
        useCORS: true,
        scale: 2,
        quality: 0.98
    }).then(canvas => {
        var img = canvas.toDataURL("image/PNG");
        doc.text(80, 15, "USUARIOS")
        doc.text(10, 25, "Reporte generado con la información de cada usuario:")
        doc.addImage(img, 'PNG', 10, 30, 190, 100);
        doc.save("reporte.pdf");

    });
}



















//const $boton = document.querySelector("#btnCrearPdf");


/*
///FUNCION PARA AGREGAR LOS DATOS AL ARRAY
var arreglo = [];

function imprimir() {

    function Registro(clave, foto, nombre, edad, sexo, salario) {
        this.clave = clave;
        this.foto = foto;
        this.nombre = nombre;
        this.edad = edad
        this.sexo = sexo;
        this.salario = salario;
    }

    var clave = document.getElementById('clave').value;
    var foto = document.getElementById('foto').value;
    var nombre = document.getElementById('nombre').value;
    var edad = document.getElementById('edad').value;
    var salario = document.getElementById('salario').value;
    var sexo = "";

    if (clave == "" | foto == "" || nombre == "" || edad == "" || salario == "") {
        alert("Campos no seleccionados")
    } else {

        // VALIDACION DE SEXO
        if (document.getElementById('hombre').checked) {
            sexo = "hombre";
        } else {
            sexo = "mujer";
        }
        ///se crea un objeto de tipo registro
        const registroUsuario = new Registro(clave, foto, nombre, edad, sexo, salario);

        arreglo.push(registroUsuario);

        mostrar();
    }
    ///vaciar contenido del Modal
    document.getElementById('clave').value = "";
    document.getElementById('nombre').value = "";
    document.getElementById('edad').value = "";
    document.getElementById('salario').value = "";
    document.getElementById('foto').value = "";
    document.getElementById('hombre').checked;

}

///funcion para imprimir tabla
function mostrar() {
    ///imprimir resultado
    if (arreglo.length > 0) {
        document.getElementById("resultadotabla").innerHTML = "";
        document.getElementById('resultadotabla').innerHTML = '<tr class=titulo><th>Clave</th><th>Fotografia</th><th>Nombre</th><th>Edad</th><th>Sexo</th><th>Salario</th></tr>';

        for (let i = 0; i < arreglo.length; i++) {
            document.getElementById('resultadotabla').innerHTML += `<tr><td>${arreglo[i].clave}</td><td><img src= ${arreglo[i].foto} width=100px height=100px></img></td><td> ${arreglo[i].nombre}</td><td> ${arreglo[i].edad}</td><td>${arreglo[i].sexo}</td><td>$ ${arreglo[i].salario}</td></tr>`;
        }
        //revelar boton
        document.getElementById('btnreset').style.opacity = "1";
    } else {
        document.getElementById("resultadotabla").innerHTML = "";
        document.getElementById('btnreset').style.opacity = "0";
    }

}

//funcion para resetear
function reset() {
    location.href = location.href;
}

////Funcion para cargar datos
function carga() {
    for (i = 0; i < arreglo.length; i++) {
        if (arreglo[i].clave == document.getElementById("claveBuscar").value) {
            var nClave = arreglo[i].clave;
            var nfoto = arreglo[i].foto;
            var nNombre = arreglo[i].nombre;
            var nEdad = arreglo[i].edad;
            var nSexo = arreglo[i].sexo;
            var nSalario = arreglo[i].salario;

            document.getElementById("modClave").value = nClave;
            document.getElementById("modfoto").value = nfoto;
            document.getElementById("modNombre").value = nNombre;
            document.getElementById("modEdad").value = nEdad;
            // document.getElementById("modSexo").value = nSexo;

            if (nSexo == 'masculino') {
                document.querySelector('#modMasc').checked = true;
            } else {
                document.querySelector('#modFem').checked = true;
            }
            document.getElementById("modSalario").value = nSalario;
        }
    }
}


////funcion para MODIFICAR
function guardaCambios() {
    var claveMod = document.getElementById('modClave').value;
    var fotoMod = document.getElementById('modfoto').value;
    var nombreMod = document.getElementById('modNombre').value;
    var edadMod = document.getElementById('modEdad').value;

    var sexoMod = "";
    // Valida sexo
    if (document.getElementById('modMasc').checked) {
        sexoMod = document.getElementById('modMasc').value;
    } else {
        sexoMod = document.getElementById('modFem').value;
    }
    var salarioMod = document.getElementById('modSalario').value;

    for (let i = 0; i < arreglo.length; i++) {
        if (arreglo[i].clave == document.getElementById("claveBuscar").value) {
            arreglo[i].clave = claveMod;
            arreglo[i].imagen = fotoMod;
            arreglo[i].nombre = nombreMod;
            arreglo[i].edad = edadMod;
            arreglo[i].sexo = sexoMod;
            arreglo[i].salario = salarioMod;

            // lIMPIAR
            document.getElementById('claveBuscar').value = "";

            document.getElementById('modClave').value = "";
            document.getElementById('modfoto').value = "";
            document.getElementById('modNombre').value = "";
            document.getElementById('modEdad').value = "";
            document.querySelector('#modMasc').checked = false;
            document.querySelector('#modFem').checked = false;
            document.getElementById('modSalario').value = "";
        }
    }
    mostrar();
}


///FUNCION PARA ELIMINAR
function eliminar() {
    var claveElimina = document.getElementById('claveEliminar').value;
    for (let i = 0; i < arreglo.length; i++) {
        if (arreglo[i].clave == claveElimina) {
            delete arreglo[i];
            arreglo.splice(i, 1);
            claveElimina = "";
            document.getElementById('claveEliminar').value = "";
        }
    }
    mostrar();
}
*/

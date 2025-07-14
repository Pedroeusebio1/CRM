(function () { 

    // 1. Declarar variable global que contendrá la conexión a la base de datos
    let DB; 
    const listadoClientes = document.querySelector('#listado-clientes');

    // 2. Esperar que el DOM cargue por completo para iniciar la creación de la base de datos
    document.addEventListener('DOMContentLoaded', () => {
        // Llamamos la función encargada de crear la base de datos
        crearDB();

        listadoClientes.addEventListener('click', eliminarRegistro);

    });
    
    function eliminarRegistro(e) {
        if(e.target.classList.contains('eliminar')){
            const idEliminar = Number(e.target.dataset.cliente);

            const confirmar = confirm('Deseas elimnar este cliente?');

            if (confirmar) {
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');

                objectStore.delete(idEliminar);

                transaction.oncomplete = function () {
                    console.log('Eliminado....');
                    e.target.parentElement.parentElement.remove();
                };

                transaction.onerror = function() {
                    console.log('Hubo un error');
                }
            }
        };
    }

    // 3. Función para crear o abrir la base de datos
    function crearDB() {
        // 3.1. Abrimos conexión con la base de datos 'crm', versión 1
        const crearDB = window.indexedDB.open('crm', 1); 

        // 3.2. Manejamos error si ocurre al intentar abrir la base
        crearDB.onerror = function () {
            console.log('❌ Hubo un error al abrir la base de datos');
        };

        // 3.3. Si la conexión fue exitosa, guardamos el resultado en la variable DB
        crearDB.onsuccess = function () {
            DB = crearDB.result;
            obtenerCliente();
        };

        // 3.4. Si es la primera vez o cambia la versión, se crea la estructura
        crearDB.onupgradeneeded = function(e) {
            const db = e.target.result;

            // 3.4.1. Creamos el objectStore (tabla) llamado 'crm'
            //        con clave primaria 'id' que se incrementa automáticamente
            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });

            // 3.4.2. Creamos índices para facilitar las búsquedas por estos campos
            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });

            console.log('📦 ¡Base de datos lista y creada!');
        }
    }

    function obtenerCliente() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = ()=>{console.log('Hubo un error')}
        abrirConexion.onsuccess = ()=>{
            DB = abrirConexion.result;

            const objectStore = DB.transaction('crm').objectStore('crm');

            // Para el read de la base de datos se debe utilizar un cursor
            objectStore.openCursor().onsuccess = function (e) {
                const cursor = e.target.result;

                if (cursor) {
                    const { nombre, email, telefono, empresa, id } = cursor.value;

                    listadoClientes.innerHTML += 
                            `<tr>
                                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                    <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                    <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                                </td>
                                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                    <p class="text-gray-700">${telefono}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                    <p class="text-gray-600">${empresa}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                    <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                    <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                                </td>
                            </tr>`; 

                    cursor.continue();
                } else {
                    console.log('No hay mas registros...')
                }
            }
        }
    }

})();

/*

*********IIFE***********

***Este patrón tiene tres objetivos principales:***

(function () {
    "use strict";
    // tu código aquí
})()

Encapsulación del scope:
Cualquier variable, constante o función que declares dentro de este bloque no estará disponible fuera de él. Así evitas conflictos con otros scripts.

Protección del código:
Es una forma de proteger tu código de colisiones accidentales con variables globales o bibliotecas externas.

Organización modular:
Te permite estructurar tu archivo como si fuese un "módulo" antes de que existieran los módulos ES6 (import/export).

*/

    
    function conectarDB() {

        let abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function () {
            console.log('❌ Hubo un error al abrir la base de datos');
        };

        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result; 
        }
};

        function imprimirAlerta(mensaje, tipo) {

        const alerta = document.querySelector('.alerta');

            if(!alerta){ // Esta condición me ayuda a evaluar que no se 
            // repita el mensaje

            //Crear Alerta
            const divMensaje = document.createElement('div');
            divMensaje.classList.add(
                'px-4', 
                'py-3', 
                'rounded', 
                'max-w-lg', 
                'mx-auto', 
                'mt-6', 
                'text-center',
                'alerta'
            );

            if(tipo === 'error'){
                divMensaje.classList.add(
                    'bg-red-100', 
                    'border-red-400', 
                    'text-red-700',
                    'border'
                )
            } else {
                divMensaje.classList.add(
                    'bg-green-100', 
                    'border-green-400', 
                    'text-green-700',
                    'border'
                );

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }

            divMensaje.textContent = mensaje;

            formulario.appendChild(divMensaje);

            setTimeout(() => {
                divMensaje.remove();
            }, 1000);
        }  
    }
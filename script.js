const botones = document.querySelectorAll('#botones button'); // Indicamos cuáles son los botones que vamos a estar manejando.
const pantalla = document.getElementById('inputPantalla'); // Indicamos la pantalla con la que queremos enseñar las cuentas.
const signos = ['+', '-', '*', '/', '√', '%']; // Indicamos los signos que tenemos para el control de signos ( controlDeSigno(); ).

let numero1 = ""; let signo = ""; let numero2 = ""; // Inicializamos todas las variables.
let numeroAnterior = "";


function limpiarPantalla(){ // Función para Limpiar la Pantalla. Setteamos todas las variables a vacías y limpiamos la pantalla y la consola.
  numero1 = ""; numero2 = ""; signo = "";
  numeroAnterior = "";
  pantalla.value = "";
  console.clear();
  console.log("Consola Limpia.");  
}


botones.forEach(boton => {

  function animacionBorde(){ // Función para la animación del botón al ser clickado.
    switch(boton.id){ // Comprobamos qué id tiene el botón para los diferentes tipos del sombra al ser pulsado.
      case "clear":
        boton.classList.add('clickedclear'); // Añadimos la clase "clickedclear" al botón clickado y la quitamos al paso de 300 milisegundos.
        setTimeout(() => {
          boton.classList.remove('clickedclear');
        }, 300);
        break;
      case "+":
        boton.classList.add('clicked+'); 
        setTimeout(() => {
          boton.classList.remove('clicked+');
        }, 300);
        break;
      case "=":
        boton.classList.add('clicked=');
        setTimeout(() => {
          boton.classList.remove('clicked=');
        }, 300);
        break;
      default: // Si no es ninguno de estos botones especiales, ponemos la clase "clicked" por defecto.
        boton.classList.add('clicked');
        setTimeout(() => {
          boton.classList.remove('clicked');
        }, 300);
    }
  }

  function calcResultado(){ // Función para SOLO calcular el resultado.
    if(signo === "%" || signo === "√"){ // Cubrimos los casos especiales como % y √.
      if(signo === "%"){
        return (parseFloat(numero1) * (parseFloat(numero2)) / 100);
      } else {
        return Math.sqrt(numero2);
      }
    } else { // Si no es el caso, devuelve la operación normal.
      return eval(numero1 + signo + numero2);
    }
  }

  function printResultado(){ // Función para mostrar el resultado. Cubriendo el caso de la división entre 0 ( Que da "Infinity" ).
    let resultado;
    resultado = calcResultado(); // Calculamos el resultado llamando a la función "calcResultado()" y lo añadimos a la variable "resultado".
    pantalla.value = (resultado === undefined ? "" : (resultado === Infinity) ? "Cuenta no válida." : resultado);
    console.log((resultado === undefined ? "" : (resultado === Infinity) ? "Cuenta no válida." : resultado));
    // Guardamos el resultado recién calculado para después introducirlo como "numero1" por si el usuario quiere seguir con la cuenta.
    // Aunque si se da el caso de que el resultado sea "Infinity" no se guarda el resultado.
    numeroAnterior = (resultado === Infinity ? "" : resultado); numero1 = numeroAnterior;
    numero2 = ""; signo = ""; // Setteamos las demás variables a vacías.
  }

  function entradaErronea() { // Función para comprobar si la entrada es correcta ( Número ) o incorrecta ( Cadena )
    if(signo === "√" && numero1 === ""){
      return false;
    }
    if ((isNaN(numero1) || numero1 === "") || (isNaN(numero2) || numero2 === "")) { // Con isNaN comprobamos alguno de los dos números son una cadena, si sí, devolvemos "true"
      return true;
    }
    return false;
  }


  boton.addEventListener('click', () => { // Entramos en el evento que indica qué hacer cuando un botón es clickado.
    const valorPulsado = boton.textContent; // Declaramos la constante del valorPulsado para mejor comprensión del código.

    animacionBorde(); // Añadimos la animación del borde al dar click en cualquier botón llamando a la función "animacionBorde()".
    console.log("Se ha pulsado el botón: " + valorPulsado);

    function controlDeSignos() { // Función para controlar los problemas dados por los signos en varias casulísticas.
      if (signos.includes(valorPulsado)) { // Comprobamos si el signo indicado pertenece a la lista que declaramos al principio del archivo.

        // CASULÍSTICA 1: No queremos que el primer carácter introducido sea un signo ( Menos la raíz cuadrada ).
        if(!(valorPulsado === "√") && numero1 === ""){ // Comprobamos si el signo introducido no es la raíz cuadrada y si no está introducido el primer número, lo que indica que el signo es el primer carácter.
          pantalla.value = ""; // Limpiamos la pantalla.
          return true;
        }

        // CASULÍSTICA 2: Ya que, la raíz cuadrada tiene que ir delante cualquier número, indicamos que si se introduce una raíz cuadrada y la variable "numero1" NO está vacía, no añade el signo.
        if(valorPulsado === "√" && !(numero1 === "")){ //
          return true;
        }

        // CASULÍSTICA 3: No queremos que se acumulen los signos. Cuando el usuario le dé varias veces a algún símbolo, se mostrará SOLO el último.
        if (pantalla.value.length > 0 && signos.includes(pantalla.value.slice(-1))) { // Comprobamos si el último carácter es un signo.
          pantalla.value = pantalla.value.slice(0, -1) + valorPulsado; // Si lo es, actualizamos la pantalla con el valor anterior menos el último signo, reemplazándolo por el signo pulsado.
        } else {
          pantalla.value += valorPulsado; // Si no es un signo, añadimos el signo normalmente.
        }

        signo = valorPulsado; // Asignamos a la variable signo el último signo introducido.
        console.log("Signo: " + signo);
        return true;
      }
      return false;
    }

    function main(){ // Función principal para rellenar las distintas variables con los datos introducidos por el usuario.

      // Si la anterior operación fue una división entre 0, en la pantalla pondrá "Cuenta no válida"
      // Si alguna entrada es una cadena de caracteres pondrá "Entrada no válida.".
      if(pantalla.value === "Cuenta no válida." || pantalla.value === "Entrada no válida."){
        pantalla.value = ""; // Si esto pasa. Se limpia la pantalla al hacer un click en cualquier botón.
        numero1 = ""; numero2 = ""; signo = ""; // Setteamos todas las variables a 0 para empezar de nuevo la cuenta.
      }

      if(signo === ""){ // Si no es un signo, comprobamos si la variable está vacía. Si está vacía, empezamos rellenando la variable "numero1".
        numero1 += valorPulsado;
        console.log("Número 1: " + numero1);
      } else { // Si ya se ha introducido un signo, el siguiente número ya pertenece al segundo número.
        numero2 += valorPulsado;
        console.log("Número 2: " + numero2);
      }

      pantalla.value += valorPulsado; // Añadimos los valores introducimos en la pantalla.
      pantalla.scrollLeft = pantalla.scrollWidth; // Desplaza la vista del input al final para mostrar los caracteres más recientes por si la cantidad de los caracteres superan el largo del input.
    }
    
    // Introducimos la arquitectura principal del ejercicio.
    /* Paso 1: Comprobamos primero si el carácter introducido es un símbolo y prevenimos los posibles problemas con la función "controlDeSignos()".
     * Paso 2: Si el valor es un "=", pasamos a la función "printResultado()" y mostramos el resultado de la operación en la pantalla.
     * Paso 3: Al darle al botón "AC", se limpia la pantalla, por lo que llamamos a la función "limpiarPantalla()".
     * Paso 4: Si no entra dentro de estos casos, empezamos con el código principal de la calculadora llamando a la función "main()".
     */
    if(controlDeSignos()){
      return;
    }

    if(valorPulsado === "="){
      if(entradaErronea()){
        pantalla.value = "Entrada no válida.";
        return;
      }
      printResultado();
      return;
    } else {
      if(boton.id === 'clear'){
        limpiarPantalla();
        return;
      } else {
        main();
      }
    }

  });
});
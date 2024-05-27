//Variables
const $albumes = document.querySelector('#albumes-container');
let data = {}
//DOM
window.addEventListener("DOMContentLoaded", function () {
    obtenerData();
});
window.onclick = function (event) {
    const modal = document.querySelector('#modal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

async function obtenerData() {
    try {
        const respuesta = await fetch('./data.json');
        data = await respuesta.json();
        albumesItems(data.albumes);
        galeriaItems(data.galeria);
        
    } catch (error) {
        console.log('Hubo un problema al obtener los usuarios:', error);
    }
}

//Funciones
function albumesItems(data) {
    data.forEach((x) => {
        let article = document.createElement("article");
        article.innerHTML = `
        <div class="bg-gradient-to-t from-gray-950 flex items-center justify-center flex-col
        border-2 border-gray-400 rounded-2xl">
            <img class="p-4" src="${x.imagenUrl}" alt="Imagen del álbum"/>
            <h2 class="text-2xl p-2 tracking-tighter text-pretty">${x.titulo}</h2>
            <p class="text-xl text-pretty pt-2 pb-4">${x.año}</p>
            <div class="flex items-center gap-8 p-4">
                <div class="flex items-center gap-2">
                    <button class="text-xl">
                        <i class="fa-regular fa-star fa-2xl"></i>
                    </button>
                    <p class="text-2xl">${x.likes}</p>
                </div> 
                <button class="flex items-center gap-3 bg-gray-600 px-4 py-3 rounded-3xl">
                    <i class="fa-brands fa-spotify fa-2xl"></i><p class="text-xl">Escuchar ahora</p>
                </button>
            </div>
        </div>
        `;
        $albumes.appendChild(article);
    });
}

function galeriaItems (data) {
    const $galeria = document.querySelector("#galeria");

    data.forEach ((x) => {
        let galeriaImagenes = `
        <picture class="overflow-hidden flex items-center justify-center rounded-2xl">
            <img class="w-full" src="${x.imagenGaleria}" title="#" />
        </picture>
        `;
        $galeria.innerHTML += galeriaImagenes;
    })
}

function modalItems (info) {
    const $modal = document.querySelector("#modalCaja");
    const $modalCaja = document.querySelector("#modal")
    
    let content = data[info] || { img: "", locacion: "No hay info" };

    $modal.innerHTML = `
        <picture class="w-3/4">
            <img class="w-full rounded-tl-3xl rounded-bl-3xl" src="${content.img}" />
        </picture>
        <div class="w-full flex items-center justify-center flex-col gap-5 text-pretty">
            <h2 class="text-3xl">Estas comprando entrada para</h2>
            <h3 class="text-3xl tracking-wider">${content.locacion}</h3>
            <button class="text-3xl py-4 px-6 bg-red-400 text-white rounded-3xl"
            onclick="sweetalert()"
            >Comprar</button>
        </div> 
    `;
    $modalCaja.style.display = "block";
}

function closeModal () {
    const modalClose = document.querySelector('#modal');
    modal.style.display = "none";
}

function sweetalert () {
    Swal.fire({
        title: "¿Estas seguro que quieres comprar la entrada?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar!",
        cancelButtonText: "Cancelar"  
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Comprado",
                text: "Muchas gracias por confiar con nosotros.",
                icon: "success"
            });
        }
    });
}
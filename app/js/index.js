//Variables
const $albumes = document.querySelector('#albumes-container');
let data = {};

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
        favoritos();
        
    } catch (error) {
        console.log('Hubo un problema al obtener los usuarios:', error);
    }
}

//Funciones
function albumesItems(data) {
    const albumes = document.getElementById("albumes");
    data.forEach((x) => {

        let storedLikes = JSON.parse(localStorage.getItem('albumLikes')) || {};
        if (!(x.id in storedLikes)) {
            storedLikes[x.id] = x.likes;
        }
        localStorage.setItem('albumLikes', JSON.stringify(storedLikes));
        
        let article = document.createElement("article");
        article.innerHTML = `
        <div class="bg-gradient-to-t from-gray-950 flex items-center justify-center flex-col
        border-2 border-gray-400 rounded-2xl mx-2 px-3">
            <div class="max-w-sm md:max-w-md lg:max-w-xl">
                <img class="p-4" src="${x.imagenUrl}" alt="Imagen del álbum"/>
            </div>
            <div class="flex items-center justify-center flex-col">
                <h2 class="text-xl p-2 tracking-tighter text-pretty">${x.titulo}</h2>
                <p class="text-xl text-pretty pt-2 pb-4">${x.año}</p>
            </div>
            <ul class="grid grid-cols-3 p-3">
                <li class="flex items-center justify-center flex-col">
                    <button class="rounded-full py-2 px-1 button-likes" data-id="${x.id}">
                        <i class="fa-regular fa-star fa-2xl"></i> 
                    </button>
                    <div class="">
                        <p class="text-xl contador-likes" id="contador-${x.id}" >${x.likes }</p>
                    </div>
                </li>
                <li class="col-span-2">
                    <button class="flex items-center gap-3 bg-gray-500 px-4 py-3 rounded-3xl hover:bg-gray-700 transition duration-150 ease-in-out">
                        <i class="fa-brands fa-spotify fa-2xl"></i><p class="text-base">Escuchar ahora</p>
                    </button>
                </li>
            </ul>  
        </div>
        `;
        $albumes.appendChild(article);
    });
}

function favoritos() {
    const elementos = document.querySelectorAll('.button-likes');

    elementos.forEach(elemento => {
        const dataID = elemento.getAttribute('data-id');
        if (dataID) {
            elemento.addEventListener('click', function () {
                let liked = JSON.parse(localStorage.getItem('liked')) || [];
                let albumLikes = JSON.parse(localStorage.getItem('albumLikes')) || {};
                const contadorLikes = document.getElementById(`contador-${dataID}`); 

                if (liked.includes(dataID)) {
                    elemento.classList.remove('bg-yellow-500');
                    const index = liked.indexOf(dataID);
                    liked.splice(index, 1);
                    albumLikes[dataID] = parseInt(contadorLikes.textContent) - 1;
                } else {
                    elemento.classList.add('bg-yellow-500');
                    liked.push(dataID);
                    albumLikes[dataID] = parseInt(contadorLikes.textContent) + 1;
                }

                contadorLikes.textContent = albumLikes[dataID];
                localStorage.setItem('liked', JSON.stringify(liked));
                localStorage.setItem('albumLikes', JSON.stringify(albumLikes));
            });
        }
    });

    function actualizarLikes() {
        const liked = JSON.parse(localStorage.getItem('liked')) || [];
        const elementos = document.querySelectorAll('.button-likes');
        const albumLikes = JSON.parse(localStorage.getItem('albumLikes')) || {};

        elementos.forEach(elemento => {
            const dataID = elemento.getAttribute('data-id');
            const contadorLikes = document.getElementById(`contador-${dataID}`); 

            if (dataID && liked.includes(dataID)) {
                elemento.classList.add('bg-yellow-500');
            } else {
                elemento.classList.remove('bg-yellow-500');
            }

            if (dataID in albumLikes) {
                contadorLikes.textContent = albumLikes[dataID];
            }
        });
    }

    actualizarLikes();
}


function galeriaItems (data) {
    const $galeria = document.querySelector("#galeria");

    data.forEach ((x) => {
        let galeriaImagenes = `
        <picture class="overflow-hidden flex items-center justify-center rounded-2xl">
            <img class="w-full rounded-xl" src="${x.imagenGaleria}" title="#" />
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
    const $modalClose = document.querySelector('#modal');
    $modalClose.style.display = "none";
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
            closeModal()
            Swal.fire({
                title: "Comprado",
                text: "Muchas gracias por confiar con nosotros.",
                icon: "success"
            });
        }
    });
}
function Menu(e) {
    let list = document.querySelector('ul');
    e.name === 'menu' ? (e.name = "close", list.classList.add('top-[80px]'), list.classList.add('opacity-100')) : (e.name = "menu", list.classList.remove('top-[80px]'), list.classList.remove('opacity-100'))
}
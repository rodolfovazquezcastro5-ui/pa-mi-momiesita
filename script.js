/* ================================================================
   VARIABLES GENERALES
================================================================ */

const body = document.body;

const intro = document.getElementById("intro");
const experience = document.getElementById("experience");
const beginButton = document.getElementById("beginButton");

let started = false;


/* ================================================================
   CURSOR PERSONALIZADO
================================================================ */

const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let ringX = mouseX;
let ringY = mouseY;

window.addEventListener("mousemove", (event) => {

    mouseX = event.clientX;
    mouseY = event.clientY;

    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;

});

function animateCursor() {

    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;

    requestAnimationFrame(animateCursor);

}

animateCursor();


document.addEventListener("mouseover", (event) => {

    if (
        event.target.tagName === "BUTTON" ||
        event.target.closest("button") ||
        event.target.closest(".canvas-wrapper")
    ) {
        body.classList.add("cursor-hover");
    }

});


document.addEventListener("mouseout", (event) => {

    if (
        event.target.tagName === "BUTTON" ||
        event.target.closest("button") ||
        event.target.closest(".canvas-wrapper")
    ) {
        body.classList.remove("cursor-hover");
    }

});


/* ================================================================
   INTRO
================================================================ */

beginButton.addEventListener("click", () => {

    if (started) return;

    started = true;

    intro.style.opacity = "0";

    setTimeout(() => {

        intro.classList.remove("active");
        experience.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });

        startExperience();

    }, 1200);

});


function startExperience() {

    initializeIntroStars();
    initializeSky();
    initializePainting();
    initializeGuitar();
    initializeGarden();
    initializeBook();

}


/* ================================================================
   INTRO STARS
================================================================ */

const introCanvas = document.getElementById("introCanvas");
const introCtx = introCanvas.getContext("2d");

let introStars = [];

function resizeIntroCanvas() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    introCanvas.width = window.innerWidth * dpr;
    introCanvas.height = window.innerHeight * dpr;

    introCanvas.style.width = `${window.innerWidth}px`;
    introCanvas.style.height = `${window.innerHeight}px`;

    introCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

}

function initializeIntroStars() {

    resizeIntroCanvas();

    introStars = [];

    const amount = Math.floor(
        (window.innerWidth * window.innerHeight) / 9000
    );

    for (let i = 0; i < amount; i++) {

        introStars.push({

            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,

            radius: Math.random() * 1.4 + .2,

            alpha: Math.random() * .6 + .2,

            speed: Math.random() * .015 + .003,

            phase: Math.random() * Math.PI * 2

        });

    }

    animateIntroStars();

}

function animateIntroStars() {

    introCtx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    introStars.forEach(star => {

        star.phase += star.speed;

        const alpha =
            star.alpha +
            Math.sin(star.phase) * .15;

        introCtx.beginPath();

        introCtx.arc(
            star.x,
            star.y,
            star.radius,
            0,
            Math.PI * 2
        );

        introCtx.fillStyle =
            `rgba(238,234,226,${Math.max(.05, alpha)})`;

        introCtx.fill();

    });

    requestAnimationFrame(animateIntroStars);

}


/* ================================================================
   SKY / CONSTELACIÓN
================================================================ */

const skyCanvas = document.getElementById("skyCanvas");
const skyCtx = skyCanvas.getContext("2d");

let skyStars = [];
let connectedStars = [];

let skyMouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

const constellationText =
    document.getElementById("constellationText");

const constellationMessage =
    document.getElementById("constellationMessage");

const starCount =
    document.getElementById("starCount");


function initializeSky() {

    resizeSkyCanvas();

    createSkyStars();

    skyCanvas.addEventListener("mousemove", handleSkyMouse);

    skyCanvas.addEventListener("click", handleSkyClick);

    animateSky();

}


function resizeSkyCanvas() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    skyCanvas.width = window.innerWidth * dpr;
    skyCanvas.height = window.innerHeight * dpr;

    skyCanvas.style.width = `${window.innerWidth}px`;
    skyCanvas.style.height = `${window.innerHeight}px`;

    skyCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

}


function createSkyStars() {

    skyStars = [];

    const total = Math.min(
        260,
        Math.floor(
            window.innerWidth *
            window.innerHeight /
            5000
        )
    );

    for (let i = 0; i < total; i++) {

        skyStars.push({

            x: Math.random() * window.innerWidth,

            y: Math.random() * window.innerHeight,

            radius: Math.random() * 1.5 + .2,

            alpha: Math.random() * .7 + .1,

            twinkle: Math.random() * 2 + .5,

            phase: Math.random() * Math.PI * 2,

            important: false

        });

    }


    /*
       Estas son las 7 estrellas que forman
       nuestra pequeña constelación.
    */

    const constellationPositions = [

        [.27, .32],
        [.35, .27],
        [.44, .33],
        [.51, .27],
        [.59, .34],
        [.67, .29],
        [.74, .37]

    ];


    constellationPositions.forEach((position, index) => {

        const star = {

            x: window.innerWidth * position[0],

            y: window.innerHeight * position[1],

            radius: 2.4,

            alpha: .95,

            twinkle: 1,

            phase: index,

            important: true,

            index

        };

        skyStars.push(star);

    });

}


function handleSkyMouse(event) {

    const rect = skyCanvas.getBoundingClientRect();

    skyMouse.x = event.clientX - rect.left;
    skyMouse.y = event.clientY - rect.top;

    checkNearbyStar();

}


function handleSkyClick() {

    const clicked = skyStars.find(star => {

        if (!star.important) return false;

        const distance = Math.hypot(
            skyMouse.x - star.x,
            skyMouse.y - star.y
        );

        return distance < 22;

    });

    if (!clicked) return;

    if (!connectedStars.includes(clicked.index)) {

        connectedStars.push(clicked.index);

        connectedStars.sort((a, b) => a - b);

        starCount.textContent =
            connectedStars.length;

        if (connectedStars.length >= 7) {

            completeConstellation();

        }

    }

}


function checkNearbyStar() {

    let hovering = false;

    skyStars.forEach(star => {

        if (!star.important) return;

        const distance = Math.hypot(
            skyMouse.x - star.x,
            skyMouse.y - star.y
        );

        if (distance < 25) {

            hovering = true;

        }

    });

    if (hovering) {

        body.classList.add("cursor-hover");

    }

}


function completeConstellation() {

    constellationText.textContent =
        "y llegaste hasta aquí.";

    constellationMessage.classList.add("visible");

    setTimeout(() => {

        constellationMessage.classList.remove("visible");

    }, 5000);

}


function animateSky() {

    skyCtx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );


    /* Fondo de pequeñas estrellas */

    skyStars.forEach(star => {

        star.phase += .005 * star.twinkle;

        const pulse =
            Math.sin(star.phase) * .18;

        skyCtx.beginPath();

        skyCtx.arc(
            star.x,
            star.y,
            star.radius,
            0,
            Math.PI * 2
        );

        skyCtx.fillStyle =
            `rgba(238,234,226,${
                Math.max(.05, star.alpha + pulse)
            })`;

        skyCtx.fill();

    });


    /* Líneas de constelación */

    if (connectedStars.length > 1) {

        skyCtx.beginPath();

        connectedStars.forEach((index, i) => {

            const star =
                skyStars.find(s => s.index === index);

            if (!star) return;

            if (i === 0) {

                skyCtx.moveTo(
                    star.x,
                    star.y
                );

            } else {

                skyCtx.lineTo(
                    star.x,
                    star.y
                );

            }

        });

        skyCtx.strokeStyle =
            "rgba(216,195,165,.45)";

        skyCtx.lineWidth = 1;

        skyCtx.stroke();

    }


    /* Halo de las estrellas importantes */

    skyStars.forEach(star => {

        if (!star.important) return;

        const active =
            connectedStars.includes(star.index);

        const distance = Math.hypot(
            skyMouse.x - star.x,
            skyMouse.y - star.y
        );

        if (active || distance < 45) {

            const radius =
                active ? 18 : 12;

            const gradient =
                skyCtx.createRadialGradient(
                    star.x,
                    star.y,
                    0,
                    star.x,
                    star.y,
                    radius
                );

            gradient.addColorStop(
                0,
                "rgba(216,195,165,.35)"
            );

            gradient.addColorStop(
                1,
                "rgba(216,195,165,0)"
            );

            skyCtx.beginPath();

            skyCtx.arc(
                star.x,
                star.y,
                radius,
                0,
                Math.PI * 2
            );

            skyCtx.fillStyle = gradient;

            skyCtx.fill();

        }

    });


    requestAnimationFrame(animateSky);

}


/* ================================================================
   MUSIC PLAYER - EDICIÓN CORREGIDA Y DEFINITIVA
================================================================ */

const audioPlayer = document.getElementById("audioPlayer");
const playButton  = document.getElementById("playButton");
const playIcon    = document.getElementById("playIcon");
const player      = document.querySelector(".player");
const progressBar = document.getElementById("progressBar");

// CAMBIO AQUÍ: Agregamos "m/" antes del nombre para entrar a la carpeta
audioPlayer.src = "m/cancioncita.mp3";

// 1. Control del Click en el botón de reproducción
playButton.addEventListener("click", () => {
    // Si la música está pausada, la reproduce
    if (audioPlayer.paused) {
        audioPlayer.play()
            .catch(error => {
                console.error("Error al reproducir el archivo de audio:", error);
                alert("No se pudo cargar 'm/cancioncita.mp3'. Asegúrate de que el archivo esté dentro de la carpeta 'm' y tenga el nombre correcto.");
            });
    } else {
        // Si está sonando, la pausa
        audioPlayer.pause();
    }
});

// 2. Evento cuando la música EMPIEZA a sonar
audioPlayer.addEventListener("play", () => {
    // Agrega 'playing' al contenedor principal para activar TODO tu CSS al mismo tiempo
    player.classList.add("playing");
    playIcon.textContent = "Ⅱ"; // Cambia el icono a pausa
});

// 3. Evento cuando la música se PAUSA
audioPlayer.addEventListener("pause", () => {
    // Quita 'playing' para que tu CSS detenga el disco, las ondas y la aguja
    player.classList.remove("playing");
    playIcon.textContent = "▶"; // Regresa al icono de play
});

// 4. Actualización de la barra de progreso en tiempo real
audioPlayer.addEventListener("timeupdate", () => {
    if (!audioPlayer.duration) return;

    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
});

// 5. Reinicio automático al terminar la canción
audioPlayer.addEventListener("ended", () => {
    player.classList.remove("playing");
    playIcon.textContent = "▶";
    progressBar.style.width = "0%";
});




/* ================================================================
   PINTURA / CANVAS
================================================================ */

const paintingCanvas =
    document.getElementById("paintingCanvas");

const paintingCtx =
    paintingCanvas.getContext("2d");

let painting = false;

let brushSize = 4;

let lastPaintPoint = null;


function initializePainting() {

    resizePaintingCanvas();

    paintingCanvas.addEventListener(
        "pointerdown",
        startPainting
    );

    paintingCanvas.addEventListener(
        "pointermove",
        paint
    );

    paintingCanvas.addEventListener(
        "pointerup",
        stopPainting
    );

    paintingCanvas.addEventListener(
        "pointerleave",
        stopPainting
    );

}


function resizePaintingCanvas() {

    const rect =
        paintingCanvas.getBoundingClientRect();

    const dpr =
        Math.min(window.devicePixelRatio || 1, 2);

    paintingCanvas.width =
        rect.width * dpr;

    paintingCanvas.height =
        rect.height * dpr;

    paintingCtx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

}


function getPaintingPosition(event) {

    const rect =
        paintingCanvas.getBoundingClientRect();

    return {

        x: event.clientX - rect.left,

        y: event.clientY - rect.top

    };

}


function startPainting(event) {

    painting = true;

    const point =
        getPaintingPosition(event);

    lastPaintPoint = point;

    paintingCanvas.setPointerCapture(
        event.pointerId
    );

}


function paint(event) {

    if (!painting) return;

    const point =
        getPaintingPosition(event);

    const label =
        document.getElementById(
            "brushPosition"
        );

    label.textContent =
        `${Math.round(point.x)
        .toString()
        .padStart(3, "0")} × ${
            Math.round(point.y)
            .toString()
            .padStart(3, "0")
        }`;


    paintingCtx.beginPath();

    paintingCtx.moveTo(
        lastPaintPoint.x,
        lastPaintPoint.y
    );

    paintingCtx.lineTo(
        point.x,
        point.y
    );

    paintingCtx.strokeStyle =
        "rgba(45,40,34,.75)";

    paintingCtx.lineWidth =
        brushSize;

    paintingCtx.lineCap =
        "round";

    paintingCtx.lineJoin =
        "round";

    paintingCtx.stroke();


    lastPaintPoint = point;

}


function stopPainting() {

    painting = false;

    lastPaintPoint = null;

}


document.querySelectorAll(
    ".brush-selector button"
).forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(
                ".brush-selector button"
            )
            .forEach(btn => {
                btn.classList.remove("selected");
            });

        button.classList.add("selected");

        brushSize =
            Number(
                button.dataset.size
            );

    });

});


document.getElementById(
    "clearCanvas"
).addEventListener("click", () => {

    paintingCtx.clearRect(
        0,
        0,
        paintingCanvas.width,
        paintingCanvas.height
    );

});


/* ================================================================
   GUITARRA
================================================================ */

let audioContext = null;

const strings =
    document.querySelectorAll(
        ".strings button"
    );

const chordName =
    document.getElementById(
        "chordName"
    );


const guitarNotes = [

    82.41,
    110.00,
    146.83,
    196.00,
    246.94,
    329.63

];


function initializeGuitar() {

    strings.forEach(string => {

        string.addEventListener(
            "pointerdown",
            () => {

                playGuitarNote(
                    Number(
                        string.dataset.string
                    )
                );

            }
        );

    });

}


function createAudioContext() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }

}


function playGuitarNote(index) {

    createAudioContext();

    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }


    const frequency =
        guitarNotes[index];

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    oscillator.type = "triangle";

    oscillator.frequency.value =
        frequency;


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    const now =
        audioContext.currentTime;


    gain.gain.setValueAtTime(
        0,
        now
    );

    gain.gain.linearRampToValueAtTime(
        .16,
        now + .015
    );

    gain.gain.exponentialRampToValueAtTime(
        .001,
        now + 1.5
    );


    oscillator.start(now);

    oscillator.stop(
        now + 1.6
    );


    const selected =
        strings[index];

    selected.classList.add(
        "pressed"
    );


    setTimeout(() => {

        selected.classList.remove(
            "pressed"
        );

    }, 120);


    const names = [
        "E",
        "A",
        "D",
        "G",
        "B",
        "E"
    ];

    chordName.textContent =
        names[index];

}


/* ================================================================
   GARDEN
================================================================ */

const flowers =
    document.querySelectorAll(
        ".flower"
    );

let flowersRevealed = false;


function initializeGarden() {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting &&
                        !flowersRevealed
                    ) {

                        revealFlowers();

                    }

                });

            },
            {
                threshold: .3
            }
        );

    observer.observe(
        document.getElementById(
            "gardenSection"
        )
    );

}


function revealFlowers() {

    flowersRevealed = true;

    flowers.forEach(
        (flower, index) => {

            setTimeout(() => {

                flower.classList.add(
                    "visible"
                );

            }, index * 450);

        }
    );

}


/* ================================================================
   LIBRO
================================================================ */

const book =
    document.querySelector(".book");

const openBook =
    document.getElementById("openBook");

let bookOpened = false;


function initializeBook() {

    openBook.addEventListener(
        "click",
        () => {

            bookOpened = !bookOpened;

            if (bookOpened) {

                book.classList.add("open");

                openBook.textContent =
                    "cerrar el libro";

            } else {

                book.classList.remove("open");

                openBook.textContent =
                    "abrir el libro";

            }

        }
    );

}


/* ================================================================
   SCROLL REVEALS
================================================================ */

const revealElements =
    document.querySelectorAll(
        "h2, .player, .canvas-wrapper, .guitar-container, .book"
    );


revealElements.forEach(element => {

    element.classList.add("reveal");

});


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target.classList.add(
                        "visible"
                    );

                }

            });

        },
        {
            threshold: .15
        }
    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* ================================================================
   PARALLAX SUAVE
================================================================ */

let ticking = false;


window.addEventListener(
    "scroll",
    () => {

        if (ticking) return;

        window.requestAnimationFrame(() => {

            const scroll =
                window.scrollY;

            const sky =
                document.querySelector(
                    ".sky-copy"
                );

            if (sky) {

                sky.style.transform =
                    `translateY(${
                        scroll * .08
                    }px)`;

            }

            ticking = false;

        });

        ticking = true;

    }
);


/* ================================================================
   RESIZE
================================================================ */

window.addEventListener(
    "resize",
    () => {

        resizeIntroCanvas();

        if (started) {

            resizeSkyCanvas();

            createSkyStars();

            resizePaintingCanvas();

        }

    }
);


/* ================================================================
   TECLADO
================================================================ */

document.addEventListener(
    "keydown",
    event => {

        /*
           ESC:
           cerrar libro
        */

        if (
            event.key === "Escape" &&
            bookOpened
        ) {

            bookOpened = false;

            book.classList.remove(
                "open"
            );

            openBook.textContent =
                "abrir el libro";

        }

    }
);

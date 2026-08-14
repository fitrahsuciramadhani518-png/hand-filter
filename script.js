/* =====================================
   DATA USER
===================================== */

let currentUser = null;


/* =====================================
   ELEMENT HTML
===================================== */

const registerPage =
    document.getElementById("registerPage");

const gamePage =
    document.getElementById("gamePage");

const registerForm =
    document.getElementById("registerForm");

const registerMessage =
    document.getElementById("registerMessage");

const nameInput =
    document.getElementById("name");

const ageInput =
    document.getElementById("age");

const statusInput =
    document.getElementById("status");


/* =====================================
   FORM PENDAFTARAN
===================================== */

registerForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const name =
            nameInput.value.trim();

        const age =
            Number(ageInput.value);

        const status =
            statusInput.value;


        /* VALIDASI NAMA */

        if (name.length < 2) {

            registerMessage.textContent =
                "❌ Nama minimal 2 karakter.";

            return;
        }


        /* VALIDASI UMUR */

        if (age < 14) {

            registerMessage.textContent =
                "🚫 Maaf, pengguna di bawah 14 tahun tidak dapat masuk.";

            return;
        }


        if (age > 100) {

            registerMessage.textContent =
                "❌ Masukkan umur yang valid.";

            return;
        }


        /* VALIDASI STATUS */

        if (status === "") {

            registerMessage.textContent =
                "❌ Silakan pilih status kamu.";

            return;
        }


        /* SIMPAN DATA */

        currentUser = {

            name: name,

            age: age,

            status: status

        };


        /* MASUK KE GAME */

        openGame();

    }
);


/* =====================================
   BUKA GAME
===================================== */

function openGame() {

    registerPage.classList.add("hidden");

    gamePage.classList.remove("hidden");


    /* HEADER */

    document.getElementById(
        "userName"
    ).textContent =
        "👤 " + currentUser.name;


    document.getElementById(
        "userAge"
    ).textContent =
        currentUser.age + " tahun";


    /* PROFILE */

    document.getElementById(
        "profileName"
    ).textContent =
        currentUser.name;


    document.getElementById(
        "profileStatus"
    ).textContent =
        "📌 " + currentUser.status;


    document.getElementById(
        "profileAge"
    ).textContent =
        currentUser.age;

}


/* =====================================
   LOGOUT
===================================== */

document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        function() {

            location.reload();

        }
    );


/* =====================================
   CAMERA
===================================== */

const video =
    document.getElementById("video");

const canvas =
    document.getElementById("canvas");

const ctx =
    canvas.getContext("2d");

const gestureText =
    document.getElementById("gesture");

const filterName =
    document.getElementById("filterName");

const effect =
    document.getElementById("effect");


/* =====================================
   HITUNG JARAK
===================================== */

function distance(a, b) {

    return Math.sqrt(

        Math.pow(a.x - b.x, 2) +

        Math.pow(a.y - b.y, 2)

    );

}


/* =====================================
   CEK JARI
===================================== */

function fingerOpen(
    landmarks,
    tip,
    pip
) {

    return (
        landmarks[tip].y <
        landmarks[pip].y
    );

}


/* =====================================
   DETEKSI GESTURE
===================================== */

function detectGesture(
    landmarks
) {

    const index =
        fingerOpen(
            landmarks,
            8,
            6
        );

    const middle =
        fingerOpen(
            landmarks,
            12,
            10
        );

    const ring =
        fingerOpen(
            landmarks,
            16,
            14
        );

    const pinky =
        fingerOpen(
            landmarks,
            20,
            18
        );


    /* =========================
       TELAPAK
    ========================== */

    if (
        index &&
        middle &&
        ring &&
        pinky
    ) {

        return {

            name:
                "✋ TELAPAK TERBUKA",

            filter:
                "rainbow",

            filterName:
                "🌈 Rainbow Filter"

        };

    }


    /* =========================
       PEACE
    ========================== */

    if (
        index &&
        middle &&
        !ring &&
        !pinky
    ) {

        return {

            name:
                "✌️ PEACE",

            filter:
                "sparkle",

            filterName:
                "✨ Sparkle Filter"

        };

    }


    /* =========================
       SATU JARI
    ========================== */

    if (
        index &&
        !middle &&
        !ring &&
        !pinky
    ) {

        return {

            name:
                "☝️ SATU JARI",

            filter:
                "blue",

            filterName:
                "💙 Blue Filter"

        };

    }


    /* =========================
       KEPAL
    ========================== */

    if (
        !index &&
        !middle &&
        !ring &&
        !pinky
    ) {

        return {

            name:
                "👊 TANGAN MENGEPAL",

            filter:
                "electric",

            filterName:
                "⚡ Electric Filter"

        };

    }


    /* =========================
       JEMPOL
    ========================== */

    const thumb =
        landmarks[4];

    const indexFinger =
        landmarks[6];

    const thumbDistance =
        distance(
            thumb,
            indexFinger
        );


    if (
        thumbDistance > 0.15 &&
        !index &&
        !middle &&
        !ring &&
        !pinky
    ) {

        return {

            name:
                "👍 JEMPOL",

            filter:
                "fire",

            filterName:
                "🔥 Fire Filter"

        };

    }


    /* DEFAULT */

    return {

        name:
            "🤔 GAYA TANGAN...",

        filter:
            "",

        filterName:
            "Tidak ada filter"

    };

}


/* =====================================
   GANTI FILTER
===================================== */

function changeFilter(result) {

    effect.className = "";

    if (result.filter) {

        effect.classList.add(
            result.filter
        );

    }

    gestureText.textContent =
        result.name;

    filterName.textContent =
        "Filter: " +
        result.filterName;

}


/* =====================================
   HASIL MEDIA PIPE
===================================== */

function onResults(results) {

    canvas.width =
        video.videoWidth;

    canvas.height =
        video.videoHeight;


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    if (
        results.multiHandLandmarks &&
        results.multiHandLandmarks.length
    ) {

        const landmarks =
            results.multiHandLandmarks[0];


        /* GARIS TANGAN */

        drawConnectors(

            ctx,

            landmarks,

            HAND_CONNECTIONS,

            {

                color: "#60a5fa",

                lineWidth: 3

            }

        );


        /* TITIK JARI */

        drawLandmarks(

            ctx,

            landmarks,

            {

                color: "#ffffff",

                lineWidth: 1,

                radius: 4

            }

        );


        /* DETEKSI */

        const result =
            detectGesture(
                landmarks
            );


        changeFilter(result);

    }

    else {

        gestureText.textContent =
            "✋ Tunjukkan tangan";

        filterName.textContent =
            "Filter: -";

        effect.className = "";

    }

}


/* =====================================
   MEDIAPIPE
===================================== */

const hands =
    new Hands({

        locateFile:
            function(file) {

                return (
                    "https://cdn.jsdelivr.net/npm/" +
                    "@mediapipe/hands/" +
                    file
                );

            }

    });


hands.setOptions({

    maxNumHands: 1,

    modelComplexity: 1,

    minDetectionConfidence: 0.6,

    minTrackingConfidence: 0.6

});


hands.onResults(
    onResults
);


/* =====================================
   AKTIFKAN KAMERA
===================================== */

async function startCamera() {

    try {

        const stream =
            await navigator
                .mediaDevices
                .getUserMedia({

                    video: true,

                    audio: false

                });


        video.srcObject =
            stream;


        video.addEventListener(

            "loadeddata",

            processCamera,

            {
                once: true
            }

        );

    }

    catch(error) {

        console.error(error);

        gestureText.textContent =
            "❌ Kamera gagal dibuka";

        filterName.textContent =
            "Izinkan kamera di browser.";

    }

}


/* =====================================
   PROSES KAMERA
===================================== */

async function processCamera() {

    if (!video.videoWidth) {

        requestAnimationFrame(
            processCamera
        );

        return;

    }


    await hands.send({

        image: video

    });


    requestAnimationFrame(
        processCamera
    );

}


/* =====================================
   MULAI KAMERA SETELAH LOGIN
===================================== */

const originalOpenGame =
    openGame;


/*
   Setelah halaman game dibuka,
   kamera langsung dimulai.
*/

function openGame() {

    registerPage.classList.add(
        "hidden"
    );

    gamePage.classList.remove(
        "hidden"
    );


    document.getElementById(
        "userName"
    ).textContent =
        "👤 " +
        currentUser.name;


    document.getElementById(
        "userAge"
    ).textContent =
        currentUser.age +
        " tahun";


    document.getElementById(
        "profileName"
    ).textContent =
        currentUser.name;


    document.getElementById(
        "profileStatus"
    ).textContent =
        "📌 " +
        currentUser.status;


    document.getElementById(
        "profileAge"
    ).textContent =
        currentUser.age;


    /* Kamera dimulai setelah masuk */

    setTimeout(
        startCamera,
        500
    );

}
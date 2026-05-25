const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// DIRECTORIO 100% VERIFICADO: El búnker con los links reales que encontraste
const DIRECTORIO_SITIOS = {
    cinecalidad: [
        'https://www.cinecalidad.am', // Verificado por Nelson 🌟
        'https://cinecalidad.rs'
    ],
    cuevana: [
        'https://www.cuevana8.plus',  // Verificado por Nelson 🌟
        'https://cuevana.cz'
    ],
    pelisplus: [
        'https://pelisplus.autos',   // Verificado por Nelson 🌟
            ],
    gnula: [
        'https://wnv5.gnula.cc',     // ¡Tu nuevo link verificado de GNula!
            ]
};

// RUTA 1: Menú Principal con Presentación Especial para Aye ❤️
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>StreamBro</title>
        <style>
            body { background-color: #111; color: white; font-family: Arial, sans-serif; text-align: center; margin: 0; padding: 0; overflow: hidden; }
            
            /* PANTALLA DE PRESENTACIÓN (SPLASH) */
            #splash {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background-color: #000; z-index: 9999;
                display: flex; flex-direction: column; justify-content: center; align-items: center;
                transition: opacity 1.5s ease;
            }
            #splash h2 { font-size: 36px; margin-bottom: 20px; font-weight: 300; letter-spacing: 2px; }
            
            /* Animación del Corazón Latiendo */
            .corazon { color: #E50914; font-size: 80px; display: inline-block; animation: latido 1.2s infinite; }
            @keyframes latido {
                0% { transform: scale(1); }
                20% { transform: scale(1.15); }
                40% { transform: scale(1); }
                60% { transform: scale(1.15); }
                100% { transform: scale(1); }
            }

            /* CONTENIDO PRINCIPAL (MENÚ) */
            .main-content { padding-top: 50px; opacity: 0; transition: opacity 1s ease; }
            .main-content.visible { opacity: 1; }
            
            h1 { color: #E50914; font-size: 32px; margin-bottom: 40px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
            .grid { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; padding: 20px; box-sizing: border-box; }
            .boton-tv { 
                background-color: #222; color: white; border: 3px solid #444; 
                padding: 25px 30px; font-size: 22px; font-weight: bold; border-radius: 10px; 
                cursor: pointer; width: 220px; transition: 0.2s; text-decoration: none; display: inline-block; box-sizing: border-box;
            }
            /* Enfoque para usar con el teclado o control remoto */
            .boton-tv:focus, .boton-tv.focused { 
                border-color: #fff; background-color: #E50914; transform: scale(1.08); outline: none; box-shadow: 0 0 15px #E50914;
            }
        </style>
    </head>
    <body>

        <div id="splash">
            <h2>Cargando StreamBro...</h2>
            <h3 style="font-weight: 300; color: #aaa; margin-bottom: 30px;">Especial para Aye <span class="corazon">❤️</span></h3>
        </div>

        <div class="main-content" id="contenido-tv">
            <h1>STREAMBRO - SELECCIONÁ UN SERVIDOR</h1>
            <div class="grid">
                <a href="/ver?sitio=cinecalidad" class="boton-tv focused" tabindex="1">CineCalidad</a>
                <a href="/ver?sitio=cuevana" class="boton-tv" tabindex="2">Cuevana 3</a>
                <a href="/ver?sitio=pelisplus" class="boton-tv" tabindex="3">PelisPlus</a>
                <a href="/ver?sitio=gnula" class="boton-tv" tabindex="4">GNula</a>
            </div>
        </div>

        <script>
            // Tiempo de la intro (4.5 segundos)
            setTimeout(() => {
                const splash = document.getElementById('splash');
                const contenido = document.getElementById('contenido-tv');
                
                splash.style.opacity = '0'; 
                contenido.classList.add('visible'); 
                
                setTimeout(() => { splash.style.display = 'none'; }, 1500);
            }, 4500);

            // Control de navegación por flechas
            let botones = document.querySelectorAll('.boton-tv');
            let idx = 0;
            document.addEventListener('keydown', (e) => {
                if (document.getElementById('splash').style.display === 'none') { 
                    botones[idx].classList.remove('focused');
                    if (e.key === 'ArrowRight' && idx < botones.length - 1) idx++;
                    if (e.key === 'ArrowLeft' && idx > 0) idx--;
                    botones[idx].classList.add('focused');
                    botones[idx].focus();
                }
            });
        </script>
    </body>
    </html>
    `);
});

// RUTA 2: El raspador que clona la web por detrás y le vuela los anuncios molestos
app.get('/ver', async (req, res) => {
    const sitioElegido = req.query.sitio;
    const dominiosDisponibles = DIRECTORIO_SITIOS[sitioElegido];

    if (!dominiosDisponibles) return res.status(404).send("Sitio no válido.");

    let htmlLimpio = null;

    // Bucle para recorrer las opciones si alguna se cae
    for (const url of dominiosDisponibles) {
        try {
            const respuesta = await axios.get(url, {
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                    'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3'
                },
                timeout: 5000 // 5 segundos de espera antes de cambiar de link
            });
            htmlLimpio = respuesta.data;
            break; 
        } catch (error) {
            console.log(`Error al raspar ${url}, intentando otra opción...`);
        }
    }

    if (!htmlLimpio) return res.status(503).send("El servidor no pudo clonar ninguna de las webs en este momento.");

    // LIMPIADOR DE PUBLICIDAD: Remueve scripts molestos de anuncios y popups
    htmlLimpio = htmlLimpio.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, function(match, content) {
        if (content.includes('pop') || content.includes('ads') || content.includes('adsterra') || content.includes('analytics') || content.includes('onclick')) {
            return '';
        }
        return match;
    });

    // ESCUDO PROTECTOR: Bloquea ventanas emergentes
    const escudo = `<script>window.open = function() { return null; };</script>`;
    htmlLimpio = htmlLimpio.replace('</head>', `${escudo}</head>`);

    res.send(htmlLimpio);
});

app.listen(PORT, () => console.log(`StreamBro corriendo con links estables en puerto ${PORT}`));

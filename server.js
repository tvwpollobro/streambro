const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Directorio de servidores con extensiones de auxilio (Audio Latino)
const DIRECTORIO_SITIOS = {
    cinecalidad: [
        'https://www.cinecalidad.gg',
        'https://www.cinecalidad.to',
        'https://www.cinecalidad.is'
    ],
    cuevana: [
        'https://cuevana3.ch',
        'https://cuevana.biz',
        'https://cuevana3.io'
    ],
    pelisplus: [
        'https://pelisplus.to',
        'https://pelisplus.so',
        'https://pelisplus.lat'
    ],
    gnula: [
        'https://gnula.nu',
        'https://gnula.se'
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
        <title>Streamflix TV</title>
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
            /* Enfoque para el control remoto de la TV */
            .boton-tv:focus, .boton-tv.focused { 
                border-color: #fff; background-color: #E50914; transform: scale(1.08); outline: none; box-shadow: 0 0 15px #E50914;
            }
        </style>
    </head>
    <body>

        <div id="splash">
            <h2>Cargando Streamflix...</h2>
            <h3 style="font-weight: 300; color: #aaa; margin-bottom: 30px;">Especial para Aye <span class="corazon">❤️</span></h3>
        </div>

        <div class="main-content" id="contenido-tv">
            <h1>STREAMFLIX - SELECCIONÁ UN SERVIDOR</h1>
            <div class="grid">
                <a href="/ver?sitio=cinecalidad" class="boton-tv focused" tabindex="1">CineCalidad</a>
                <a href="/ver?sitio=cuevana" class="boton-tv" tabindex="2">Cuevana 3</a>
                <a href="/ver?sitio=pelisplus" class="boton-tv" tabindex="3">PelisPlus</a>
                <a href="/ver?sitio=gnula" class="boton-tv" tabindex="4">GNula</a>
            </div>
        </div>

        <script>
            // Manejo del tiempo de la intro (4.5 segundos)
            setTimeout(() => {
                const splash = document.getElementById('splash');
                const contenido = document.getElementById('contenido-tv');
                
                splash.style.opacity = '0'; 
                contenido.classList.add('visible'); 
                
                setTimeout(() => { splash.style.display = 'none'; }, 1500);
            }, 4500);

            // Control de navegación por flechas para el control remoto
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

// RUTA 2: El purificador inteligente con sistema anticaídas
app.get('/ver', async (req, res) => {
    const sitioElegido = req.query.sitio;
    const dominiosDisponibles = DIRECTORIO_SITIOS[sitioElegido];

    if (!dominiosDisponibles) return res.status(404).send("Sitio no válido.");

    let htmlLimpio = null;

    // Bucle para probar extensiones de auxilio si una se cae
    for (const url of dominiosDisponibles) {
        try {
            const respuesta = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                timeout: 6000 // 6 segundos de espera antes de saltar al siguiente dominio
            });
            htmlLimpio = respuesta.data;
            break; 
        } catch (error) {
            console.log(`Error en ${url}, probando extensión alternativa...`);
        }
    }

    if (!htmlLimpio) return res.status(503).send("Ninguna de las extensiones está respondiendo. Intentá más tarde.");

    // CORRECCIÓN ACÁ: Eliminadas las barras invertidas duplicadas que rompían Node.js
    htmlLimpio = htmlLimpio.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, function(match, content) {
        if (content.includes('pop') || content.includes('ads') || content.includes('adsterra') || content.includes('analytics')) {
            return '';
        }
        return match;
    });

    // Inyección del escudo de seguridad para congelar popups en el navegador de la tele
    const escudo = `<script>window.open = function() { return null; };</script>`;
    htmlLimpio = htmlLimpio.replace('</head>', `${escudo}</head>`);

    res.send(htmlLimpio);
});

app.listen(PORT, () => console.log(`Servidor de streaming activo de forma gratuita`));

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Directorio con los dominios alternativos activos para saltar caídas de DNS
const DIRECTORIO_SITIOS = {
    cinecalidad: [
        'https://cinecalidad.ro',
        'https://www.cinecalidad.to',
        'https://www.cinecalidad.gg'
    ],
    cuevana: [
        'https://cuevana.biz',
        'https://cuevana3.ch',
        'https://cuevana3.io'
    ],
    pelisplus: [
        'https://pelisplus.so',
        'https://pelisplus.to',
        'https://pelisplus.lat'
    ],
    gnula: [
        'https://gnula.se',
        'https://gnula.nu',
        'https://gnula.su'
    ]
};

// RUTA PRINCIPAL: Interfaz StreamBro con la intro para Aye ❤️
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
            #splash {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background-color: #000; z-index: 9999;
                display: flex; flex-direction: column; justify-content: center; align-items: center;
                transition: opacity 1.5s ease;
            }
            #splash h2 { font-size: 36px; margin-bottom: 20px; font-weight: 300; letter-spacing: 2px; }
            .corazon { color: #E50914; font-size: 80px; display: inline-block; animation: latido 1.2s infinite; }
            @keyframes latido {
                0% { transform: scale(1); }
                20% { transform: scale(1.15); }
                40% { transform: scale(1); }
                60% { transform: scale(1.15); }
                100% { transform: scale(1); }
            }
            .main-content { padding-top: 50px; opacity: 0; transition: opacity 1s ease; }
            .main-content.visible { opacity: 1; }
            h1 { color: #E50914; font-size: 32px; margin-bottom: 40px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
            .grid { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; padding: 20px; box-sizing: border-box; }
            .boton-tv { 
                background-color: #222; color: white; border: 3px solid #444; 
                padding: 25px 30px; font-size: 22px; font-weight: bold; border-radius: 10px; 
                cursor: pointer; width: 220px; transition: 0.2s; text-decoration: none; display: inline-block; box-sizing: border-box;
            }
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
            setTimeout(() => {
                const splash = document.getElementById('splash');
                const contenido = document.getElementById('contenido-tv');
                splash.style.opacity = '0'; 
                contenido.classList.add('visible'); 
                setTimeout(() => { splash.style.display = 'none'; }, 1500);
            }, 4500);

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

// RUTA CON ESTRATEGIA ANTIBLOQUEO DENTRO DE RENDER
app.get('/ver', async (req, res) => {
    const sitioElegido = req.query.sitio;
    const dominiosDisponibles = DIRECTORIO_SITIOS[sitioElegido];

    if (!dominiosDisponibles) return res.status(404).send("Sitio no válido.");

    let htmlLimpio = null;
    let urlExitosa = '';

    for (const url of dominiosDisponibles) {
        try {
            const respuesta = await axios.get(url, {
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept-Language': 'es-ES,es;q=0.9'
                },
                timeout: 5000
            });
            htmlLimpio = respuesta.data;
            urlExitosa = url;
            break; 
        } catch (error) {
            console.log(`Error conectando a ${url}, probando alternativa...`);
        }
    }

    if (!htmlLimpio) {
        return res.status(503).send("Ninguno de los servidores responde actualmente. Intentá de nuevo en unos minutos.");
    }

    // Filtro pulido para limpiar scripts de publicidad molesta
    htmlLimpio = htmlLimpio.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, function(match, content) {
        if (content.includes('pop') || content.includes('ads') || content.includes('adsterra') || content.includes('analytics') || content.includes('onclick')) {
            return '';
        }
        return match;
    });

    // Escudo anti popups y redirección de links internos para que sigan usando tu proxy
    const escudo = `
    <script>
        window.open = function() { return null; };
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('a').forEach(a => {
                if(a.href && !a.href.startsWith(window.location.origin)) {
                    // Evita que los links rompan el flujo de tu servidor
                    a.onerror = () => { window.location.href = "${urlExitosa}"; };
                }
            });
        });
    </script>`;
    
    htmlLimpio = htmlLimpio.replace('</head>', `${escudo}</head>`);
    res.send(htmlLimpio);
});

app.listen(PORT, () => console.log(`StreamBro corriendo en puerto ${PORT}`));

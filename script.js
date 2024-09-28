document.addEventListener("DOMContentLoaded", () => {
    const sectionsContainer = document.getElementById("sections-container");
    const sectionTemplate = document.getElementById("section-template").content;
    const menu = document.getElementById('menu');
    const gameContent = document.getElementById('game-content');

    // Define logo sets
    const logoSets = {
        tech: [
            {
                logoSrc: "logos/python.png",
                colours: ["#4584B6", "#FFDE57", "#fff"],
                logoName: "Python"
            },
            {
                logoSrc: "logos/slack.png",
                colours: ["#36C5F0", "#2EB67D", "#ECB22E", "#E01E5A", "#fff"],
                logoName: "Slack"
            },
            {
                logoSrc: "logos/vscode.png",
                colours: ["#0078d7", "#fff"],
                logoName: "Visual Studio Code"
            }
        ],
        football: [
            {
                logoSrc: "logos/arsenal.png",
                colours: ["#DA291C", "#fff", "#004B87","#9C824A"],
                logoName: "Arsenal"
            },
            {
                logoSrc: "logos/bcfc.png",
                colours: ["#0033A0", "#fff"],
                logoName: "Birmingham City"
            },
            {
                logoSrc: "logos/west_brom.png",
                colours: ["#003D6C", "#fff", "#EF3340","#34B233","#8B4513"],
                logoName: "West Bromwich Albion"
            }
        ],
        flags: [
            {
                logoSrc: "logos/flag_ireland.png",
                colours: ["#FF8200","#009A44", "#fff"],
                logoName: "Ireland"
            },
            {
                logoSrc: "logos/flag_hungary.png",
                colours: ["#CE2939", "#477050", "#fff"],
                logoName: "Hungary"
            },
            {
                logoSrc: "logos/flag_usa.png",
                colours: ["#0A3161", "#fff", "#B31942"],
                logoName: "United States"
            }
        ]
    };

    // Function to create sections based on logo data
    function createSections(data, selectedSet) {
        sectionsContainer.innerHTML = ''; // Clear existing sections

        data.forEach((data, index) => {
            const sectionClone = document.importNode(sectionTemplate, true);
            const heading = sectionClone.querySelector("h2");
            const canvas = sectionClone.querySelector(".draw-canvas");
            const revealButton = sectionClone.querySelector(".reveal_logo");
            const clearButton = sectionClone.querySelector(".clear-canvas");
            const colourOptions = sectionClone.querySelector(".options");
            const logoImage = sectionClone.querySelector(".logo img");

            // Set heading text and logo
            if (selectedSet === 'football') {
                heading.textContent = `Draw the ${data.logoName} badge`;
            } else if (selectedSet === 'flags') {
                heading.textContent = `Draw the ${data.logoName} flag`;
            } else {
                heading.textContent = `Draw the ${data.logoName} logo`;
            };
            logoImage.src = data.logoSrc;

            // Create colour list
            data.colours.forEach((color, idx) => {
                const li = document.createElement("li");
                li.classList.add("option");
                if (color === "#fff") li.classList.add("white-option");
                if (idx === 0) li.classList.add("selected");
                li.style.backgroundColor = color;
                colourOptions.appendChild(li);
            });

            let ctx = canvas.getContext("2d");
            let prevMouseX, prevMouseY, snapshot;
            let isDrawing = false;
            let brushWidth = 20;
            let selectedColour = data.colours[0];

            // Set drawing area
            const setCanvasSize = () => {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
                redrawCanvas();
            };

            // Keep drawing if browser resized
            const redrawCanvas = () => {
                if (snapshot) {
                    ctx.putImageData(snapshot, 0, 0);
                } else {
                    clearCanvas();
                }
            };

            // Function to clear canvas
            const clearCanvas = () => {
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            };

            const startDraw = (e) => {
                isDrawing = true;
                prevMouseX = e.offsetX;
                prevMouseY = e.offsetY;
                ctx.beginPath();
                ctx.moveTo(prevMouseX, prevMouseY);
            };

            const drawing = (e) => {
                if (!isDrawing) return;
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.lineWidth = brushWidth;
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.strokeStyle = selectedColour;
                ctx.stroke();
            };

            const stopDraw = () => {
                isDrawing = false;
                snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
            };

            window.addEventListener("load", setCanvasSize);
            window.addEventListener("resize", setCanvasSize);

            // Function to reveal logo
            revealButton.addEventListener("click", () => {
                const logo = revealButton.nextElementSibling;
                revealButton.style.display = 'none';
                logo.style.display = 'flex';
            });

            // Function to change colour 
            sectionClone.querySelectorAll(".colours .option").forEach(btn => {
                btn.addEventListener("click", () => {
                    const selectedOption = colourOptions.querySelector(".options .selected");
                    if (selectedOption) {
                        selectedOption.classList.remove("selected");
                    }
                    btn.classList.add("selected");
                    selectedColour = window.getComputedStyle(btn).getPropertyValue("background-color");
                });
            });

            clearButton.addEventListener("click", clearCanvas);

            // Draw on mouse clicks
            canvas.addEventListener("mousedown", startDraw);
            canvas.addEventListener("mousemove", drawing);
            canvas.addEventListener("mouseup", stopDraw);
            canvas.addEventListener("mouseout", stopDraw);

            // Add to output
            sectionsContainer.appendChild(sectionClone);
            setCanvasSize();
        });
    }

    // Menu functionality
    menu.addEventListener('click', (event) => {
        if (event.target.classList.contains('logo-set-btn')) {
            const selectedSet = event.target.dataset.set;
            menu.classList.add('hidden');
            gameContent.classList.remove('hidden');
            createSections(logoSets[selectedSet], selectedSet);
        }
    });

    // Initialize with the first logo set
    createSections(logoSets.tech); // Default to tech logos

});

document.addEventListener("DOMContentLoaded", () => {
    const sectionsContainer = document.getElementById("sections-container");
    const sectionTemplate = document.getElementById("section-template").content;

    // input logos and colours
    const sectionData = [
        {
            logoSrc: "logos/python.png",
            colours: ["#4584B6", "#FFDE57", "#fff"],
            logoName: "Python"
        },
        {
            logoSrc: "logos/slack.png",
            colours: ["#36C5F0", "#2EB67D", "#ECB22E","#E01E5A","#fff"],
            logoName: "Slack"
        },
        {
            logoSrc: "logos/vscode.png",
            colours: ["#0078d7", "#fff"],
            logoName: "Visual Studio Code"
        }
    ];

    // Create section for each logo above
    sectionData.forEach((data, index) => {
        const sectionClone = document.importNode(sectionTemplate, true);
        const heading = sectionClone.querySelector("h2");
        const canvas = sectionClone.querySelector(".draw-canvas");
        const revealButton = sectionClone.querySelector(".reveal_logo");
        const clearButton = sectionClone.querySelector(".clear-canvas");
        const colourOptions = sectionClone.querySelector(".options");
        const logoImage = sectionClone.querySelector(".logo img");

        // Set heading text and logo
        heading.textContent = `Draw the ${data.logoName} logo`;
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
        let brushWidth = 15;
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
    });
});

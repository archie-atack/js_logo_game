const canvas = document.getElementById("canvas-1"),
ctx = canvas.getContext("2d"),
colourBtns = document.querySelectorAll(".colours .option"),
revealLogoBtns = document.querySelectorAll(".reveal_logo"),
firstOption = document.querySelector('.colours .option:first-child'),
clearCanvasBtn = document.querySelector(".clear-canvas");

let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
brushWidth = 15,
selectedColour = "#000";

// Set canvas for drawing areas and account if browser resized
const setCanvasSize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    redrawCanvas();
};

// Redraw canvas content if browser resized
const redrawCanvas = () => {
    if (snapshot) {
        ctx.putImageData(snapshot, 0, 0);
    } else {
        clearCanvas();
    }
};

// Clear canvas
const clearCanvas = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// Set canvas on load or resize
window.addEventListener("load", () => {
    setCanvasSize();
    selectedColour = getComputedStyle(firstOption).getPropertyValue('background-color') // set default colour
});

window.addEventListener("resize", () => {
    setCanvasSize();
});

// Function to start drawing
const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
};

// Function for drawing process
const drawing = (e) => {
    if (!isDrawing) return;
    
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineWidth = brushWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = selectedColour;
    ctx.stroke();
};

// Function to stop drawing
const stopDraw = () => {
    isDrawing = false;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

// Function to reveal logos
revealLogoBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const logoId = btn.id.replace("reveal-button-", "logo-");
        const logo = document.getElementById(logoId);
        btn.style.display = 'none';
        logo.style.display = 'flex';
    });
});

// Function to change colour
colourBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // pass button background as colour 
        selectedColour = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

// Clear canvas when clicking button
clearCanvasBtn.addEventListener("click", () => {
    clearCanvas();
});

// Draw upon mouse clicks
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseout", stopDraw);
const canvas = document.getElementById("draw-canvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let currentColor = "black";

let brands = ["Pepsi", "Coca-Cola", "Nike", "Adidas", "Apple", "Samsung"];
let usedBrands = [];

let brandImages = {
    "Pepsi": "img/pepsi-png-42992.png",
    "Coca-Cola": "img/Coca-Cola_logo.svg",
    "Nike": "img/pngimg.com - nike_PNG11.png",
    "Adidas": "img/adidas-logo-transparent-4.png",
    "Apple": "img/vecteezy_apple_1199813.png",
    "Samsung": "img/Samsung_Logo.svg"
};

let drawingEnabled = true; // This flag controls whether drawing is allowed

// Set up the color buttons with additional colors
const colorButtons = document.querySelectorAll(".color-btn");

const colors = ["black", "red", "yellow", "green", "blue"];

const colorContainer = document.querySelector('.color-options');

// Create color buttons dynamically
colors.forEach(color => {
    const button = document.createElement('button');
    button.className = "color-btn";
    button.style.backgroundColor = color;
    button.dataset.color = color;
    button.addEventListener("click", () => {
        if (drawingEnabled) {
            currentColor = color;
        }
    });
    colorContainer.appendChild(button);
});

// Drawing logic
function startPosition(e) {
    if (!drawingEnabled) return; // Prevent drawing if disabled
    drawing = true;
    draw(e); // Draw immediately when the touch/mouse starts
}

function endPosition() {
    drawing = false;
    ctx.beginPath(); // Stop drawing when mouse or touch is released
}

function draw(e) {
    if (!drawing) return;
    e.preventDefault(); // Prevent default scrolling on touch devices
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;

    let x, y;
    // Handle both mouse and touch events
    if (e.type.startsWith('touch')) {
        const touch = e.touches[0] || e.changedTouches[0];
        x = touch.clientX  - canvas.getBoundingClientRect().left;
        y = touch.clientY - canvas.getBoundingClientRect().top;
    
    } else {
        x = e.offsetX;
        y = e.offsetY;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Mouse Events
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

// Touch Events
canvas.addEventListener("touchstart", startPosition);
canvas.addEventListener("touchend", endPosition);
canvas.addEventListener("touchmove", draw);

// Clear Canvas
document.getElementById("clear-canvas").addEventListener("click", () => {
    if (drawingEnabled) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

// Done Drawing
document.getElementById("done-drawing").addEventListener("click", () => {
    // Disable drawing after clicking 'Done Drawing'
    drawingEnabled = false;

    let brandName = document.getElementById("brand-name").textContent;
    document.getElementById("brand-logo").src = brandImages[brandName]; // Display the brand's image
    document.getElementById("brand-logo").style.display = "block";
    document.getElementById("brand-name").style.display = "none";

    // Show the 'Next' button and hide 'Done Drawing' button
    document.getElementById("done-drawing").style.display = "none";
    document.getElementById("next-brand").style.display = "inline-block";
});

// Next Brand
document.getElementById("next-brand").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    if (brands.length > 0) {
        let randomIndex = Math.floor(Math.random() * brands.length);
        let nextBrand = brands[randomIndex];

        usedBrands.push(nextBrand);
        brands.splice(randomIndex, 1);

        // Reset for the next brand
        document.getElementById("brand-name").textContent = nextBrand;
        document.getElementById("brand-logo").style.display = "none";
        document.getElementById("brand-name").style.display = "block";
        document.getElementById("done-drawing").style.display = "inline-block";
        document.getElementById("next-brand").style.display = "none";

        // Re-enable drawing for the next brand
        drawingEnabled = true;
    } else {
        // All brands have been used, show "Play Again" button
        alert("No more brands to show!");

        document.getElementById("play-again").style.display = "inline-block";
        document.getElementById("next-brand").style.display = "none";
        document.getElementById("done-drawing").style.display = "none";
    }
});

// Play Again (refresh the page)
document.getElementById("play-again").addEventListener("click", () => {
    location.reload(); // Refresh the page to restart
});

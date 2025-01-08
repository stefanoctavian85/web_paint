const canvas = document.getElementById("paint-canvas");
const context = canvas.getContext("2d");
const clearButton = document.getElementById("clear-paint");
const downloadButton = document.getElementById("download-button");
const downloadType = document.getElementById("type");
const downloadCanvas = document.getElementById("download-canvas");
const increaseThicknessBtn = document.getElementById("increase");
const decreaseThicknessBtn = document.getElementById("decrease");
const lineThickness = document.getElementById("current-elem-thickness");
const backgroundColorInput = document.getElementById("bg-color");
const fillColorInput = document.getElementById("fill-color");
const strokeColorInput = document.getElementById("stroke-color");
const brush = document.getElementById("brush");
const line = document.getElementById("line");
const ellipse = document.getElementById("ellipse");
const rectangle = document.getElementById("rectangle");
const listOfFigures = document.getElementById("list-of-figures");
const selectedFigure = document.getElementById("selected-figure");
const startX = document.getElementById("startX");
const startY = document.getElementById("startY");
const endX = document.getElementById("endX");
const endY = document.getElementById("endY");
const modifyBtn = document.getElementById("modify-btn");

let shapesList = [];

let thickness = 1;
let backgroundColor = "#FFFFFF";
let strokeColor = "#000000";
let fillColor = "#000000";

window.addEventListener("load", () => {
    backgroundColorInput.value = backgroundColor;
    canvas.style.backgroundColor = backgroundColor;
    fillColorInput.value = fillColor;
    strokeColorInput.value = strokeColor;

    backgroundColorInput.addEventListener("change", (event) => {
        backgroundColor = event.target.value;
        canvas.style.backgroundColor = backgroundColor;

        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
    });

    fillColorInput.addEventListener("change", (event) => {
        fillColor = event.target.value;
    });

    strokeColorInput.addEventListener("change", (event) => {
        strokeColor = event.target.value;
    });
});

let drawing = false;

function getMousePosition(event) {
    let x = event.clientX - canvas.getBoundingClientRect().left
    let y = event.clientY - canvas.getBoundingClientRect().top;
    return {
        x, y
    };
}

let drawnCanvas;
var startPoint = null;
var endPoint = null;
let currentShape;

function saveCurrentState() {
    drawnCanvas = context.getImageData(0, 0, canvas.width, canvas.height);
}

function putCurrentState() {
    context.putImageData(drawnCanvas, 0, 0);
}

function setShapeStyles() {
    context.lineWidth = thickness;
    context.strokeStyle = strokeColor;
    context.fillStyle = fillColor;
}

function startDrawing(event, shape) {
    drawing = true;
    startPoint = getMousePosition(event);
    saveCurrentState();
    currentShape = shape;
}

function stopDrawing(event) {
    if (drawing) {
        drawing = false;
        endPoint = getMousePosition(event);
        shapesList.push({
            "shape": currentShape,
            "start-point": {
                x: startPoint.x,
                y: startPoint.y,
            },
            "end-point": {
                x: endPoint.x,
                y: endPoint.y,
            },
        });
        if (currentShape === "brush") {
            drawBrush(endPoint);
            return;
        } else if (currentShape === "line") {
            drawLine(endPoint);
            return;
        } else if (currentShape === "ellipse") {
            drawEllipse(endPoint);
            return;
        } else if (currentShape === "rectangle") {
            drawRect(endPoint);
            return;
        }
        putCurrentState();
        return;
    } else {
        showFiguresInList(shapesList);
        return;
    }
}

function drawBrush(event) {
    if (!drawing) {
        return;
    }

    saveCurrentState();
    setShapeStyles();

    context.beginPath();
    context.moveTo(startPoint.x, startPoint.y);
    startPoint = getMousePosition(event);
    context.lineTo(startPoint.x, startPoint.y);
    context.stroke();
}

function drawLine(endPoint) {
    setShapeStyles();

    context.beginPath();
    context.moveTo(startPoint.x, startPoint.y);

    context.lineTo(endPoint.x, endPoint.y);
    context.stroke();
}

function showLine(event) {
    if (drawing) {
        putCurrentState();
        endPoint = getMousePosition(event);
        drawLine(endPoint);
    }
}

function showEllispe(event) {
    if (drawing) {
        putCurrentState();
        endPoint = getMousePosition(event);
        drawEllipse(endPoint);
    }
}

function drawEllipse(endPoint) {
    let area = Math.sqrt(Math.pow((startPoint.x - endPoint.x), 2) + Math.pow((startPoint.y - endPoint.y), 2));

    setShapeStyles();

    context.beginPath();
    context.arc(startPoint.x, startPoint.y, area, 0, 2 * Math.PI, false);
    context.stroke();
    context.fill();
}

function drawRect(endPoint) {
    setShapeStyles();

    context.beginPath();
    context.rect(startPoint.x, startPoint.y, (endPoint.x - startPoint.x), (endPoint.y - startPoint.y));
    context.stroke();
    context.fill();
}

function showRect(event) {
    if (drawing) {
        putCurrentState();
        endPoint = getMousePosition(event);
        drawRect(endPoint);
    }
}

function deactivateAllEvents() {
    canvas.removeEventListener("mousedown", startDrawing);
    canvas.removeEventListener("mouseup", stopDrawing);
    canvas.removeEventListener("mouseleave", stopDrawing);
    canvas.removeEventListener("mousemove", drawBrush);
    canvas.removeEventListener("mousemove", drawLine);
    canvas.removeEventListener("mousemove", drawEllipse);
    canvas.removeEventListener("mousemove", drawRect);
    canvas.removeEventListener("mousemove", showLine);
    canvas.removeEventListener("mousemove", showEllispe);
    canvas.removeEventListener("mousemove", showRect);
}

function activateEventsForBrush() {
    deactivateAllEvents();
    canvas.addEventListener("mousedown", (event) => startDrawing(event, "brush"));
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    canvas.addEventListener("mousemove", drawBrush);
}

function activateEventsForLine() {
    deactivateAllEvents();
    canvas.addEventListener("mousedown", (event) => startDrawing(event, "line"));
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    canvas.addEventListener("mousemove", showLine);
}

function activateEventsForEllipse() {
    deactivateAllEvents();
    canvas.addEventListener("mousedown", (event) => startDrawing(event, "ellipse"));
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    canvas.addEventListener("mousemove", showEllispe);
}

function activateEventsForRectangle() {
    deactivateAllEvents();
    canvas.addEventListener("mousedown", (event) => startDrawing(event, "rectangle"));
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    canvas.addEventListener("mousemove", showRect);
}

brush.addEventListener("click", () => {
    activateEventsForBrush();
});

line.addEventListener("click", () => {
    activateEventsForLine();
});

ellipse.addEventListener("click", () => {
    activateEventsForEllipse();
});

rectangle.addEventListener("click", () => {
    activateEventsForRectangle();
});

increaseThicknessBtn.addEventListener("click", () => {
    thickness += 1;
    lineThickness.innerHTML = `Current element thickness: ${thickness}px`
});

decreaseThicknessBtn.addEventListener("click", () => {
    if (thickness === 1) {
        alert("Line thickness cannot be less than 1px!");
        return;
    }

    thickness -= 1;
    lineThickness.innerHTML = `Current element thickness: ${thickness}px`
});

clearButton.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.backgroundColor = "#FFFFFF";
    backgroundColorInput.value = "#FFFFFF";
    context.fillStyle = backgroundColorInput.value;
    context.fillRect(0, 0, canvas.width, canvas.height);
    canvas.style.strokeStyle = "#000000";
    canvas.style.fillColor = "#000000";
    strokeColorInput.value = "#000000";
    fillColorInput.value = "#000000";
    strokeColor = "#000000";
    fillColor = "#000000";
    shapesList = [];
    selectedFigure.textContent = "";
    startX.value = "";
    startY.value = "";
    endX.value = "";
    endY.value = "";
    showFiguresInList(shapesList);
});

let modifyElementIndex;

function showFiguresInList(shapesList) {
    listOfFigures.innerHTML = '';

    shapesList.forEach((item, index) => {
        const listItem = document.createElement("li");
        let separator = document.createElement("div");
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-danger", "delete-button");
        deleteButton.style.margin = "5px 10px";
        deleteButton.textContent = "Delete";
        let modifyButton = document.createElement("button");
        modifyButton.classList.add("btn", "btn-dark", "modify-button");
        modifyButton.textContent = "Modify";

        separator.classList.add("horizontal-separator");
        listItem.innerHTML = `<p>${item.shape}</p> <p>StartPoint: ${item["start-point"].x} - ${item["start-point"].y}</p> <p>EndPoint: ${item["end-point"].x} - ${item["end-point"].y}</p>`;

        listOfFigures.appendChild(listItem);
        listOfFigures.appendChild(deleteButton);
        listOfFigures.appendChild(modifyButton);
        listOfFigures.appendChild(separator);

        deleteButton.addEventListener("click", () => {
            if (item["shape"] === "rectangle") {
                shapesList.splice(index, 1);
                showFiguresInList(shapesList);
                context.clearRect(item["start-point"].x - thickness, item["start-point"].y - thickness, item["end-point"].x - item["start-point"].x + thickness * 2, item["end-point"].y - item["start-point"].y + thickness * 2);
                context.fillStyle = backgroundColor;
                context.fillRect(item["start-point"].x - thickness, item["start-point"].y - thickness, item["end-point"].x - item["start-point"].x + thickness * 2, item["end-point"].y - item["start-point"].y + thickness * 2);
            } else if (item["shape"] === "ellipse") {
                shapesList.splice(index, 1);
                showFiguresInList(shapesList);
                let area = Math.sqrt(Math.pow((item["start-point"].x - item["end-point"].x), 2) + Math.pow((item["start-point"].y - item["end-point"].y), 2));
                context.clearRect(item["start-point"].x - area - thickness, item["start-point"].y - area - thickness, area * 2 + thickness * 2, area * 2 + thickness * 2);
                context.fillStyle = backgroundColor;
                context.fillRect(item["start-point"].x - area - thickness, item["start-point"].y - area - thickness, area * 2 + thickness * 2, area * 2 + thickness * 2);
            } else {
                alert("You cannot delete a draw made with the brush or a line!");
                return;
            }
        });
        modifyButton.addEventListener("click", () => {
            if (item["shape"] === "brush" || item["shape"] === "line") {
                alert("You cannot modify a draw made with the brush or a line!");
                return;
            }
            selectedFigure.textContent = `Selected figure: ${item["shape"]}`;
            startX.value = item["start-point"].x;
            startY.value = item["start-point"].y;
            endX.value = item["end-point"].x;
            endY.value = item["end-point"].y;
            startX.removeAttribute("readonly");
            startY.removeAttribute("readonly");
            endX.removeAttribute("readonly");
            endY.removeAttribute("readonly");
            modifyElementIndex = index;
        });
    });
}

modifyBtn.addEventListener("click", () => {
    if (startX.value < 0 || startY.value < 0 || endX.value < 0 || endY.value < 0) {
        alert("You cannot enter negative values!");
        return;
    } else {
        const newStartX = parseFloat(startX.value);
        const newStartY = parseFloat(startY.value);
        const newEndX = parseFloat(endX.value);
        const newEndY = parseFloat(endY.value);

        if (modifyElementIndex >= 0 && modifyElementIndex <= shapesList.length) {
            if (shapesList[modifyElementIndex]["shape"] == "rectangle") {
                let item = shapesList[modifyElementIndex];
                context.clearRect(item["start-point"].x - thickness, item["start-point"].y - thickness, item["end-point"].x - item["start-point"].x + thickness * 2, item["end-point"].y - item["start-point"].y + thickness * 2);
                context.fillStyle = backgroundColor;
                context.clearRect(item["start-point"].x - thickness, item["start-point"].y - thickness, item["end-point"].x - item["start-point"].x + thickness * 2, item["end-point"].y - item["start-point"].y + thickness * 2);
                shapesList[modifyElementIndex]["start-point"] = { x: newStartX, y: newStartY };
                shapesList[modifyElementIndex]["end-point"] = { x: newEndX, y: newEndY };
                item = shapesList[modifyElementIndex];
                context.beginPath();
                context.fillStyle = fillColor;
                context.rect(item["start-point"].x, item["start-point"].y, (item["end-point"].x - item["start-point"].x), (item["end-point"].y - item["start-point"].y));
                context.stroke();
                context.fill();
            } else {
                let item = shapesList[modifyElementIndex];
                let area = Math.sqrt(Math.pow((item["start-point"].x - item["end-point"].x), 2) + Math.pow((item["start-point"].y - item["end-point"].y), 2));
                context.clearRect(item["start-point"].x - area - thickness, item["start-point"].y - area - thickness, area * 2 + thickness * 2, area * 2 + thickness * 2);
                context.fillStyle = backgroundColor;
                context.fillRect(item["start-point"].x - area - thickness, item["start-point"].y - area - thickness, area * 2 + thickness * 2, area * 2 + thickness * 2);
                shapesList[modifyElementIndex]["start-point"] = { x: newStartX, y: newStartY };
                shapesList[modifyElementIndex]["end-point"] = { x: newEndX, y: newEndY };
                item = shapesList[modifyElementIndex];
                area = Math.sqrt(Math.pow((item["start-point"].x - item["end-point"].x), 2) + Math.pow((item["start-point"].y - item["end-point"].y), 2));
                context.beginPath();
                context.fillStyle = fillColor;
                context.arc(item["start-point"].x, item["start-point"].y, area, 0, 2 * Math.PI, false);
                context.stroke();
                context.fill();
            }
            showFiguresInList(shapesList);
        }
        selectedFigure.textContent = "";
        startX.value = "";
        startY.value = "";
        endX.value = "";
        endY.value = "";
        startX.setAttribute("readonly", "true");
        startY.setAttribute("readonly", "true");
        endX.setAttribute("readonly", "true");
        endY.setAttribute("readonly", "true");
    }
})

function convertCanvasToSVG() {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">`;

    for (let i = 0; i < canvas.height; i++) {
        for (let j = 0; j < canvas.width; j++) {
            const index = (i * canvas.width + j) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];

            if (a > 0) {
                svg += `<rect x="${j}" y="${i}" width="1" height="1" fill="rgba(${r}, ${g}, ${b}, ${a})" />`;
            }
        }
    }

    svg += `</svg>`;
    return svg;
}

downloadButton.addEventListener("click", (event) => {
    event.preventDefault();

    if (downloadType.value === "none") {
        alert("You must select an option!");
        return;
    } else if (downloadType.value === "png") {
        const image = canvas.toDataURL("image/png");
        downloadCanvas.href = image;
        downloadCanvas.download = "image.png";
        downloadCanvas.click();
    } else if (downloadType.value === "jpeg") {
        const image = canvas.toDataURL();
        downloadCanvas.href = image;
        downloadCanvas.download = "image.jpeg";
        downloadCanvas.click();
    } else if (downloadType.value === "svg") {
        const svg = convertCanvasToSVG();
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const image = URL.createObjectURL(blob);

        downloadCanvas.href = image;
        downloadCanvas.download = "image.svg";
        downloadCanvas.click();
    }
});

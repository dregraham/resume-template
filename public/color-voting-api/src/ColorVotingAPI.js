// ColorVotingAPI.js

const API_ENDPOINT = 'https://tki9q67dsg.execute-api.us-east-2.amazonaws.com';

// DOM elements
const colorWheel = document.getElementById('colorWheel');
const selectedColorDiv = document.getElementById('selectedColor');
const colorInfo = document.getElementById('colorInfo');
const voteButton = document.getElementById('voteButton');
const loading = document.getElementById('loading');
const resultsContainer = document.getElementById('resultsContainer');

// Variables to store state
let selectedColor = null;
let ctx;
let centerX, centerY, radius;

// Rainbow color generation functions
function generateRainbowColors(count) {
    const colors = [];
    const hueStep = 360 / count;
    for (let i = 0; i < count; i++) {
        const hue = (hueStep * i) % 360;
        colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
}

function getRainbowColor(index, total) {
    const hue = (index * 360 / total) % 360;
    return `hsl(${hue}, 70%, 50%)`;
}

// Initialize the color wheel
function initColorWheel() {
    colorWheel.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    colorWheel.appendChild(canvas);

    ctx = canvas.getContext('2d');
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    radius = Math.min(centerX, centerY) - 10;

    drawRainbowArc();

    let wheelTooltip = document.getElementById('colorWheelTooltip');
    if (!wheelTooltip) {
        wheelTooltip = document.createElement('div');
        wheelTooltip.id = 'colorWheelTooltip';
        wheelTooltip.style.position = 'absolute';
        wheelTooltip.style.display = 'none';
        wheelTooltip.style.background = '#222';
        wheelTooltip.style.color = '#fff';
        wheelTooltip.style.padding = '4px 10px';
        wheelTooltip.style.borderRadius = '5px';
        wheelTooltip.style.fontSize = '16px';
        wheelTooltip.style.pointerEvents = 'none';
        wheelTooltip.style.zIndex = 1000;
        document.body.appendChild(wheelTooltip);
    }

    canvas.addEventListener('mousemove', function (event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const dx = x - 150;
        const dy = y - 180;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let angle = Math.atan2(dy, dx);
        if (angle < 0) angle += 2 * Math.PI;

        let found = false;
        for (const arc of ctx._rainbowArcs) {
            if (
                dist >= arc.innerRadius &&
                dist <= arc.outerRadius &&
                angle >= arc.start &&
                angle <= arc.end
            ) {
                wheelTooltip.style.display = 'block';
                wheelTooltip.textContent = arc.name;
                wheelTooltip.style.left = (event.pageX + 10) + 'px';
                wheelTooltip.style.top = (event.pageY - 10) + 'px';
                found = true;
                break;
            }
        }
        if (!found) {
            wheelTooltip.style.display = 'none';
        }
    });

    canvas.addEventListener('mouseleave', function () {
        wheelTooltip.style.display = 'none';
    });

    canvas.addEventListener('click', handleColorSelection);
}

function drawRainbowArc() {
    const rainbowColors = [
        { name: 'Red', hex: '#FF0000' },
        { name: 'Orange', hex: '#FF7F00' },
        { name: 'Yellow', hex: '#FFFF00' },
        { name: 'Chartreuse Green', hex: '#7FFF00' },
        { name: 'Green', hex: '#00FF00' },
        { name: 'Spring Green', hex: '#00FF7F' },
        { name: 'Cyan', hex: '#00FFFF' },
        { name: 'Azure', hex: '#007FFF' },
        { name: 'Blue', hex: '#0000FF' },
        { name: 'Violet', hex: '#8B00FF' },
        { name: 'Magenta', hex: '#FF00FF' },
        { name: 'Rose', hex: '#FF007F' }
    ];

    ctx.clearRect(0, 0, 300, 300);
    const arcWidth = 40;
    const outerRadius = 140;
    const innerRadius = outerRadius - arcWidth;
    const centerX = 150;
    const centerY = 180;
    const total = rainbowColors.length;
    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;
    const angleStep = (endAngle - startAngle) / total;

    ctx._rainbowArcs = [];

    for (let i = 0; i < total; i++) {
        const color = rainbowColors[i];
        const arcStart = startAngle + i * angleStep;
        const arcEnd = arcStart + angleStep;

        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, arcStart, arcEnd, false);
        ctx.arc(centerX, centerY, innerRadius, arcEnd, arcStart, true);
        ctx.closePath();
        ctx.fillStyle = color.hex;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx._rainbowArcs.push({
            start: arcStart,
            end: arcEnd,
            innerRadius,
            outerRadius,
            hex: color.hex,
            name: color.name
        });
    }
}

// Handle color selection when user clicks on the wheel
function handleColorSelection(event) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dx = x - 150;
    const dy = y - 180;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let angle = Math.atan2(dy, dx);
    if (angle < 0) angle += 2 * Math.PI;

    for (const arc of ctx._rainbowArcs) {
        if (
            dist >= arc.innerRadius &&
            dist <= arc.outerRadius &&
            angle >= arc.start &&
            angle <= arc.end
        ) {
            selectedColor = arc.hex;
            selectedColorDiv.style.backgroundColor = arc.hex;
            colorInfo.textContent = `Selected: ${arc.name}`;
            voteButton.disabled = false;
            break;
        }
    }
}

// Send vote to API
async function sendVote() {
    if (!selectedColor) {
        alert('Please select a color first');
        return;
    }

    const colorValue = selectedColor.substring(1);

    try {
        loading.style.display = 'block';
        voteButton.disabled = true;

        const response = await fetch(`${API_ENDPOINT}/production/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                color: colorValue,
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const colorObj = ctx._rainbowArcs
            ? ctx._rainbowArcs.find(c => c.hex.toUpperCase() === selectedColor.toUpperCase())
            : null;
        const colorName = colorObj ? colorObj.name : selectedColor;
        alert(`${colorName} has been added to the voting results!`);

        await getVotingResults();
    } catch (error) {
        console.error('Error sending vote:', error);
        alert('Failed to send vote. Please try again.');
    } finally {
        loading.style.display = 'none';
        voteButton.disabled = false;
    }
}

// Get current voting results
async function getVotingResults() {
    try {
        loading.style.display = 'block';

        const response = await fetch(`${API_ENDPOINT}/production/votes`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Error getting results:', error);
        resultsContainer.innerHTML = '<p>Failed to load results</p>';
    } finally {
        loading.style.display = 'none';
    }
}

// Display voting results as a rainbow
function displayResults(data) {
    let oldCanvas = document.getElementById('rainbowResultsCanvas');
    if (oldCanvas) oldCanvas.remove();

    const rainbowColors = [
        { name: 'Red', hex: '#FF0000' },
        { name: 'Orange', hex: '#FF7F00' },
        { name: 'Yellow', hex: '#FFFF00' },
        { name: 'Chartreuse Green', hex: '#7FFF00' },
        { name: 'Green', hex: '#00FF00' },
        { name: 'Spring Green', hex: '#00FF7F' },
        { name: 'Cyan', hex: '#00FFFF' },
        { name: 'Azure', hex: '#007FFF' },
        { name: 'Blue', hex: '#0000FF' },
        { name: 'Violet', hex: '#8B00FF' },
        { name: 'Magenta', hex: '#FF00FF' },
        { name: 'Rose', hex: '#FF007F' }
    ];

    let totalVotes = 0;
    for (const color in data) totalVotes += data[color];

    const sortedColors = rainbowColors.map(c => {
        const hex = c.hex.replace('#', '').toUpperCase();
        const key = Object.keys(data).find(k => k.toUpperCase() === hex) || hex;
        return {
            ...c,
            votes: data[key] || 0,
            hexKey: key
        };
    });

    const width = 500;
    const height = 250;
    const centerX = width / 2;
    const centerY = height * 1.1;
    const outerRadius = height * 0.95;
    const innerRadius = height * 0.45;

    const canvas = document.createElement('canvas');
    canvas.id = 'rainbowResultsCanvas';
    canvas.width = width;
    canvas.height = height;
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(canvas);

    const tooltip = document.createElement('div');
    tooltip.id = 'rainbowTooltip';
    document.body.appendChild(tooltip);

    let startAngle = Math.PI;
    const ctx = canvas.getContext('2d');
    canvas._arcs = [];
    sortedColors.forEach((colorObj) => {
        const votes = colorObj.votes;
        if (votes === 0) return;
        const percentage = totalVotes > 0 ? votes / totalVotes : 0;
        const arcAngle = Math.PI * percentage;
        const hexColor = colorObj.hex;

        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + arcAngle, false);
        ctx.arc(centerX, centerY, innerRadius, startAngle + arcAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = hexColor;
        ctx.fill();

        canvas._arcs.push({
            start: startAngle,
            end: startAngle + arcAngle,
            color: hexColor,
            name: colorObj.name,
            votes: votes
        });

        startAngle += arcAngle;
    });

    canvas.addEventListener('mousemove', function (e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let angle = Math.atan2(dy, dx);
        if (angle < 0) angle += 2 * Math.PI;

        let found = false;
        if (
            dist >= innerRadius &&
            dist <= outerRadius &&
            angle >= Math.PI &&
            angle <= 2 * Math.PI &&
            canvas._arcs
        ) {
            for (const arc of canvas._arcs) {
                if (angle >= arc.start && angle <= arc.end) {
                    tooltip.style.display = 'block';
                    tooltip.textContent = `${arc.name}: ${arc.votes} vote${arc.votes === 1 ? '' : 's'}`;
                    tooltip.style.left = (e.pageX + 10) + 'px';
                    tooltip.style.top = (e.pageY - 10) + 'px';
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            tooltip.style.display = 'none';
        }
    });

    canvas.addEventListener('mouseleave', function () {
        tooltip.style.display = 'none';
    });
}

// Event listeners
voteButton.addEventListener('click', sendVote);
voteButton.disabled = true;

document.addEventListener('DOMContentLoaded', function () {
    initColorWheel();
    getVotingResults();
});
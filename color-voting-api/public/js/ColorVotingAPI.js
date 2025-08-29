document.addEventListener("DOMContentLoaded", function () {
    const colors = [
        "#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"
    ];
    const colorNames = [
        "Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"
    ];
    let selectedColorIndex = null;

    const colorWheel = document.getElementById("colorWheel");
    const selectedColor = document.getElementById("selectedColor");
    const colorInfo = document.getElementById("colorInfo");
    const voteButton = document.getElementById("voteButton");
    const loading = document.getElementById("loading");
    const resultsContainer = document.getElementById("resultsContainer");

    // Draw color buttons
    colors.forEach((color, idx) => {
        const btn = document.createElement("button");
        btn.style.background = color;
        btn.style.border = "2px solid #fff";
        btn.style.borderRadius = "50%";
        btn.style.width = "48px";
        btn.style.height = "48px";
        btn.style.margin = "8px";
        btn.style.cursor = "pointer";
        btn.title = colorNames[idx];
        btn.onclick = function () {
            selectedColorIndex = idx;
            selectedColor.textContent = `Selected: ${colorNames[idx]}`;
            colorInfo.textContent = `Hex: ${color}`;
        };
        colorWheel.appendChild(btn);
    });

    voteButton.onclick = function () {
        if (selectedColorIndex === null) {
            alert("Please select a color before voting!");
            return;
        }
        loading.style.display = "block";
        // Simulate API call
        setTimeout(() => {
            loading.style.display = "none";
            alert(`Vote submitted for ${colorNames[selectedColorIndex]}!`);
            fetchResults();
        }, 1000);
    };

    function fetchResults() {
        // Simulate fetching results
        const votes = [12, 8, 15, 9, 14, 7, 10];
        resultsContainer.innerHTML = "";
        colors.forEach((color, idx) => {
            const bar = document.createElement("div");
            bar.style.background = color;
            bar.style.height = "24px";
            bar.style.width = `${votes[idx] * 10}px`;
            bar.style.margin = "6px 0";
            bar.style.borderRadius = "6px";
            bar.textContent = `${colorNames[idx]}: ${votes[idx]} votes`;
            bar.style.color = "#fff";
            bar.style.paddingLeft = "12px";
            resultsContainer.appendChild(bar);
        });
    }

    // Initial fetch
    fetchResults();
});

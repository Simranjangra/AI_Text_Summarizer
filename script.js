const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const summarizeBtn = document.getElementById("summarizeBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const charCount = document.getElementById("charCount");
const summaryCharCount = document.getElementById("summaryCharCount");
const loading = document.getElementById("loading");
const toneButtons = document.querySelectorAll(".tone-btn");

let selectedTone = "simple";

// Character Counter
inputText.addEventListener("input", () => {
    charCount.textContent = `${inputText.value.length} Characters`;
});
// Tone Selection
toneButtons.forEach(button => {

    button.addEventListener("click", () => {

        toneButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        selectedTone = button.dataset.tone;

    });

});

// Summarize Text
summarizeBtn.addEventListener("click", async () => {

    const text = inputText.value.trim();

    if (text === "") {
        alert("Please enter some text.");
        return;
    }

    loading.classList.remove("hidden");
    outputText.value = "";

    try {

        const response = await fetch("http://localhost:5000/summarize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text,
                tone: selectedTone
            })
        });

        const data = await response.json();

        outputText.value = data.summary;

        summaryCharCount.textContent = `${data.summary.length} Characters`;

    } catch (error) {

        console.error(error);

        outputText.value =
            "Unable to connect to the server. Please start the backend.";

    }

    loading.classList.add("hidden");

});

// Copy Summary
copyBtn.addEventListener("click", () => {

    if (outputText.value === "") {
        alert("No summary available.");
        return;
    }

    navigator.clipboard.writeText(outputText.value);

    copyBtn.innerHTML = "✅ Copied!";

    setTimeout(() => {
        copyBtn.innerHTML = "📋 Copy";
    }, 2000);

});

// Clear
clearBtn.addEventListener("click", () => {

    inputText.value = "";
    outputText.value = "";
    charCount.textContent = "0 Characters";
    summaryCharCount.textContent = "0 Characters";

});
let selectedRange = null;
let ranges = [];

const dateInput = document.getElementById("dateRange");
const addButton = document.getElementById("addRange");
const rangesList = document.getElementById("rangesList");
const totalDaysEl = document.getElementById("totalDays");
const eligibilityEl = document.getElementById("eligibility");

// Initialise Flatpickr
flatpickr(dateInput, {
  mode: "range",
  dateFormat: "Y-m-d",
  onChange: function (selectedDates) {
    if (selectedDates.length === 2) {
      selectedRange = {
        start: selectedDates[0],
        end: selectedDates[1]
      };
    }
  }
});

addButton.addEventListener("click", () => {
  if (!selectedRange) {
    alert("Please select a date range first.");
    return;
  }

  ranges.push(selectedRange);
  selectedRange = null;
  dateInput.value = "";

  renderRanges();
  calculateTotals();
});

function renderRanges() {
  rangesList.innerHTML = "";

  ranges.forEach((range, index) => {
    const li = document.createElement("li");

    li.textContent = `${formatDate(range.start)} to ${formatDate(range.end)}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => {
      ranges.splice(index, 1);
      renderRanges();
      calculateTotals();
    };

    li.appendChild(removeBtn);
    rangesList.appendChild(li);
  });
}

function calculateTotals() {
  let totalDays = 0;

  ranges.forEach(range => {
    const days = calculateDaysOutsideUK(range.start, range.end);
    totalDays += days;
  });

  totalDaysEl.textContent = totalDays;

  // VERY basic eligibility example (placeholder logic)
  if (totalDays >= 183) {
    eligibilityEl.textContent = "You may meet the minimum days requirement.";
    eligibilityEl.className = "eligible";
  } else {
    eligibilityEl.textContent = "You may not meet the minimum days requirement.";
    eligibilityEl.className = "not-eligible";
  }
}

function calculateDaysOutsideUK(start, end) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = end - start;
  return Math.floor(diff / msPerDay);
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

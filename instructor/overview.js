// ---------- Data ----------

async function fetchLearners() {
    const response = await fetch('../data.json');

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// ---------- Submission rate ----------

// returns a percentage, or null if the learner has no days yet
export function calculateSubmissionRate(days) {
    if (days.length === 0) {
        return null;
    }

    const submittedDays = days.filter((day) => day.submitted).length;
    return (submittedDays / days.length) * 100;
}

// below 70 is at risk, exactly 70 is not
export function isAtRisk(rate) {
    return rate !== null && rate < 70;
}

function formatRate(rate) {
    if (rate === null) {
        return '0.0%';
    }
    return Number(rate.toFixed(1)) + '%';
}

// ---------- Learner cards ----------

function createCard(learner) {
    const rate = calculateSubmissionRate(learner.days);
    const badge = isAtRisk(rate) ? '<span class="risk-badge">At risk</span>' : '';
    const dayRows = learner.days
        .map((day, index) => `
            <tr>
                <th scope="row">Day ${index + 1}</th>
                <td class="${day.submitted ? 'yes' : 'no'}">${day.submitted ? 'Yes' : 'No'}</td>
                <td class="${day.reviewed ? 'yes' : 'no'}">${day.reviewed ? 'Yes' : 'No'}</td>
            </tr>
        `)
        .join('');

    return `
        <section class="card" aria-labelledby="learner-${learner.id}">
            <h3 id="learner-${learner.id}">${learner.name}</h3>
            <table class="weekly-table">
                <caption>${learner.name} - this week</caption>
                <thead>
                    <tr><th scope="col">Day</th><th scope="col">Submitted</th><th scope="col">Reviewed</th></tr>
                </thead>
                <tbody>${dayRows}</tbody>
            </table>
            <p>Submission rate: ${formatRate(rate)} ${badge}</p>
        </section>
    `;
}

// ---------- Page states ----------

const cardGrid = document.querySelector('.card-grid');

function showLoading() {
    cardGrid.innerHTML = '<p role="status">Loading learners...</p>';
}

function showEmpty() {
    cardGrid.innerHTML = '<p>No learners to show yet.</p>';
}

function showError() {
    cardGrid.innerHTML = `
        <div role="alert">
            <p>Could not load learners.</p>
            <button type="button" id="retry-button">Try again</button>
        </div>
    `;
    document.querySelector('#retry-button').addEventListener('click', loadLearners);
}

function showLearners(learners) {
    cardGrid.innerHTML = learners.map(createCard).join('');
}

// fetch the data, then show whichever state fits
async function loadLearners() {
    showLoading();

    try {
        const learners = await fetchLearners();

        if (learners.length === 0) {
            showEmpty();
            return;
        }

        showLearners(learners);
    } catch (error) {
        console.error('Error fetching learners data:', error);
        showError();
    }
}

// ---------- Registration form ----------

const form = document.querySelector('#learner-form');
const successMessage = document.querySelector('#form-success');

const messages = {
    name: 'Enter a name (letters only, at least 2).',
    phone: 'Enter an 11-digit phone number.',
    cohort: 'Enter a cohort (2 to 20 letters or numbers).'
};

form.addEventListener('submit', (event) => {
    event.preventDefault();
    successMessage.textContent = '';
    let valid = true;

    // check each field and show its own message
    form.querySelectorAll('input').forEach((input) => {
        input.value = input.value.trim();
        const error = document.querySelector(`#${input.id}-error`);

        if (input.checkValidity()) {
            error.textContent = '';
        } else {
            error.textContent = messages[input.id];
            valid = false;
        }
    });

    if (!valid) return;

    successMessage.textContent = 'Learner registered successfully.';
    form.reset();
});

// ---------- Start ----------

loadLearners();
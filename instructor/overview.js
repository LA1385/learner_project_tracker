import { learners } from '../data.js';

export function calculateSubmissionRate(days) {
    if (days.length === 0) {
        return null;
    }

    const submittedDays = days.filter((day) => day.submitted).length;
    return (submittedDays / days.length) * 100;
}

export function isAtRisk(rate) {
    return rate !== null && rate < 70;
}

function formatRate(rate) {
    if (rate === null) {
        return 'N/A';
    }
    return Number(rate.toFixed(1)) + '%';
}

function createRow(label, key, days) {
    const cells = days
        .map((day) => `<td class="${day[key] ? 'yes' : 'no'}">${day[key] ? 'Yes' : 'No'}</td>`)
        .join('');
    return `<tr><th scope="row">${label}</th>${cells}</tr>`;
}

function createCard(learner) {
    const rate = calculateSubmissionRate(learner.days);
    const badge = isAtRisk(rate) ? '<span class="risk-badge">At risk</span>' : '';
    const dayHeadings = learner.days
        .map((_day, index) => `<th scope="col">${index + 1}</th>`)
        .join('');

    return `
        <section class="card" aria-labelledby="learner-${learner.id}">
            <h3 id="learner-${learner.id}">${learner.name}</h3>
            <table>
                <caption>${learner.name} - this week</caption>
                <thead>
                    <tr><th scope="col">Day</th>${dayHeadings}</tr>
                </thead>
                <tbody>
                    ${createRow('Submitted', 'submitted', learner.days)}
                    ${createRow('Reviewed', 'reviewed', learner.days)}
                </tbody>
            </table>
            <p>Submission rate: ${formatRate(rate)} ${badge}</p>
        </section>
    `;
}

const cardGrid = document.querySelector('.card-grid');
cardGrid.innerHTML = learners.map(createCard).join('');
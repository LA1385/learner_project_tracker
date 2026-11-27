import { login } from './login.js';

login();

// Async function that fetches learners data

/* Show all four states for the learner list: loading, empty (test it with an empty array in the file), success and error (test it with a wrong file name), with a "Try again" button on the error. */

function renderLearners(container, learnerList) {
    const entries = learnerList.map((learner) => {
        const entry = document.createElement('li');
        const link = document.createElement('a');
        link.href = 'submission-review.html';
        link.textContent = learner.name;
        entry.appendChild(link);
        return entry;
    });

    entries.forEach((entry) => {
        container.appendChild(entry);
    });
}

const unreviewedSubmissionContainer = document.querySelector('.entry-list-unreviewed');
if (unreviewedSubmissionContainer) {
    renderLearners(unreviewedSubmissionContainer, learners.slice(0, 4));
}

const reviewedSubmissionContainer = document.querySelector('.entry-list-reviewed');
if (reviewedSubmissionContainer) {
    renderLearners(reviewedSubmissionContainer, learners.slice(4, 8));
}



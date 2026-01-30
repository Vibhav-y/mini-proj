const SEARCH_HISTORY_KEY = 'searchHistory';

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function normalizeHistory(rawHistory) {
    if (!Array.isArray(rawHistory)) return [];
    return rawHistory.map(entry => {
        if (typeof entry === 'string') {
            return {
                query: entry,
                timestamp: new Date().toISOString()
            };
        }
        if (entry && typeof entry.query === 'string') {
            return {
                query: entry.query,
                timestamp: entry.timestamp || new Date().toISOString()
            };
        }
        return null;
    }).filter(Boolean);
}

function formatTimestamp(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString();
}

function renderHistory() {
    const listElement = document.getElementById('historyList');
    const emptyMessage = document.getElementById('historyEmptyMessage');

    let history = normalizeHistory(getFromLocalStorage(SEARCH_HISTORY_KEY) || []);

    listElement.innerHTML = '';

    if (!history.length) {
        emptyMessage.style.display = 'block';
        return;
    }

    emptyMessage.style.display = 'none';

    history.forEach(entry => {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.innerHTML = `
            <span class="history-query">${entry.query}</span>
            <span class="history-timestamp">${formatTimestamp(entry.timestamp)}</span>
        `;
        listElement.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const clearBtn = document.getElementById('clearHistoryBtn');

    renderHistory();

    clearBtn.addEventListener('click', () => {
        localStorage.removeItem(SEARCH_HISTORY_KEY);
        renderHistory();
    });
});

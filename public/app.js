const API_URL = '/api/items';

let items = [];
let isSubmitting = false;

// DOM Elements
const form = document.getElementById('add-form');
const input = document.getElementById('item-input');
const list = document.getElementById('items-list');
const emptyState = document.getElementById('empty-state');
const refreshBtn = document.getElementById('refresh-btn');
const clearCheckedBtn = document.getElementById('clear-checked-btn');
const clearAllBtn = document.getElementById('clear-all-btn');

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
  await fetchItems();
  setupEventListeners();
}

function setupEventListeners() {
  form.addEventListener('submit', handleSubmit);
  refreshBtn.addEventListener('click', fetchItems);
  clearCheckedBtn.addEventListener('click', () => clearItems('checked'));
  clearAllBtn.addEventListener('click', () => clearItems('all'));
}

// Fetch items from server
async function fetchItems() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch');
    items = await response.json();
    render();
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Add new item
async function handleSubmit(e) {
  e.preventDefault();
  const text = input.value.trim();
  if (!text || isSubmitting) return;

  isSubmitting = true;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!response.ok) throw new Error('Failed to add item');

    const newItem = await response.json();
    items.push(newItem);
    render();
    input.value = '';
    input.focus();
  } catch (error) {
    console.error('Add error:', error);
  } finally {
    isSubmitting = false;
  }
}

// Toggle item checked state
async function toggleItem(id) {
  // Optimistic update
  const item = items.find(i => i.id === id);
  if (item) {
    item.checked = !item.checked;
    render();
  }

  try {
    const response = await fetch(API_URL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    if (!response.ok) throw new Error('Failed to toggle');
  } catch (error) {
    console.error('Toggle error:', error);
    // Revert on error
    if (item) {
      item.checked = !item.checked;
      render();
    }
  }
}

// Clear items
async function clearItems(mode) {
  if (mode === 'all' && !confirm('Clear all items?')) {
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode })
    });

    if (!response.ok) throw new Error('Failed to clear');

    if (mode === 'checked') {
      items = items.filter(item => !item.checked);
    } else {
      items = [];
    }
    render();
  } catch (error) {
    console.error('Clear error:', error);
  }
}

// Render the list
function render() {
  // Sort: unchecked first (by creation time), then checked (by creation time)
  const sorted = [...items].sort((a, b) => {
    if (a.checked !== b.checked) {
      return a.checked ? 1 : -1;
    }
    return a.createdAt - b.createdAt;
  });

  // Clear and rebuild list
  list.innerHTML = '';

  sorted.forEach(item => {
    const li = document.createElement('li');
    li.className = `item${item.checked ? ' checked' : ''}`;
    li.innerHTML = `
      <label class="checkbox-wrapper">
        <input type="checkbox" ${item.checked ? 'checked' : ''} data-id="${item.id}">
        <span class="checkmark"></span>
      </label>
      <span class="item-text">${escapeHtml(item.text)}</span>
    `;

    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => toggleItem(item.id));

    list.appendChild(li);
  });

  // Update UI state
  const hasItems = items.length > 0;
  const hasChecked = items.some(i => i.checked);

  emptyState.classList.toggle('hidden', hasItems);
  clearCheckedBtn.style.display = hasChecked ? 'block' : 'none';
  clearAllBtn.style.display = hasItems ? 'block' : 'none';
}

// Utility
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

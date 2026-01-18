import { kv } from '@vercel/kv';

const ITEMS_KEY = 'shopping_items';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getItems(req, res);
      case 'POST':
        return await addItem(req, res);
      case 'PATCH':
        return await toggleItem(req, res);
      case 'DELETE':
        return await deleteItems(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getItems(req, res) {
  const items = await kv.get(ITEMS_KEY) || [];
  return res.status(200).json(items);
}

async function addItem(req, res) {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Item text is required' });
  }

  const items = await kv.get(ITEMS_KEY) || [];

  const newItem = {
    id: generateId(),
    text: text.trim(),
    checked: false,
    createdAt: Date.now()
  };

  items.push(newItem);
  await kv.set(ITEMS_KEY, items);

  return res.status(201).json(newItem);
}

async function toggleItem(req, res) {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Item ID is required' });
  }

  const items = await kv.get(ITEMS_KEY) || [];
  const itemIndex = items.findIndex(item => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  items[itemIndex].checked = !items[itemIndex].checked;
  await kv.set(ITEMS_KEY, items);

  return res.status(200).json(items[itemIndex]);
}

async function deleteItems(req, res) {
  const { mode } = req.body || {};

  if (mode === 'checked') {
    // Clear only checked items
    const items = await kv.get(ITEMS_KEY) || [];
    const uncheckedItems = items.filter(item => !item.checked);
    await kv.set(ITEMS_KEY, uncheckedItems);
    return res.status(200).json({ cleared: 'checked' });
  } else {
    // Clear all items
    await kv.set(ITEMS_KEY, []);
    return res.status(200).json({ cleared: 'all' });
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

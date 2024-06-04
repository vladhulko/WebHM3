// 1. Додавання товару
const addItemInput = document.querySelector('input[type="text"]');
const addButton = document.querySelector('.add');

addButton.addEventListener('click', addItem);
addItemInput.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        addItem();
        updateSummary();
    }
});

function addItem() {
    const itemName = addItemInput.value.trim().toLowerCase();
    const existingItemNames = Array.from(document.querySelectorAll('.item-name span')).map(span => span.textContent.toLowerCase());
    if (itemName && !existingItemNames.includes(itemName)) {
        const item = createItem(itemName);
        document.querySelector('.shopping-list').appendChild(item);
        addItemInput.value = '';
        addItemInput.focus();
    }
}

// 2. Налаштування
const initialItems = ['Помідори', 'Печиво', 'Сир'];
initialItems.forEach(itemName => {
    const item = createItem(itemName);
    document.querySelector('.shopping-list').appendChild(item);
});

// 3. Кнопка видалити
document.querySelector('.shopping-list').addEventListener('click', function(e) {
    if (e.target.classList.contains('delete')) {
        e.target.closest('.item').remove();
        updateSummary();
    }
});

// 4. Кнопка відмітити товар як куплений
document.querySelector('.shopping-list').addEventListener('click', function(e) {
    if (e.target.classList.contains('buy')) {
        const item = e.target.closest('.item');
        const deleteButton = item.querySelector('.delete');
        const increaseButton = item.querySelector('.increase');
        const decreaseButton = item.querySelector('.decrease');
        const itemName = item.querySelector('.item-name');

        if (item.classList.contains('bought')) {
            item.classList.remove('bought');
            e.target.textContent = 'Не куплено';
            deleteButton.style.display = 'block';
            increaseButton.style.display = 'block';
            decreaseButton.style.display = 'block';
            itemName.style.textDecoration = 'none';
        } else {
            item.classList.add('bought');
            e.target.textContent = 'Куплено';
            deleteButton.style.display = 'none';
            increaseButton.style.display = 'none';
            decreaseButton.style.display = 'none';
            itemName.style.textDecoration = 'line-through';
        }

        updateSummary();
    }
});

// Редагування назви товару
document.querySelector('.shopping-list').addEventListener('click', function(e) {
    if (e.target.classList.contains('item-name')) {
        const item = e.target.closest('.item');
        if (item.classList.contains('bought')) return; // Якщо товар куплено, не дозволяємо редагування

        const span = e.target;
        const oldName = span.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = oldName;
        input.maxLength = 30; // Обмежуємо кількість символів для введення
        span.textContent = '';
        span.appendChild(input);
        input.focus();

        input.addEventListener('blur', function() {
            const newName = this.value.trim().toLowerCase();
            const existingItemNames = Array.from(document.querySelectorAll('.item-name span')).map(span => span.textContent.toLowerCase());
            if (!existingItemNames.includes(newName)) {
                span.textContent = newName ? newName : oldName;
            } else {
                span.textContent = oldName;
            }
            span.removeChild(this);
            updateSummary();
        });
    }
});

// 6. Редагування кількості товарів
document.querySelector('.shopping-list').addEventListener('click', function(e) {
    const item = e.target.closest('.item');
    if (!item || item.classList.contains('bought')) return;

    const quantitySpan = item.querySelector('.quantity span');
    let quantity = parseInt(quantitySpan.textContent, 10);

    if (e.target.classList.contains('increase')) {
        quantity++;
    } else if (e.target.classList.contains('decrease') && quantity > 1) {
        quantity--;
    }

    quantitySpan.textContent = quantity;
    updateSummary();
});

// 7. Статистика в правій панелі
function updateSummary() {
    const items = Array.from(document.querySelectorAll('.item'));
    const remainingItems = items.filter(item => !item.classList.contains('bought'));
    const boughtItems = items.filter(item => item.classList.contains('bought'));

    const remainingSummary = document.querySelector('.summary .goods:nth-child(2)');
    const boughtSummary = document.querySelector('.summary .goods:nth-child(4)');

    remainingSummary.innerHTML = '';
    boughtSummary.innerHTML = '';

    remainingItems.forEach(item => {
        const itemName = item.querySelector('.item-name span').textContent;
        const quantity = item.querySelector('.quantity span').textContent;
        remainingSummary.innerHTML += `<div><span class="goods-name">${itemName}</span>: <span class="number">${quantity}</span></div>`;
    });

    boughtItems.forEach(item => {
        const itemName = item.querySelector('.item-name span').textContent;
        const quantity = item.querySelector('.quantity span').textContent;
        boughtSummary.innerHTML += `<div><span class="goods-name">${itemName}</span>: <span class="number">${quantity}</span></div>`;
    });
}

boughtItems.forEach(item => {
    const itemName = item.querySelector('.item-name').textContent;
    const quantity = item.querySelector('.quantity span').textContent;
    boughtSummary.innerHTML += `<div><span class="goods-name">${itemName}<span class="number">${quantity}</span></span></div>`;
});

function createItem(itemName) {
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `
        <div class="item-name"><span>${itemName}</span></div>
        <div class="quantity">
            <button class="decrease" data-tooltip="Decrease amounts of item">-</button>
            <span>1</span>
            <button class="increase" data-tooltip="Increase amounts of item">+</button>
        </div>
        <div class="status">
            <button class="buy" data-tooltip="Status of button">Не куплено</button>
            <button class="delete" data-tooltip="Delete item">×</button>
        </div>
    `;
    return item;
}

const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const formBtn = itemForm.querySelector('button')
const itemFilter = document.getElementById('filter')
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemsFromStorage()
    itemsFromStorage.forEach((item) => addItemToDOM(item))
    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    if (itemInput.value == '') {
        alert('please add an item')
        return;
    }

    //check for edit mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelectorAll('.edit-mode')

        removeItemFromStorage(itemToEdit.textContent)
        itemToEdit.classList.remove();
        isEditMode.remove();
        isEditMode = false

    }
    else {
        if (checkIfItemExist(newItem)) {
            alert('item already exitst')
            return;
        }
    }
    // create item domm element
    addItemToDOM(newItem)

    //add item to localstorage
    addItemToStorage(newItem)
    checkUI();

    itemInput.value = '';
}


function addItemToDOM(item) {
    //create  list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item))

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);


    //add li to the dom
    itemList.appendChild(li);
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}


function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;

}



function addItemToStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    //add new item to array
    itemsFromStorage.push(item)

    //convert to jason string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}


function getItemsFromStorage() {
    let itemsFromStorage

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = []

    }
    else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));

    }
    return itemsFromStorage
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement)
    }
    else {
        setItemToEdit(e.target)
    }
}

function checkIfItemExist(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item)
}


function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'))

    item.classList.add('edit-mode')
    formBtn.innerHTML = '<i class = "fa-solid fa-pen"></i> update item';
    formBtn.style.backgroundColor = '#228B22'
    itemInput.value = item.textContent
}


function removeItem(item) {

    if (confirm('Are you sure?')) {

        //reomve item form dom
        item.remove();

        //remove item fromm storage
        removeItemFromStorage(item.textContent)

        checkUI();
    }

}
function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage = itemsFromStorage.filter((i) => i !== item)

    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}




function clearItem(e) {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild)
    }

    //clear from local storage
    localStorage.removeItem('items')

    checkUI();
}

function filterItems(e) {
    const items = itemList.querySelectorAll('li')
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        // console.log(item)
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex'

        }
        else {
            item.style.display = 'none';
        }
    })

}


function checkUI() {
    itemInput.value = '';
    const items = itemList.querySelectorAll('li');

    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';

    }
    else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }
    formBtn.innerHTML = '<i class = "fa-solid fa-plus"</i> Add Item';
    formBtn.style.backgroundColor = '#333'

    isEditMode = false;

}



itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItem);
itemFilter.addEventListener('input', filterItems)
document.addEventListener('DOMContentLoaded', displayItems)



checkUI();
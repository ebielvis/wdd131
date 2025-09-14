// Get references to input, button, and list
const input = document.querySelector('#favchap');
const button = document.querySelector('button');
const list = document.querySelector('#list');

// Add click event listener to button
button.addEventListener('click', () => {
  if (input.value.trim() !== '') {
    // Create list item
    const li = document.createElement('li');
    li.textContent = input.value;

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '❌';
    deleteButton.setAttribute('aria-label', `Remove ${input.value}`);

    // Append delete button to li
    li.append(deleteButton);

    // Append li to list
    list.append(li);

    // Clear input
    input.value = '';
    input.focus();

    // Add delete functionality
    deleteButton.addEventListener('click', () => {
      list.removeChild(li);
    });
  }
});

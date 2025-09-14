// Select DOM elements
const input = document.querySelector('#favchap');
const button = document.querySelector('button');
const list = document.querySelector('#list');

// Add event listener for Add Chapter button
button.addEventListener('click', function () {
  // Ensure input is not empty
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

    // Append li to ul
    list.append(li);

    // Add delete functionality
    deleteButton.addEventListener('click', function () {
      list.removeChild(li);
      input.focus(); // return cursor to input
    });

    // Clear input for next entry
    input.value = '';
  }

  // Always refocus input
  input.focus();
});

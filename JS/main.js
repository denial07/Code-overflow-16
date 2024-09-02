window.onload = function() {
    function addTask() {
        var inputBox = document.getElementById("expense-input-box");
        var listContainer = document.getElementById("expense-container");

        if (inputBox.value === '') {
            alert("You must write something!!!");
        } else {
            let li = document.createElement("li");
            li.innerHTML = inputBox.value;
            listContainer.appendChild(li);

            let span = document.createElement("span");
            span.innerHTML = "\u00d7";
            span.classList.add("close");
            li.appendChild(span); // Corrected line
        }

        inputBox.value = ''; // Clear the input box after adding the task
    }

    document.getElementById("add-task").addEventListener("click", addTask);

    document.getElementById("todo-list-container").addEventListener("click", function(e) {
        if (e.target.tagName === "LI") {
            e.target.classList.toggle("checked");
        } 
        else if (e.target.tagName === "SPAN") {
            e.target.parentElement.remove();
        }
    }, false);
};
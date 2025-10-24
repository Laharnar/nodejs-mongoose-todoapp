
document.addEventListener('DOMContentLoaded', function(){

    const container = document.createElement("div")
    var buttonAdd = document.createElement("button");
    buttonAdd.textContent = "+";  // Add text/icon
    buttonAdd.style.cssText = "height: 20px; width:200px; padding:0px; background-color: green;\n" +
        "  border: none;\n" +
        "  color: white;"
    buttonAdd.onclick = async () => {
        const api = `/api/todos`
        const request = await fetch(api,{
            method:"POST",
            headers: {
                // 2. Crucial: Tell Express you are sending JSON
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                todoText: "",
            })
        })
        if(!request.ok){
            throw new Error("addition failed")
        }
        const newItem = await request.json();
        drawTodo(container, newItem)
    }
    container.appendChild(buttonAdd)
    loadTodos(container)

    document.body.appendChild(container)
}, false);

async function loadTodos(container){
    try {
        const response = await fetch("/api/todos")
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const todos = await response.json();
        if(todos == null)
            console.log("failed to load, null")
        todos.forEach(todo => drawTodo(container, todo))
    }catch (error) {
        console.error("Failed to load todos:", error);
    }
}

function drawTodo(container, todo) {
    const group = document.createElement('div');
    group.style.cssText = "border-radius: 10px; background-color: #73AD21; padding: 10px; width: 200px;height: 120px; margin: 2px"

    // draw text
    const text = document.createElement('div')
    text.style.cssText = "border-radius: 5px; background-color: #FFFFFF; padding: 10px; width: 100px;" +
        "height: 60px; width:75%; float:left; overflow: hidden;"
    text.innerText = `${todo.todoText}`
    text.addEventListener("click", function () {
        editText(`${todo.todoText}`, text, todo._id)
    })
    group.appendChild(text)


    const sidePanel = document.createElement('div');
    sidePanel.style.cssText = `
            display: flex;
            flex-direction: column;  /* ← VERTICAL */
            align-items: center;    /* ← Center horizontally */
            border-radius: 8px;
        `;

    var buttonRemove = document.createElement("button");
    buttonRemove.textContent = "X";  // Add text/icon
    buttonRemove.style.cssText = "height: 20px; width:20px; padding:0px; background-color: red;\n" +
        "  border: none;\n" +
        "  color: white;"
    buttonRemove.onclick = async () => {
        const api = `/api/todos/${todo._id}`
        const request = await fetch(api,{
            method:"DELETE"
        })
        if(!request.ok){
            throw new Error("delete failed")
        }
        console.log("deleted succesful")
        container.removeChild(group)
    }
    sidePanel.appendChild(buttonRemove)


    var checkboxDone = document.createElement("input");
    checkboxDone.type = "checkbox"
    checkboxDone.style.cssText = "height: 20px; width:20px; margin-top:40px;"
    checkboxDone.addEventListener('change', async () => {
        itemId = todo._id
        const apiUrl = `/api/todos/${itemId}/isDone`;
        const response = await fetch(apiUrl, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json' // 2. Tell the server we are sending JSON
            },
            body: JSON.stringify({ // 3. Send the data as a JSON string
                isDone: checkboxDone.checked
            })
        })
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(`Successfully patched item ${itemId}.`);
    })
    checkboxDone.checked = todo.isDone

    sidePanel.appendChild(checkboxDone)

    group.appendChild(sidePanel)

    container.appendChild(group);
}

function editText(startText, editedReturn, id){
    console.log("edit test")

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:1000;';
    document.body.appendChild(overlay)


    const form = document.createElement('form');
    form.style.cssText = 'background:white;width:90%;max-width:350px;padding:25px;border-radius:10px;display:flex;flex-direction:column;gap:15px;';
    form.innerHTML = `
                <textarea class="textEditing" style="height:200px"></textarea>
                <div style="display:flex;gap:10px;justify-content:flex-end;">
                    <button type="button" class="cancel-btn" style="padding:10px 20px;border:1px solid #ddd;background:white;border-radius:6px;cursor:pointer;">Cancel</button>
                    <button type="submit" class="save-btn" style="padding:10px 20px;background:#007bff;color:white;border:none;border-radius:6px;cursor:pointer;">Save</button>
                </div>
            `;
    const textEditing = form.querySelector('.textEditing');
    textEditing.value = startText

    form.querySelector('button[type="button"]').onclick = () => overlay.remove();
    overlay.appendChild(form)

    const saveBtn = form.querySelector('.save-btn');

    //overlay.onclick = (e) => e.target === overlay && overlay.remove();


    // ✅ SAVE BUTTON - Direct click (backup)
    saveBtn.onclick = async function(e) {
        itemId = id
        const apiUrl = `/api/todos/${itemId}/text`;
        const response = await fetch(apiUrl, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json' // 2. Tell the server we are sending JSON
            },
            body: JSON.stringify({ // 3. Send the data as a JSON string
                todoText: textEditing.value
            })
        })
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(`Successfully patched item ${itemId}.`);
        editedReturn.textContent=textEditing.value
        e.preventDefault();
        e.stopPropagation();
        console.log('✅ SAVE BUTTON CLICKED:', textEditing.value);
        overlay.remove();
    };
    form.querySelector('input').focus();
}


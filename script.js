let balance = 0;
let saved = 0;
let spent = 0;

let goal = {
    name: "",
    amount: 0
};

let transactions = JSON.parse(localStorage.getItem("vault")) || [];

/* INIT */
window.onload = () => {
    render();
};

/* ADD TRANSACTION */
function addTransaction(){

    const desc = document.getElementById("desc").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;

    if(!desc || !amount) return;

    const data = {
        id: Date.now(),
        desc,
        amount,
        type
    };

    transactions.push(data);

    localStorage.setItem("vault", JSON.stringify(transactions));

    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";

    render();
}

/* SET GOAL */
function setGoal(){

    const name = document.getElementById("goalName").value;
    const amount = parseFloat(document.getElementById("goalAmount").value);

    if(!name || !amount) return;

    goal.name = name;
    goal.amount = amount;

    render();
}

/* DELETE */
function remove(id){
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem("vault", JSON.stringify(transactions));
    render();
}

/* RENDER */
function render(){

    balance = 0;
    saved = 0;
    spent = 0;

    const list = document.getElementById("list");
    list.innerHTML = "";

    transactions.forEach(t => {

        if(t.type === "save"){
            saved += t.amount;
            balance += t.amount;
        } else {
            spent += t.amount;
            balance -= t.amount;
        }

        const div = document.createElement("div");
        div.classList.add("item");

        div.innerHTML = `
            <span>${t.desc}</span>
            <span class="${t.type}">
                ${t.type === "save" ? "+" : "-"} ₹${t.amount}
            </span>
            <button onclick="remove(${t.id})">X</button>
        `;

        list.appendChild(div);
    });

    /* UPDATE UI */
    document.getElementById("balance").innerText = "₹" + balance;
    document.getElementById("saved").innerText = "₹" + saved;
    document.getElementById("spent").innerText = "₹" + spent;

    /* GOAL UPDATE */
    if(goal.amount > 0){
        document.getElementById("goalText").innerText =
        `${goal.name} - ₹${saved}/₹${goal.amount}`;

        let percent = (saved / goal.amount) * 100;
        if(percent > 100) percent = 100;

        document.getElementById("progressText").innerText =
        Math.floor(percent) + "%";

        document.querySelector(".progress-circle").style.background =
        `conic-gradient(#00e5ff ${percent}%, #222 ${percent}%)`;
    }
}
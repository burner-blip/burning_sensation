const url = "http://localhost:3000";

async function register(){

    await fetch(url+"/register",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            name:document.getElementById("name").value,
            email:document.getElementById("email").value,
            phone:document.getElementById("phone").value,
            password:document.getElementById("password").value
        })
    });

    alert("Registered");
}


async function login(){

    const res = await fetch(url + "/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            email:document.getElementById("email").value,
            password:document.getElementById("password").value
        })
    });

    const data = await res.json();

    console.log(data); 

    if(data.status === "success"){

        localStorage.setItem("user", data.user.id);

        window.location.href = "complaint.html";

    }else{

        alert("Login Failed");

    }

}

async function submitComplaint(){

    await fetch(url+"/complaint",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            user_id:localStorage.getItem("user"),
            title:document.getElementById("title").value,
            category:document.getElementById("category").value,
            priority:document.getElementById("priority").value,
            description:document.getElementById("description").value
        })
    });

    alert("Complaint Submitted");
}

async function loadComplaints(){

    const res = await fetch("http://localhost:3000/complaints");

    const data = await res.json();

    let html = "";

    data.forEach(c => {

        html += `
        <div class="complaint">

        <p><b>ID:</b> ${c.complaint_id}</p>
        <p><b>Title:</b> ${c.title}</p>
        <p><b>Category:</b> ${c.category}</p>
        <p><b>Priority:</b> ${c.priority}</p>
        <p><b>Status:</b> ${c.status}</p>

        <select id="status-${c.complaint_id}">
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
        </select>

        <br>

        <button onclick="updateStatus(${c.complaint_id})">
        Update Status
        </button>

        </div>
        `;

    });

    document.getElementById("list").innerHTML = html;
}


async function updateStatus(id){

    const status = document.getElementById("status-" + id).value;

    await fetch("http://localhost:3000/complaint/status",{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            complaint_id:id,
            status:status
        })
    });

    alert("Status Updated");

    loadComplaints();
}
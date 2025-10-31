// // Async function to fetch and display data
// async function fetchData() {
//   try {

//     // Step 1: Fetch the data from your API
//     // const response = await fetch("http://127.0.0.1:8000/get-student-details");
//     const response = await fetch("http://127.0.0.1:8001/students");

//     // Step 2: Check if the response is OK (status 200–299)
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     // Step 3: Parse the response body as JSON
//     const data = await response.json();

//     // Step 4: Display the data in the console (or on your page)
//     console.log("Fetched data:", data);
//     document.getElementById("output").textContent = JSON.stringify(data, null, 2);
//   } catch (error) {
//     // Step 5: Handle any errors that occur
//     console.error("Error fetching data:", error);
//     document.getElementById("output").textContent = "❌ Failed to fetch data.";
//   }
// }

// // Call the function
// fetchData();






async function fetchStudents() {
  try {
    // 1️⃣ Fetch data from your API
    // const response = await fetch("http://127.0.0.1:8000/get-student-details");
    const response = await fetch("http://127.0.0.1:8001/students");

    // 2️⃣ Check if response is okay
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // 3️⃣ Parse response into JSON
    const students = await response.json();

    // 4️⃣ Select the container where we’ll show data
    const container = document.getElementById("output");
    container.innerHTML = ""; // clear previous content

    // 5️⃣ Loop through each student and display nicely
    students.forEach(student => {
      const div = document.createElement("div");
      div.innerHTML = `<strong>${student.name}</strong> — ${student.track}`;
      container.appendChild(div);
    });

  } catch (error) {
    // 6️⃣ Handle any errors that happen
    console.error("Error fetching students:", error);
    document.getElementById("students").textContent = "❌ Failed to load students.";
  }
}

// Call function when page loads
fetchStudents();


const form = document.getElementById("studentForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent form reload

  const name = document.getElementById("name").value.trim();
  const track = document.getElementById("track").value.trim();

  try {
    const response = await fetch("http://127.0.0.1:8001/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, track }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    message.textContent = result.message;
    form.reset();

    // Refresh student list to show the new one
    fetchStudents();

  } catch (error) {
    console.error("Error adding student:", error);
    message.textContent = "❌ Failed to add student.";
  }
});




const deleteForm = document.getElementById("deleteForm");
const deleteMessage = document.getElementById("deleteMessage");

deleteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const studentId = document.getElementById("deleteId").value;

  try {
    const response = await fetch(`http://127.0.0.1:8001/students/${studentId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    deleteMessage.textContent = result.message;
    deleteForm.reset();

    // Refresh list to reflect deletion
    fetchStudents();

  } catch (error) {
    console.error("Error deleting student:", error);
    deleteMessage.textContent = "❌ Failed to delete student.";
  }
});


const editBtn = document.getElementById("editBtn");
editBtn.addEventListener("click", async () => {
  const studentId = document.getElementById("deleteId").value.trim();
  const name = document.getElementById("name").value.trim();
  const track = document.getElementById("track").value.trim();

  if (!studentId || !name || !track) {
    alert("Please provide ID, name, and track to edit a student.");
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:8001/students/${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, track }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    alert(result.message);

    // Refresh student list to reflect changes
    fetchStudents();

  } catch (error) {
    console.error("Error editing student:", error);
    alert("❌ Failed to edit student.");
  }
});
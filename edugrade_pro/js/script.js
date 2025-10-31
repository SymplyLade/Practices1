// Demo users
const users = {
  teacher: { username: "teacher", password: "1234" },
  student: { username: "student", password: "1234" }
};
// Handle Login
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;
  if (users[role] && users[role].username === username && users[role].password === password) {
    localStorage.setItem("loggedInUser", role);
    window.location.href = role === "teacher" ? "teacher-dashboard.html" : "student-dashboard.html";
  } else {
    alert("Invalid credentials!");
  }
});
// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});
// Students Data
let students = JSON.parse(localStorage.getItem("students")) || [
  { name: "Jane Doe", class: "ND1", grade: "A" },
  { name: "John Smith", class: "ND2", grade: "B" }
];
// =============================
// TEACHER DASHBOARD FUNCTIONS
// =============================
const studentTable = document.getElementById("studentTable");
const modal = document.getElementById("studentModal");
const modalTitle = document.getElementById("modalTitle");
const studentForm = document.getElementById("studentForm");
let editIndex = null;
// Render Students
function renderStudents() {
  if (!studentTable) return;
  studentTable.innerHTML = students.map((s, i) => `
    <tr>
      <td>${s.name}</td>
      <td>${s.class}</td>
      <td>${s.grade}</td>
      <td>
        <button onclick="editStudent(${i})">Edit</button>
        <button onclick="deleteStudent(${i})">Delete</button>
      </td>
    </tr>
  `).join("");
  localStorage.setItem("students", JSON.stringify(students));
  document.getElementById("totalStudents").textContent = students.length;
}
renderStudents();
// Add Student Button
document.getElementById("addStudentBtn")?.addEventListener("click", () => {
  modal.style.display = "flex";
  modalTitle.textContent = "Add Student";
  studentForm.reset();
  editIndex = null;
});
// Close Modal
document.getElementById("closeModal")?.addEventListener("click", () => {
  modal.style.display = "none";
});
// Submit Form (Add or Edit)
studentForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("studentName").value;
  const cls = document.getElementById("studentClass").value;
  const grade = document.getElementById("studentGrade").value;
  if (editIndex === null) {
    students.push({ name, class: cls, grade });
  } else {
    students[editIndex] = { name, class: cls, grade };
  }
  localStorage.setItem("students", JSON.stringify(students));
  modal.style.display = "none";
  renderStudents();
});
// Edit Function
window.editStudent = (index) => {
  editIndex = index;
  modal.style.display = "flex";
  modalTitle.textContent = "Edit Student";
  const s = students[index];
  document.getElementById("studentName").value = s.name;
  document.getElementById("studentClass").value = s.class;
  document.getElementById("studentGrade").value = s.grade;
};
// Delete Function
window.deleteStudent = (index) => {
  if (confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    renderStudents();
  }
};
// =============================
// STUDENT DASHBOARD
// =============================
if (document.getElementById("gradesTable")) {
  const tbody = document.getElementById("gradesTable");
  tbody.innerHTML = students.map(s => `
    <tr>
      <td>${s.class}</td>
      <td>${s.grade}</td>
      <td>${s.grade === "A" ? "Excellent" : "Good"}</td>
    </tr>
  `).join("");
  document.getElementById("coursesEnrolled").textContent = students.length;
  document.getElementById("overallGrade").textContent = calculateAverage();
}
// Calculate Average
function calculateAverage() {
  if (students.length === 0) return "-";
  const gradePoints = { A: 5, B: 4, C: 3, D: 2, F: 0 };
  const avg =
    students.reduce((sum, s) => sum + (gradePoints[s.grade] || 0), 0) / students.length;
  return avg.toFixed(2);
}
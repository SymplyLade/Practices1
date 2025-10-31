from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI()

# Allow frontend (JS) to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hardcoded data
students = [
    {"id": 1, "name": "Sam Larry", "track": "AI Developer"},
    {"id": 2, "name": "Mary Obi", "track": "Frontend Developer"},
    {"id": 3, "name": "John Doe", "track": "Data Analyst"},
]

# Create a Pydantic model for validation
class Student(BaseModel):
    name: str
    track: str

@app.get("/")
def home():
    return {"message": "Welcome to FastAPI demo"}

# GET route
@app.get("/students")
def get_students():
    return students


@app.get("/students/{student_id}")
def get_student(student_id: int):
    for s in students:
        if s["id"] == student_id:
            return s
    return {"Error": "Student not found"}

# POST route
@app.post("/students")
def add_student(student: Student):
    new_id = len(students) + 1
    new_student = {"id": new_id, "name": student.name, "track": student.track}
    students.append(new_student)
    return {"message": "Student added successfully!", "student": new_student}


# DELETE route
@app.delete("/students/{student_id}")
def delete_student(student_id: int):
    for s in students:
        if s["id"] == student_id:
            students.remove(s)
            return {"message": f"Student with ID {student_id} deleted successfully"}
    raise HTTPException(status_code=404, detail="Student not found")


# PUT route — edit student by ID
@app.put("/students/{student_id}")
def update_student(student_id: int, updated_student: Student):
    for s in students:
        if s["id"] == student_id:
            s["name"] = updated_student.name
            s["track"] = updated_student.track
            return {"message": f"Student with ID {student_id} updated successfully", "student": s}
    raise HTTPException(status_code=404, detail="Student not found")


# Patch Route
@app.patch("/students/{student_id}")
def patch_student(student_id: int, updated_fields: dict):
    for s in students:
        if s["id"] == student_id:
            # Update only the fields that exist in the request
            s.update(updated_fields)
            return {"message": f"Student with ID {student_id} updated successfully (partial)", "student": s}
    raise HTTPException(status_code=404, detail="Student not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host=os.getenv("HOST"), port=int(os.getenv("PORT")))
    
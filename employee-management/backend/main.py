from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator, validator
from typing import List, Optional
from bson import ObjectId
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Initialize FastAPI
app = FastAPI()

# Load environment variables from .env
load_dotenv()

# Retrieve MongoDB URI from .env
MONGODB_URI = os.getenv("MONGODB_URI")

# MongoDB Client Setup
client = AsyncIOMotorClient(MONGODB_URI)
db = client["employee_management"]
collection = db["employees"]

# CORS Middleware to allow React app to access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from React frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Pydantic Model for Employee Data with Age Validation
class Employee(BaseModel):
    name: str
    age: int
    department: str

    @validator('age')
    def validate_age(cls, age: int) -> int:
        if age < 16:
            raise ValueError('Employee must be at least 16 years old')
        if age > 100:
            raise ValueError('Age cannot be more than 100 years old')
        return age


class EmployeeInResponse(Employee):
    id: str

    class Config:
        orm_mode = True


# Utility function to convert ObjectId to string
def employee_helper(employee) -> dict:
    return {
        "id": str(employee["_id"]),
        "name": employee["name"],
        "age": employee["age"],
        "department": employee["department"]
    }


# Add a new employee
@app.post("/employees/addemployees/{employee_id}", response_model=EmployeeInResponse)
async def create_employee(employee_id: str, employee: Employee):
    existing_employee = await collection.find_one({"name": employee.name})
    if existing_employee:
        raise HTTPException(status_code=400, detail="Employee already exists.")

    result = await collection.insert_one(employee.dict())
    created_employee = await collection.find_one({"_id": result.inserted_id})
    return employee_helper(created_employee)


# Get all employees (with optional query parameters)
@app.get("/employees/", response_model=List[EmployeeInResponse])
async def get_employees(name: Optional[str] = None, department: Optional[str] = None):
    query = {}
    if name:
        query["name"] = name
    if department:
        query["department"] = department

    employees = await collection.find(query).to_list(1000)
    return [employee_helper(employee) for employee in employees]


# Update an employee's information
@app.put("/employees/updateemployees/{employee_id}", response_model=EmployeeInResponse)
async def update_employee(employee_id: str, employee: Employee):
    # Validate ObjectId format
    if not ObjectId.is_valid(employee_id):
        raise HTTPException(status_code=400, detail="Invalid employee ID format")

    updated_employee = await collection.find_one_and_update(
        {"_id": ObjectId(employee_id)},
        {"$set": employee.dict()},
        return_document=True
    )

    if updated_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")

    return employee_helper(updated_employee)


# Delete an employee's record
@app.delete("/employees/deleteemployees/{employee_id}")
async def delete_employee(employee_id: str):
    # Validate ObjectId format
    if not ObjectId.is_valid(employee_id):
        raise HTTPException(status_code=400, detail="Invalid employee ID format")

    deleted_employee = await collection.find_one_and_delete({"_id": ObjectId(employee_id)})

    if deleted_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")

    return {"message": "Employee deleted successfully"}

# Employee Management API

This is a **FastAPI**-based **Employee Management API** that interacts with **MongoDB** for storing employee records. The API allows CRUD operations, including adding, retrieving, updating, and deleting employees.

## Features
- **FastAPI** for backend API
- **MongoDB** for database storage
- **Asynchronous** database queries with `motor`
- **CORS Middleware** enabled for frontend integration
- **Pydantic** for data validation
- **Employee age validation** (must be between 16 and 100)

## Technologies Used
- **FastAPI** (Python)
- **MongoDB** (NoSQL Database)
- **Pydantic** (Data validation)
- **Motor** (Async MongoDB client)
- **CORS Middleware** (For frontend interaction)

---

## Installation & Setup

### 1. Clone the Repository
```sh
git clone https://github.com/your-username/employee-management.git
cd employee-management
```

### 2. Create a Virtual Environment
```sh
python -m venv venv
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate  # On Windows
```

### 3. Install Dependencies
```sh
pip install -r requirements.txt
```

### 4. Configure MongoDB
Update the **MongoDB connection string** in the code (`client = AsyncIOMotorClient(...)`). Ensure your database is correctly set up.

### 5. Run the API Server
```sh
uvicorn main:app --reload
```
The API will be available at: **`http://127.0.0.1:8000`**

---

## API Endpoints

### **1. Add a New Employee**
```http
POST /employees/addemployees/{employee_id}
```
**Request Body:**
```json
{
  "name": "John Doe",
  "age": 30,
  "department": "Engineering"
}
```
**Response:**
```json
{
  "id": "65a1b2c3d4e5f67890123456",
  "name": "John Doe",
  "age": 30,
  "department": "Engineering"
}
```

### **2. Get All Employees (Optional Filters: name, department)**
```http
GET /employees/?name=John&department=Engineering
```
**Response:**
```json
[
  {
    "id": "65a1b2c3d4e5f67890123456",
    "name": "John Doe",
    "age": 30,
    "department": "Engineering"
  }
]
```

### **3. Update an Employee Record**
```http
PUT /employees/updateemployees/{employee_id}
```
**Request Body:**
```json
{
  "name": "John Doe",
  "age": 35,
  "department": "HR"
}
```
**Response:**
```json
{
  "id": "65a1b2c3d4e5f67890123456",
  "name": "John Doe",
  "age": 35,
  "department": "HR"
}
```

### **4. Delete an Employee Record**
```http
DELETE /employees/deleteemployees/{employee_id}
```
**Response:**
```json
{
  "message": "Employee deleted successfully"
}
```

---

## Frontend Integration
Ensure the **CORS policy** allows your frontend (e.g., `http://localhost:3000`).

Example frontend request using **Fetch API**:
```js
fetch("http://127.0.0.1:8000/employees/")
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## Contributing
Feel free to contribute! Fork the repo, make changes, and submit a PR.

---

## License
NO License


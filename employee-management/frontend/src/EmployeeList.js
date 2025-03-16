import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({
    id: null,
    name: '',
    age: '',
    department: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios.get('http://localhost:8000/employees/')
      .then(response => setEmployees(response.data))
      .catch(() => toast.error('Failed to fetch employees!'));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/employees/deleteemployees/${id}`)
      .then(() => {
        setEmployees(employees.filter(emp => emp.id !== id));
        toast.success('Employee deleted successfully!');
      })
      .catch(() => toast.error('Failed to delete employee!'));
  };

  const handleUpdate = (employee) => {
    setIsEditing(true);
    setCurrentEmployee({ ...employee });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id, name, age, department } = currentEmployee;
    const ageNumber = parseInt(age, 10);

    if (isNaN(ageNumber) || ageNumber < 16 || ageNumber > 100) {
      toast.error('Age must be between 16 and 100.');
      return;
    }

    const apiCall = id ? axios.put(`http://localhost:8000/employees/updateemployees/${id}`, { name, age: ageNumber, department }) : axios.post(`http://localhost:8000/employees/addemployees/${id}`, { name, age: ageNumber, department });

    apiCall
      .then(() => {
        fetchEmployees();
        setIsEditing(false);
        toast.success(`Employee ${id ? 'updated' : 'added'} successfully!`);
      })
      .catch(err => toast.error(err.response?.data?.detail || 'Operation failed!'));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmployee(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="employee-list-container">
      <h2 className="employee-list-heading">Employee List</h2>

      <div className="employee-cards-container">
        {employees.map(emp => (
          <div key={emp.id} className="employee-card">
            <h3>{emp.name}</h3>
            <p>ID: {emp.id}</p> {/* Displaying the employee ID */}
            <p>Age: {emp.age}</p>
            <p>Department: {emp.department}</p>
            <div className="employee-card-actions">
              <button className="btn-update" onClick={() => handleUpdate(emp)}>Update</button>
              <button className="btn-delete" onClick={() => handleDelete(emp.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <h3>{currentEmployee.id ? 'Update Employee' : 'Add Employee'}</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" value={currentEmployee.name} onChange={handleChange} placeholder="Name" required />
              <input type="number" name="age" value={currentEmployee.age} onChange={handleChange} placeholder="Age" required min="16" max="100" />
              <input type="text" name="department" value={currentEmployee.department} onChange={handleChange} placeholder="Department" required />
              <div className="modal-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default EmployeeList;

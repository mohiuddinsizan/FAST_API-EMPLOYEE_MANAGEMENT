import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EmployeeForm.css';

const EmployeeForm = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const employeeId = Math.random().toString(36).substring(2, 15); // Random employee ID for demo purposes
      const response = await axios.post(`http://localhost:8000/employees/addemployees/${employeeId}`, {
        name,
        age: parseInt(age),
        department
      });
      setName('');
      setAge('');
      setDepartment('');
      toast.success('Employee added successfully');
    } catch (error) {
      toast.error('There was an error adding the employee');
      console.error('There was an error adding the employee!', error);
    }
  };

  return (
    <div className="employee-form-container">
      <h2 className="form-heading">Add New Employee</h2>
      <form className="employee-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          required
          min="16"
          max="100"
        />
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="Department"
          required
        />
        <button type="submit" className="submit-button">Add Employee</button>
      </form>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default EmployeeForm;

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

import Header from './Header';
import Table from './Table';
import Add from './Add';
import Edit from './Edit';

const Dashboard = ({ setIsAuthenticated }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const API_URL = 'https://68db332b23ebc87faa323c66.mockapi.io/employeesData';

  const fetchEmployees = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = id => {
    const [employee] = employees.filter(employee => employee.id === id);
    setSelectedEmployee(employee);
    setIsEditing(true);
  };

  // ✨ Edit 컴포넌트에서 사용할 handleUpdate 함수를 추가합니다.
  const handleUpdate = (updatedEmployee) => {
    fetch(`${API_URL}/${updatedEmployee.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEmployee),
    })
      .then(res => {
        if (res.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: `${updatedEmployee.firstName} ${updatedEmployee.lastName}'s data has been updated.`,
            showConfirmButton: false,
            timer: 1500,
          });
          fetchEmployees();
        } else {
           throw new Error('Update failed on server.');
        }
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: '데이터 수정 중 오류가 발생했습니다.',
          showConfirmButton: true,
        });
        console.error('Error updating data:', error);
      });
      
    setIsEditing(false);
  };


  const handleDelete = id => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(result => {
      if (result.value) {
        fetch(`${API_URL}/${id}`, { method: 'DELETE' })
          .then(res => {
            if (res.ok) {
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: '데이터가 성공적으로 삭제되었습니다.',
                showConfirmButton: false,
                timer: 1500,
              });
              fetchEmployees();
            } else {
              throw new Error('Deletion failed on server.');
            }
          })
          .catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: '데이터 삭제 중 오류가 발생했습니다.',
              showConfirmButton: true,
            });
            console.error('Error deleting data:', error);
          });
      }
    });
  };

  return (
    <div className="container">
      {!isAdding && !isEditing && (
        <>
          <Header
            setIsAdding={setIsAdding}
            setIsAuthenticated={setIsAuthenticated}
          />
          <Table
            employees={employees}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </>
      )}
      {isAdding && (
        <Add
          employees={employees}
          setEmployees={setEmployees}
          setIsAdding={setIsAdding}
          fetchEmployees={fetchEmployees} // Add 컴포넌트에도 fetchEmployees를 전달
        />
      )}
      {isEditing && (
        <Edit
          selectedEmployee={selectedEmployee}
          handleUpdate={handleUpdate} // ✨ handleUpdate 함수를 prop으로 전달
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default Dashboard;
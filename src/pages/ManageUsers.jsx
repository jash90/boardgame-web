import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import axios from '../api/axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('users');
        setUsers(response.data.users);
      } catch (error) {
        console.error(error);
      }
    };

    if (currentUser?.role === 'admin') {
      fetchUsers();
    }
  }, [currentUser?.role]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`users/${userId}`, { role: newRole });
      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
    } catch (error) {
      console.error(error);
    }
  };

  if (currentUser?.role !== 'admin') {
    return <p>You are not authorized to view this page.</p>;
  }

  return (
    <>
      <h2>Manage Users</h2>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button
                  variant='contained'
                  style={{ width: "200px" }}
                  color={user.role === 'admin'? 'primary': 'secondary'}
                  onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'mod' : 'admin')}>
                  {user.role === 'admin' ? 'Demote to Mod' : 'Promote to Admin'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
};

export default ManageUsers;

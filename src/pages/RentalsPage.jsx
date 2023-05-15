import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import axios from '../api/axios';

function RentalsPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [gameName, setGameName] = useState('');


  useEffect(() => {

    fetchRentals();
  }, [gameId]);

  const fetchRentals = async () => {
    try {
      const response = await axios.get(`rentals/${gameId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRentals(response.data.rentals);

      if (response.data.length > 0) {
        setGameName(response.data.boardGameName);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleClearRatings = async () => {
    try {
      await axios.delete(`rentals/${gameId}/clearRatings`);
      fetchRentals();
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <Button variant='contained'
              color='primary' onClick={handleBackClick}>Go Back</Button>

      {currentUser?.role === 'admin' && (
        <>
      <Button variant="contained" color="secondary" onClick={handleClearRatings}>
        Clear Ratings
      </Button>
      </>)}

      <h2>Rentals for {gameName}</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Document Number</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Review</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
                {rentals.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell>{rental.first_name}</TableCell>
                    <TableCell>{rental.last_name}</TableCell>
                    <TableCell>{rental.document_number}</TableCell>
                    <TableCell>{new Date(rental.rental_start_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(rental.rental_end_date).toLocaleDateString()}</TableCell>
                    <TableCell>{rental.rating}</TableCell>  {/* New field */}
                    <TableCell>{rental.review}</TableCell>  {/* New field */}
                  </TableRow>
                ))}
              </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default RentalsPage;

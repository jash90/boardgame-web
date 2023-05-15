import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';
import { Add as AddIcon, CloudUpload, Delete as DeleteIcon, Edit as EditIcon, Save } from '@material-ui/icons';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

import { makeStyles } from '@material-ui/core/styles';
import { Link, useNavigate } from 'react-router-dom';
import { Logout, ManageAccounts } from '@mui/icons-material';
import { useAtom } from 'jotai';
import { currentUserAtom } from '../jotai/models';
import axios from '../api/axios';

const useStyles = makeStyles({
  button: {
    margin: '1rem 0.5rem'
  }
});


function ListGames() {
  const classes = useStyles();
  const navigate = useNavigate(); // Add this
  const [boardGames, setBoardGames] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [minPlayers, setMinPlayers] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [borrowOpen, setBorrowOpen] = useState(false);
  const [selectedBoardGame, setSelectedBoardGame] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [currentReturnedGameId, setCurrentReturnedGameId] = useState(null);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  useEffect(() => {
    fetchBoardGames();
  }, [currentUser, currentUser?.role]);

  const fetchBoardGames = async () => {
    try {
      const response = await axios.get(`boardgames`);
      setBoardGames(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddClick = () => {
    setEditId(null);
    setName('');
    setDescription('');
    setCategory('');
    setMinPlayers(0);
    setMaxPlayers(0);
    setOpen(true);
  };

  const handleAddBoardGame = async () => {
    try {
      await axios.post(`boardgames`, {
        name,
        description,
        category,
        min_players: minPlayers,
        max_players: maxPlayers
      });
      setOpen(false);
      setBoardGames([
        ...boardGames,
        {
          name,
          description,
          category,
          min_players: minPlayers,
          max_players: maxPlayers,
          is_available: true
        }
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (boardGame) => {
    setEditId(boardGame.id);
    setName(boardGame.name);
    setDescription(boardGame.description);
    setCategory(boardGame.category);
    setMinPlayers(boardGame.min_players);
    setMaxPlayers(boardGame.max_players);
    setOpen(true);
  };

  const handleEditBoardGame = async () => {
    try {
      await axios.put(`boardgames/${editId}`, {
        name,
        description,
        category,
        min_players: minPlayers,
        max_players: maxPlayers
      });
      setOpen(false);
      const updatedBoardGames = boardGames.map((boardGame) => {
        if (boardGame.id === editId) {
          return {
            ...boardGame,
            name,
            description,
            category,
            min_players: minPlayers,
            max_players: maxPlayers
          };
        }
        return boardGame;
      });
      setBoardGames(updatedBoardGames);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = async (boardGame) => {
    if (window.confirm('Are you sure you want to delete this board game?')) {
      try {
        await axios.delete(`boardgames/${boardGame.id}`);
        setBoardGames(boardGames.filter(boardGame));
      } catch (error) {
        console.error(error);
      }
    }
  };


  const handleBorrowBoardGame = async () => {
    try {
      setBorrowOpen(false);
      if (!selectedBoardGame.is_available) {
        alert('This board game is not available for borrowing.');
        return;
      }
      if (!firstName || !lastName || !documentNumber) {
        alert('You must complete all the details to rent a game.');
        return;
      }

      await axios.post(`boardgames/borrow`, {
        boardgame_id: selectedBoardGame.id,
        first_name: firstName,
        last_name: lastName,
        document_number: documentNumber
      });

      setSelectedBoardGame(null);
      setFirstName('');
      setLastName('');
      setDocumentNumber('');
      fetchBoardGames();
    } catch (error) {
      console.error(error);
    }
  };


  const handleReturnBoardGame = async (boardGame) => {
    try {
      if (boardGame.is_available) {
        alert('This board game is not currently borrowed.');
        return;
      }
      const rental = await axios.get(`rentalByBoardgameId/${boardGame.id}`);
      if (!rental.data) {
        alert('Rental not found.');
        return;
      }
      await axios.post(`boardgames/return`, {
        rental_id: rental.data.id
      });
      fetchBoardGames();

      // Open the review dialog
      setOpenReviewDialog(true);
      setCurrentReturnedGameId(rental.data.id);  // Save the ID of the returned game for later
    } catch (error) {
      console.error(error);
    }
  };


  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const importedBoardGames = results.data.map((game) => ({
            name: game.name,
            description: game.description,
            category: game.category,
            min_players: parseInt(game.min_players, 10),
            max_players: parseInt(game.max_players, 10)
          }));

          await axios.post(`boardgames/bulk-import`, { boardgames: importedBoardGames });
          const response = await axios.get(`boardgames`);
          setBoardGames(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  const exportBoardGamesToCSV = () => {
    const headers = ['name', 'description', 'category', 'min_players', 'max_players'];
    const csvContent =
      headers.join(',') +
      '\n' +
      boardGames
        .map((game) =>
          [game.name, game.description, game.category, game.min_players, game.max_players].join(',')
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'boardgames.csv');
  };

  const handleAddReview = async () => {
    try {
      const response = await axios.post(`rentals/${currentReturnedGameId}/review`, {
        rating,
        review
      });

      setOpenReviewDialog(false);  // Close the dialog
      setCurrentReturnedGameId(null);
      alert('Review added successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    // remove the token from local storage
    localStorage.removeItem('token');
    // redirect to login page (or any other action you want to perform after logout)
    navigate('/login');
  };

  const navigateToManageUsers = () => {
    navigate("/manage-users")
  }


  return (
    <div>
      <Dialog open={openReviewDialog} onClose={() => setOpenReviewDialog(false)}>
        <DialogTitle>Add Your Review</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label='Rating (0-5)'
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          <TextField
            fullWidth
            label='Review'
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReviewDialog(false)}>Cancel</Button>
          <Button onClick={handleAddReview} color='primary'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={borrowOpen} onClose={() => setBorrowOpen(false)}>
        <DialogTitle>Borrow a Game</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='first-name'
            label='First Name'
            type='text'
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            margin='dense'
            id='last-name'
            label='Last Name'
            type='text'
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            margin='dense'
            id='document-id'
            label='Document Id'
            type='text'
            fullWidth
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBorrowOpen(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleBorrowBoardGame} color='primary'>
            Borrow
          </Button>
        </DialogActions>
      </Dialog>
      {currentUser?.role === 'admin' && (
        <>
      <Button
        className={classes.button}
        variant='contained'
        color='primary'
        startIcon={<AddIcon />}
        onClick={handleAddClick}>
        Add Board Game
      </Button>
      <Button
        className={classes.button}
        variant='contained'
        component='label'
        color='primary'
        startIcon={<CloudUpload />}>
        Import Board Games
        <input
          style={{ display: 'none' }}
          id='import-csv'
          type='file'
          accept='.csv'
          onChange={handleImportCSV}
        />
      </Button>
      <Button
        className={classes.button}
        variant='contained'
        color='primary'
        startIcon={<Save />}
        onClick={exportBoardGamesToCSV}>
        Export Board Games
      </Button>
          <Button
            className={classes.button}
            variant='contained'
            color='primary'
            startIcon={<ManageAccounts />}
            onClick={navigateToManageUsers}>
            Manage Users
          </Button>
        </>
      )}
      <Button className={classes.button} variant='contained' color='secondary' onClick={handleLogout}
              startIcon={<Logout />}>
        Logout
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Min/Max Players</TableCell>
              <TableCell>Start Rental Date</TableCell>
              <TableCell>First name and Last name</TableCell>
              <TableCell align='center'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {boardGames.map((boardGame) =>
              (<TableRow key={boardGame.id}>
                <TableCell>{boardGame.name}</TableCell>
                <TableCell>{boardGame.description}</TableCell>
                <TableCell>{boardGame.category}</TableCell>
                <TableCell>{boardGame.min_players + ' / ' + boardGame.max_players}</TableCell>
                <TableCell>{boardGame.first_name + ' ' + boardGame.last_name}</TableCell>
                <TableCell>
                  {boardGame.rental_start_date > 0
                    ? new Date(boardGame.rental_start_date).toLocaleDateString()
                    : ''}
                </TableCell>
                <TableCell align='center'>
                  {currentUser?.role === 'admin' && (
                    <>
                  <IconButton onClick={() => handleEditClick(boardGame)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(boardGame)}>
                    <DeleteIcon />
                  </IconButton>
                  </>)}
                  <Button
                    disabled={!Boolean(boardGame.is_available)}
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      setSelectedBoardGame(boardGame);
                      setBorrowOpen(true);
                    }}
                  >
                    Borrow
                  </Button>
                  <Button
                    disabled={Boolean(boardGame.is_available)}
                    variant='contained'
                    color='secondary'
                    onClick={() => handleReturnBoardGame(boardGame)}>
                    Return
                  </Button>
                  <Button variant='contained' color='primary' component={Link} to={`/rentals/${boardGame.id}`}>View
                    Rentals</Button>
                </TableCell>
              </TableRow>)
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editId ? 'Edit Board Game' : 'Add Board Game'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            fullWidth
            label='Category'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <TextField
            fullWidth
            label='Minimum Players'
            value={minPlayers}
            type='number'
            onChange={(e) => setMinPlayers(e.target.value)}
          />
          <TextField
            fullWidth
            label='Maximum Players'
            value={maxPlayers}
            type='number'
            onChange={(e) => setMaxPlayers(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={editId ? handleEditBoardGame : handleAddBoardGame} color='primary'>
            {editId ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ListGames;

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core';
import {
  Add as AddIcon,
  CloudUpload,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save
} from '@material-ui/icons';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

import { Link, useNavigate } from 'react-router-dom';
import { Logout, ManageAccounts, Password } from '@mui/icons-material';
import { useAtom } from 'jotai';
import { currentUserAtom } from '../jotai/models';
import axios from '../api/axios';

function ListGames() {
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
  const [currentUser] = useAtom(currentUserAtom);
  const [coverFile, setCoverFile] = useState(null);
  const [barcode, setBarcode] = useState('');
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [filterMinPlayers, setFilterMinPlayers] = useState('');
  const [filterMaxPlayers, setFilterMaxPlayers] = useState('');
  const [filterAvgRating, setFilterAvgRating] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  const searchTimeoutRef = useRef(null);

  const fetchBoardGames = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('boardgames', {
        params: {
          search: searchText,
          minPlayers: filterMinPlayers,
          maxPlayers: filterMaxPlayers,
          avgRating: filterAvgRating
        }
      });
      setBoardGames(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchBoardGames();
  }, [
    debouncedSearchText,
    filterMinPlayers,
    filterMaxPlayers,
    filterAvgRating,
    currentUser,
    currentUser?.role,
    fetchBoardGames
  ]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 1000); // 2000ms = 2s

    return () => {
      clearTimeout(searchTimeoutRef.current);
    };
  }, [searchText]);

  // Handle file change
  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  //]);

  const handleAddClick = () => {
    setEditId(null);
    setName('');
    setDescription('');
    setCategory('');
    setMinPlayers(0);
    setMaxPlayers(0);
    setOpen(true);
    setCoverFile(null);
    setBarcode('');
  };

  const handleAddBoardGame = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('min_players', minPlayers);
      formData.append('max_players', maxPlayers);
      formData.append('barcode', barcode);
      formData.append('cover', coverFile); // Add cover here

      await axios.post(`boardgames`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setOpen(false);
      fetchBoardGames();
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
    setCoverFile(null);
    setBarcode('');
  };

  const handleEditBoardGame = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('min_players', minPlayers);
      formData.append('max_players', maxPlayers);
      formData.append('barcode', barcode);
      formData.append('cover', coverFile); // Add cover here

      await axios.put(`boardgames/${editId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setOpen(false);

      fetchBoardGames();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = async (boardGame) => {
    if (window.confirm('Are you sure you want to delete this board game?')) {
      try {
        await axios.delete(`boardgames/${boardGame.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchBoardGames();
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

      await axios.post(
        `boardgames/borrow`,
        {
          boardgame_id: selectedBoardGame.id,
          first_name: firstName,
          last_name: lastName,
          document_number: documentNumber
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

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

      const rental = await axios.post(
        `boardgames/return`,
        {
          boardGameId: boardGame.id
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      fetchBoardGames();
      // Open the review dialog
      setOpenReviewDialog(true);
      setCurrentReturnedGameId(rental.data.id); // Save the ID of the returned game for later
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
            barcode: game.barcode,
            min_players: parseInt(game.min_players, 10),
            max_players: parseInt(game.max_players, 10)
          }));

          await axios.post(
            `boardgames/bulk-import`,
            {
              boardgames: importedBoardGames
            },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }
          );
          const response = await axios.get(`boardgames`);
          setBoardGames(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  const exportBoardGamesToCSV = () => {
    const headers = ['name', 'description', 'category', 'barcode', 'min_players', 'max_players'];
    const csvContent =
      headers.join(',') +
      '\n' +
      boardGames
        .map((game) =>
          [game.name, game.description, game.category, game.barcode, game.min_players, game.max_players].join(',')
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'boardgames.csv');
  };

  const handleAddReview = async () => {
    try {
      await axios.post(
        `rentals/${currentReturnedGameId}/review`,
        {
          rating,
          review
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setOpenReviewDialog(false); // Close the dialog
      setCurrentReturnedGameId(null);
      alert('Review added successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    // remove the token from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    // redirect to login page (or any other action you want to perform after logout)
    navigate('/login');
  };

  const navigateToManageUsers = () => {
    navigate('/manage-users');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const handleFilterButtonClick = () => {
    setOpenFilterModal(true);
  };

  const handleFilterSave = () => {
    setOpenFilterModal(false);
  };

  const handleFilterReset = () => {
    setFilterMinPlayers('');
    setFilterMaxPlayers('');
    setFilterAvgRating('');
    setSearchText('');
  };

  return (
    <Box>
      <Dialog open={openReviewDialog} onClose={() => setOpenReviewDialog(false)}>
        <DialogTitle>Add Your Review</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Rating (0-5)"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          <TextField
            fullWidth
            label="Review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReviewDialog(false)}>Cancel</Button>
          <Button onClick={handleAddReview} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={borrowOpen} onClose={() => setBorrowOpen(false)}>
        <DialogTitle>Borrow a Game</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="first-name"
            label="First Name"
            type="text"
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="last-name"
            label="Last Name"
            type="text"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="document-id"
            label="Document Id"
            type="text"
            fullWidth
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBorrowOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleBorrowBoardGame} color="primary">
            Borrow
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          margin: '20px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start'
        }}>
        {currentUser?.role === 'admin' && (
          <>
            <Button
              sx={{ margin: '20px' }}
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddClick}>
              Add Board Game
            </Button>
            <Button
              variant="contained"
              component="label"
              color="primary"
              sx={{ marginLeft: '20px' }}
              startIcon={<CloudUpload />}>
              Import Board Games
              <input
                style={{ display: 'none' }}
                id="import-csv"
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
              />
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginLeft: '20px' }}
              startIcon={<Save />}
              onClick={exportBoardGamesToCSV}>
              Export Board Games
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginLeft: '20px' }}
              startIcon={<ManageAccounts />}
              onClick={navigateToManageUsers}>
              Manage Users
            </Button>
          </>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleChangePassword}
          startIcon={<Password />}>
          Change Password
        </Button>
        <Button variant="contained" color="secondary" onClick={handleLogout} startIcon={<Logout />}>
          Logout
        </Button>
      </Box>

      <Box sx={{ marginLeft: '20px' }}>
        <Typography variant="h3">List of Board Games</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', margin: '20px' }}>
        <TextField
          label="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleFilterReset}>
          Reset
        </Button>
        <Button variant="contained" color="primary" onClick={handleFilterButtonClick}>
          Filter
        </Button>
      </Box>
      <Dialog open={openFilterModal} onClose={() => setOpenFilterModal(false)}>
        <DialogTitle>Filter Board Games</DialogTitle>
        <DialogContent>
          <TextField
            label="Minimum Players"
            value={filterMinPlayers}
            onChange={(e) => setFilterMinPlayers(e.target.value)}
            fullWidth
          />
          <TextField
            label="Maximum Players"
            value={filterMaxPlayers}
            onChange={(e) => setFilterMaxPlayers(e.target.value)}
            fullWidth
          />
          <TextField
            label="Minimum Average Rating"
            value={filterAvgRating}
            onChange={(e) => setFilterAvgRating(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFilterModal(false)}>Cancel</Button>
          <Button onClick={handleFilterSave} color="primary">
            Save Filter
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ margin: '20px' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cover</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Barcode</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Min/Max Players</TableCell>
                <TableCell>Start Rental Date</TableCell>
                <TableCell>First name and Last name</TableCell>
                <TableCell>AVG Rating</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <p>Loading...</p>
              ) : (
                boardGames.map((boardGame) => (
                  <TableRow key={boardGame.id}>
                    <TableCell>
                      <img
                        src={
                          !boardGame.cover
                            ? `${process.env.REACT_APP_BACKEND}/uploads/board-game.png`
                            : `${process.env.REACT_APP_BACKEND}/${boardGame.cover}`
                        }
                        alt={boardGame.name}
                        width="100"
                        height="100"
                      />
                    </TableCell>
                    <TableCell>{boardGame.name}</TableCell>
                    <TableCell>{boardGame.barcode}</TableCell>
                    <TableCell>{boardGame.category}</TableCell>
                    <TableCell>{boardGame.min_players + ' / ' + boardGame.max_players}</TableCell>
                    <TableCell>{boardGame.first_name + ' ' + boardGame.last_name}</TableCell>
                    <TableCell>
                      {boardGame.rental_start_date > 0
                        ? new Date(boardGame.rental_start_date).toLocaleDateString()
                        : ''}
                    </TableCell>
                    <TableCell>{Number(boardGame.avg_rating).toFixed(2)}</TableCell>
                    <TableCell align="center">
                      {currentUser?.role === 'admin' && (
                        <>
                          <IconButton onClick={() => handleEditClick(boardGame)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteClick(boardGame)}>
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                      <Button
                        disabled={!Boolean(boardGame.is_available)}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setSelectedBoardGame(boardGame);
                          setBorrowOpen(true);
                        }}>
                        Borrow
                      </Button>
                      <Button
                        disabled={Boolean(boardGame.is_available)}
                        variant="contained"
                        color="secondary"
                        onClick={() => handleReturnBoardGame(boardGame)}>
                        Return
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`/rentals/${boardGame.id}`}>
                        View Rentals
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editId ? 'Edit Board Game' : 'Add Board Game'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            fullWidth
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <TextField
            fullWidth
            label="Minimum Players"
            value={minPlayers}
            type="number"
            onChange={(e) => setMinPlayers(e.target.value)}
          />
          <TextField
            fullWidth
            label="Maximum Players"
            value={maxPlayers}
            type="number"
            onChange={(e) => setMaxPlayers(e.target.value)}
          />
          <TextField
            fullWidth
            label="Barcode"
            value={barcode}
            type="number"
            onChange={(e) => setBarcode(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel htmlFor="cover-upload">Cover Image</InputLabel>
            <Input id="cover-upload" type="file" onChange={handleFileChange} />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={editId ? handleEditBoardGame : handleAddBoardGame} color="primary">
            {editId ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ListGames;

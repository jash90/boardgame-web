import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useAtom } from 'jotai';
import axios from '../api/axios';
import useBoardGames from '../functions/useBoardGames';
import {
  borrowBoardGameAtom, openDialogBorrowAtom, openDialogReviewAtom,
} from '../jotai/models';

function DialogBorrowBoardGame() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const { fetchBoardGames } = useBoardGames();
  const [openBorrowDialog, setOpenBorrowDialog] = useAtom(openDialogBorrowAtom);
  const [openReviewDialog, setOpenReviewDialog] = useAtom(openDialogReviewAtom);
  const [borrowedBoardGame, setBorrowedBoardGame] = useAtom(borrowBoardGameAtom);

  const handleBorrowBoardGame = async () => {
    try {
      setOpenBorrowDialog(false);
      if (!borrowedBoardGame.is_available) {
        alert('This board game is not available for borrowing.');
        return;
      }
      if (!firstName || !lastName || !documentNumber) {
        alert('You must complete all the details to rent a game.');
        return;
      }

      await axios.post(
        'boardgames/borrow',
        {
          boardgameId: borrowedBoardGame.id,
          firstname: firstName,
          lastname: lastName,
          documentNumber,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        },
      );

      setFirstName('');
      setLastName('');
      setDocumentNumber('');
      setBorrowedBoardGame(null);
      fetchBoardGames();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddReview = async () => {
    try {
      await axios.post(
        `rentals/${borrowedBoardGame.id}/review`,
        {
          rating,
          review,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        },
      );

      setOpenReviewDialog(false);
      setBorrowedBoardGame(null);
      alert('Review added successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const cancelReview = () => {
    setOpenReviewDialog(false);
    setBorrowedBoardGame(null);
  };

  return (
    <>
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
          <Button onClick={cancelReview}>Cancel</Button>
          <Button onClick={handleAddReview} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openBorrowDialog} onClose={() => setOpenBorrowDialog(false)}>
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
          <Button onClick={() => setOpenBorrowDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleBorrowBoardGame} color="primary">
            Borrow
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DialogBorrowBoardGame;

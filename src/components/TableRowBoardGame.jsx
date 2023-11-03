import {
  Button, IconButton, TableCell, TableRow,
} from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import React from 'react';
import { useAtom, useSetAtom } from 'jotai';
import {
  borrowBoardGameAtom,
  currentUserAtom,
  editBoardGameAtom,
  openDialogAddEditAtom,
  openDialogBorrowAtom,
  openDialogReviewAtom,
} from '../jotai/models';
import useRemoveBoardGame from '../functions/useRemoveBoardGame';
import axios from '../api/axios';
import useBoardGames from '../functions/useBoardGames';

function TableRowBoardGame({ boardGame }) {
  const [currentUser] = useAtom(currentUserAtom);
  const { removeBoardGame } = useRemoveBoardGame();
  const setOpenDialogAddEdit = useSetAtom(openDialogAddEditAtom);
  const { fetchBoardGames } = useBoardGames();
  const setOpenBorrowDialog = useSetAtom(openDialogBorrowAtom);
  const setOpenReviewDialog = useSetAtom(openDialogReviewAtom);
  const setEditBoardGame = useSetAtom(editBoardGameAtom);
  const setBorrowedBoardGame = useSetAtom(borrowBoardGameAtom);
  const {
    id,
    name,
    cover,
    rental_start_date,
    barcode,
    category,
    min_players,
    max_players,
    first_name,
    last_name,
    avg_rating,
    is_available,
  } = boardGame;

  const coverImg = !cover
    ? `${process.env.REACT_APP_BACKEND}/assets/board-game.png`
    : `${process.env.REACT_APP_BACKEND}/${cover}`;
  const rentalDate = rental_start_date
    ? new Date(rental_start_date).toLocaleDateString()
    : '';

  const borrowBoardGame = () => {
    setOpenBorrowDialog(true);
    setBorrowedBoardGame(boardGame);
  };

  const editGame = () => {
    setOpenDialogAddEdit(true);
    setEditBoardGame(boardGame);
  };

  const removeGame = () => {
    removeBoardGame(boardGame);
  };

  const returnBoardGame = async () => {
    try {
      setBorrowedBoardGame(boardGame);
      if (boardGame.is_available) {
        alert('This board game is not currently borrowed.');
        return;
      }

      await axios.post(
        'boardgames/return',
        {
          boardGameId: boardGame.id,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        },
      );
      fetchBoardGames();
      // Open the review dialog
      setOpenReviewDialog(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TableRow key={id}>
      <TableCell>
        <img
          src={coverImg}
          alt={name}
          width="100"
          height="100"
        />
      </TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{barcode}</TableCell>
      <TableCell>{category}</TableCell>
      <TableCell>{`${min_players} / ${max_players}`}</TableCell>
      <TableCell>{`${first_name} ${last_name}`}</TableCell>
      <TableCell>
        {rentalDate}
      </TableCell>
      <TableCell>{Number(avg_rating).toFixed(2)}</TableCell>
      {currentUser?.role === 'admin' && (
      <TableCell align="center">

        <IconButton onClick={editGame}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={removeGame}>
          <DeleteIcon />
        </IconButton>
        <Button
          disabled={!is_available}
          variant="contained"
          color="primary"
          onClick={borrowBoardGame}
        >
          Borrow
        </Button>
        <Button
          disabled={Boolean(is_available)}
          variant="contained"
          color="secondary"
          onClick={returnBoardGame}
        >
          Return
        </Button>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/rentals/${id}`}
        >
          View Rentals
        </Button>
      </TableCell>
      )}
    </TableRow>
  );
}

export default TableRowBoardGame;

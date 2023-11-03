import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { boardGamesAtom, currentUserAtom } from '../jotai/models';
import useBoardGames from '../functions/useBoardGames';
import TableRowBoardGame from './TableRowBoardGame';
import DialogAddEditBoardGame from './DialogAddEditBoardGame';
import DialogBorrowBoardGame from './DialogBorrowBoardGame';
import DialogTableFilter from './DialogTableFilter';

function TableBoardGame() {
  const [boardGames] = useAtom(boardGamesAtom);
  const { loading } = useBoardGames();
  const currentUser = useAtomValue(currentUserAtom);
  return (
    <>
      <DialogTableFilter />
      <DialogAddEditBoardGame />
      <DialogBorrowBoardGame />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cover</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Barcode</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Min/Max Players</TableCell>
              <TableCell>First name and Last name</TableCell>
              <TableCell>Start Rental Date</TableCell>
              <TableCell>AVG Rating</TableCell>
              {currentUser?.role === 'admin' && (
              <TableCell align="center">Action</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <p>Loading...</p>
            ) : (
              boardGames.map((boardGame) => (
                <TableRowBoardGame key={boardGame.id} boardGame={boardGame} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default TableBoardGame;

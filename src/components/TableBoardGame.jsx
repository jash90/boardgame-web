import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React from 'react';
import { useAtom } from 'jotai';
import { boardGamesAtom } from '../jotai/models';
import useBoardGames from '../functions/useBoardGames';
import TableRowBoardGame from './TableRowBoardGame';
import DialogAddEditBoardGame from './DialogAddEditBoardGame';
import DialogBorrowBoardGame from './DialogBorrowBoardGame';

function TableBoardGame() {
  const [boardGames] = useAtom(boardGamesAtom);
  const { loading } = useBoardGames();
  return (
    <>
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
              <TableCell align="center">Action</TableCell>
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

import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputLabel,
  TextField,
} from '@material-ui/core';

import { useAtom, useAtomValue } from 'jotai';
import axios from '../api/axios';
import { editBoardGameAtom, openDialogAddEditAtom } from '../jotai/models';
import useBoardGames from '../functions/useBoardGames';

function DialogAddEditBoardGame() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [minPlayers, setMinPlayers] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(0);
  const [coverFile, setCoverFile] = useState(null);
  const [barcode, setBarcode] = useState('');
  const { fetchBoardGames } = useBoardGames();
  const [open, setOpen] = useAtom(openDialogAddEditAtom);
  const editBoardGame = useAtomValue(editBoardGameAtom);

  useEffect(() => {
    setName(editBoardGame?.name ?? '');
    setDescription(editBoardGame?.description ?? '');
    setCategory(editBoardGame?.category ?? '');
    setMinPlayers(Number(editBoardGame?.min_players) ?? 0);
    setMaxPlayers(Number(editBoardGame?.max_players) ?? 0);
    setBarcode(editBoardGame?.barcode ?? 0);
  }, [editBoardGame]);

  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  const handleAddBoardGame = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('minPlayers', minPlayers);
      formData.append('maxPlayers', maxPlayers);
      formData.append('barcode', barcode);
      formData.append('cover', coverFile); // Add cover here

      await axios.post('boardgames', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setOpen(false);
      setName('');
      setDescription('');
      setCategory('');
      setMinPlayers(0);
      setMaxPlayers(0);
      setBarcode(0);
      fetchBoardGames();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditBoardGame = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('minPlayers', minPlayers);
      formData.append('maxPlayers', maxPlayers);
      formData.append('barcode', barcode);
      formData.append('cover', coverFile); // Add cover here

      await axios.put(`boardgames/${editBoardGame.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setOpen(false);
      setOpen(false);
      setName('');
      setDescription('');
      setCategory('');
      setMinPlayers(0);
      setMaxPlayers(0);
      setBarcode(0);
      fetchBoardGames();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{editBoardGame ? 'Edit Board Game' : 'Add Board Game'}</DialogTitle>
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
        <Button onClick={editBoardGame ? handleEditBoardGame : handleAddBoardGame} color="primary">
          {editBoardGame ? 'Save' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogAddEditBoardGame;

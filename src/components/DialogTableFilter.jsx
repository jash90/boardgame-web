import {
  Box,
  Button,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { filterAtom, openDialogFilterAtom } from '../jotai/models';

function DialogTableFilter() {
  const [filter, setFilter] = useAtom(filterAtom);
  const [openDialog, setOpenDialog] = useAtom(openDialogFilterAtom);
  const [filterMinPlayers, setFilterMinPlayers] = useState(0);
  const [filterMaxPlayers, setFilterMaxPlayers] = useState(0);
  const [filterAvgRating, setFilterAvgRating] = useState(0);

  const handleFilterReset = () => {
    setFilter({
      searchText: null,
      filterAvgRating: null,
      filterMaxPlayers: null,
      filterMinPlayers: null,
    });
    setFilterMinPlayers(0);
    setFilterMaxPlayers(0);
    setFilterAvgRating(0);
    setOpenDialog(false);
  };

  const handleFilterSave = () => {
    setFilter((prev) => ({
      ...prev,
      filterAvgRating,
      filterMaxPlayers,
      filterMinPlayers,
    }));
    setOpenDialog(false);
  };

  const close = () => {
    setOpenDialog(false);
  };

  const open = () => {
    setOpenDialog(true);
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', margin: '20px' }}>
        <TextField
          label="Search"
          value={filter.searchText}
          onChange={(e) => setFilter((prev) => ({ ...prev, searchText: e.target.value }))}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleFilterReset}>
          Reset
        </Button>
        <Button variant="contained" color="primary" onClick={open}>
          Filter
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={close}>
        <Box sx={{
          display: 'flex',
        }}
        >
          <DialogTitle>Filter Board Games</DialogTitle>
        </Box>
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
          <Button onClick={handleFilterReset}>Cancel</Button>
          <Button onClick={handleFilterSave} color="primary">
            Save Filter
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DialogTableFilter;

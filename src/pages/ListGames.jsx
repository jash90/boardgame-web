import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
} from '@material-ui/core';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Add as AddIcon, CloudUpload, Save } from '@material-ui/icons';
import { currentUserAtom, filterAtom, openDialogAddEditAtom } from '../jotai/models';
import useBoardGames from '../functions/useBoardGames';
import TableBoardGame from '../components/TableBoardGame';
import NavigationButton from '../components/NavigationButton';
import useImportGames from '../functions/useImportGames';
import useExportGames from '../functions/useExportGames';

function ListGames() {
  const [currentUser] = useAtom(currentUserAtom);
  const filter = useAtomValue(filterAtom);
  const [debouncedSearchText, setDebouncedSearchText] = useState(filter.searchText);
  const searchTimeoutRef = useRef(null);
  const { fetchBoardGames } = useBoardGames();
  const { importGames } = useImportGames();
  const { exportGames } = useExportGames();
  const setOpenDialogAddEdit = useSetAtom(openDialogAddEditAtom);

  const openAddDialog = () => {
    setOpenDialogAddEdit(true);
  };

  useEffect(() => {
    fetchBoardGames();
  }, [
    debouncedSearchText,
    filter.filterMinPlayers,
    filter.filterMaxPlayers,
    filter.filterAvgRating,
    currentUser,
    currentUser?.role,
    fetchBoardGames,
  ]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchText(filter.searchText);
    }, 1000); // 2000ms = 2s

    return () => {
      clearTimeout(searchTimeoutRef.current);
    };
  }, [filter.searchText]);

  return (
    <Box>
      {currentUser?.role === 'admin' && (
      <Box
        sx={{
          margin: '20px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}
      >
        <NavigationButton
          icon={<AddIcon />}
          onClick={openAddDialog}
        >
          Add Board Game
        </NavigationButton>
        <NavigationButton
          icon={<CloudUpload />}
        >
          Import Board Games
          <input
            style={{ display: 'none' }}
            id="import-csv"
            type="file"
            accept=".csv"
            onChange={importGames}
          />
        </NavigationButton>
        <NavigationButton
          icon={<Save />}
          onClick={exportGames}
        >
          Export Board Games
        </NavigationButton>
      </Box>
      )}

      <Box sx={{ marginLeft: '20px' }}>
        <Typography variant="h3">List of Board Games</Typography>
      </Box>

      <Box sx={{ margin: '20px' }}>
        <TableBoardGame />
      </Box>
    </Box>
  );
}

export default ListGames;

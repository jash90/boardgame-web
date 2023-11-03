import Papa from 'papaparse';
import { useSetAtom } from 'jotai';
import axios from '../api/axios';
import { boardGamesAtom } from '../jotai/models';

const useImportGames = () => {
  const setBoardGames = useSetAtom(boardGamesAtom);
  const importGames = (e) => {
    const file = e?.target?.files[0];
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
            max_players: parseInt(game.max_players, 10),
          }));

          await axios.post(
            'boardgames/bulk-import',
            {
              boardgames: importedBoardGames,
            },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            },
          );
          const response = await axios.get('boardgames');
          setBoardGames(response.data);
        } catch (error) {
          console.error(error);
        }
      },
    });
  };
  return { importGames };
};

export default useImportGames;

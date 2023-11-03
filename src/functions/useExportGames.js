import { saveAs } from 'file-saver';
import { useAtomValue } from 'jotai';
import { boardGamesAtom } from '../jotai/models';

const useExportGames = () => {
  const boardGames = useAtomValue(boardGamesAtom);

  const exportGames = () => {
    const headers = ['name', 'description', 'category', 'barcode', 'min_players', 'max_players'];
    const csvContent = `${headers.join(',')
    }\n${
      boardGames
        .map((game) => [game.name, game.description, game.category, game.barcode, game.min_players, game.max_players].join(','))
        .join('\n')}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'boardgames.csv');
  };

  return { exportGames };
};

export default useExportGames;

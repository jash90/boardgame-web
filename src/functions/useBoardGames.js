import { useCallback, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import axios from '../api/axios';
import { boardGamesAtom, filterAtom } from '../jotai/models';

const useBoardGames = () => {
  const [loading, setLoading] = useState(false);
  const setBoardGames = useSetAtom(boardGamesAtom);
  const filter = useAtomValue(filterAtom);

  const fetchBoardGames = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('boardgames', {
        params: {
          search: filter.searchText,
          minPlayers: filter.filterMinPlayers,
          maxPlayers: filter.filterMaxPlayers,
          avgRating: filter.filterAvgRating,
        },
      });
      setBoardGames(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [
    filter.filterAvgRating,
    filter.filterMaxPlayers,
    filter.filterMinPlayers,
    filter.searchText,
    setBoardGames]);

  return { loading, fetchBoardGames };
};

export default useBoardGames;

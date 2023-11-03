import axios from '../api/axios';
import useBoardGames from './useBoardGames';

const useRemoveBoardGame = async () => {
  const { fetchBoardGames } = useBoardGames();

  const removeBoardGame = async (boardGame) => {
    if (window.confirm('Are you sure you want to delete this board game?')) {
      try {
        await axios.delete(`boardgames/${boardGame.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        fetchBoardGames();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return { removeBoardGame };
};

export default useRemoveBoardGame;

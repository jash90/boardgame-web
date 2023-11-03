import { atom } from 'jotai';

export const currentUserAtom = atom(null);
export const boardGamesAtom = atom([]);
export const filterAtom = atom({
  searchText: null, filterMinPlayers: null, filterMaxPlayers: null, filterAvgRating: null,
});
export const openDialogAddEditAtom = atom(false);
export const openDialogFilterAtom = atom(false);
export const openDialogBorrowAtom = atom(false);
export const openDialogReviewAtom = atom(false);
export const editBoardGameAtom = atom(null);
export const borrowBoardGameAtom = atom(null);

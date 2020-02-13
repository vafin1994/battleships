export interface QueryParams {
  myRouletteSocketId: string;
  remoteRouletteSocketId: string;
}

export interface Game {
  id: number;
  nameRu: string;
  nameEn: string;
  visibleInRouletteLists: boolean;

}

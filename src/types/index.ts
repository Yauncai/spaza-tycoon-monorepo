export interface Character {
  type: 'guy' | 'gogo' | 'child';
  src: string;
}

export interface GlossaryItem {
  word: string;
  meaning: string;
  context: string;
}

export interface GameState {
  walletConnected: boolean;
  playing: boolean;
  score: number;
  timeLeft: number;
  currentOrder: string | null;
  timer: NodeJS.Timeout | null;
  hearts: number;
}

export type ItemType = 'Bread' | 'Coke' | 'Milk' | 'Benny' | 'Eggs'| 'Goslos';

export interface WeatherData {
  current_weather: {
    weathercode: number;
  };
}
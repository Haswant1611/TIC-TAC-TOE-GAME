import { useState } from "react";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import Log from "./components/Log";
import GameOver from "./components/GameOver.jsx";
import { WINNING_COMBINATIONS } from "./winning-combinations.js";

const PLAYERS = {
  X:'Player 1',
  O:'Player 2'
}

const initialGameBoard = [
  [null,null,null],[null,null,null],[null,null,null]
];

function deriveActivePlayer(gameTurns){
  let curPlayer = 'X';
      if(gameTurns.length>0 && gameTurns[0].player === 'X'){
        curPlayer = 'O';
      }
      return curPlayer;
}
function deriveGameBoard(gameTurns){
  let gameboard = [...initialGameBoard.map(array=>[...array])];

    for (const turn of gameTurns){
        const {square,player} = turn;
        const {row,col} = square;

        gameboard[row][col] = player;
    }
    return gameboard
}



function deriveWinnwer(gameboard,players)
{
  let winner = null;
  //const [activePlayer,setActivePlayer] = useState('X');
  for(const comb of WINNING_COMBINATIONS){
    const firstSquareSymbol = gameboard[comb[0].row][comb[0].column];
    const secondSquareSymbol= gameboard[comb[1].row][comb[1].column];
    const thirdSquareSymbol= gameboard[comb[2].row][comb[2].column];
    if(firstSquareSymbol && firstSquareSymbol===secondSquareSymbol
       && firstSquareSymbol===thirdSquareSymbol){
        winner = players[firstSquareSymbol];
       }
  }
  return winner;
}

function App() {
  const [players,setPlayers]= useState(PLAYERS);
  const [gameTurns,setGmaeTurns] = useState([]);
  //const [hasWinner,setHasWiner] = useState(false);

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameboard = deriveGameBoard(gameTurns);
  const winner = deriveWinnwer(gameboard,players);   
  const hasDraw = gameTurns.length ===9 && !winner;

  function handleSelectSquare(rowIndex,colIndex){
    
    //setActivePlayer((curActivePlayer)=>curActivePlayer==='X'?'O':'X');
    setGmaeTurns((prevTurns)=>{
      const curPlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [
        {square:{row:rowIndex,col:colIndex},player:curPlayer}
        ,...prevTurns];
      return updatedTurns;
    });
  }

  function handleRestart(){
    setGmaeTurns([]);
  }
  function handlePlayerNameChage(symbol,newName){
    setPlayers(prevPlayers=>{
      return {...prevPlayers,
        [symbol]:newName
      }
    })
  }

  return (
    <main>
      <div id = 'game-container'>
        <ol id = 'players'className="highlight-player">
          <Player initialname = {PLAYERS.X} symbol = 'X' isActive={activePlayer==='X'}onChangeName={handlePlayerNameChage}/>
          <Player initialname = {PLAYERS.O} symbol = 'O'isActive={activePlayer==='O'}onChangeName={handlePlayerNameChage}/>
        </ol>
        {(winner||hasDraw)&& 
        <GameOver winner={winner} onRestart={handleRestart}/>}
        <GameBoard onSelectSquare={handleSelectSquare} board = {gameboard}/>
      </div>
      <Log turns = {gameTurns}/>
    </main>
  );
}

export default App

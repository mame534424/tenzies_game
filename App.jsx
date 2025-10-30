import { useState, useRef, useEffect } from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    // add a timer and roll counter to see how quickly u can win the game
    const [dice, setDice] = useState(() => generateAllNewDice())// u wite it as a function to avoid re running on every render
    const [counter,setCounter]=useState(0);
    const [seconds,setSeconds]=useState(0);
    /*
    Effects:
- useEffect to start timer when game starts.
- useEffect to stop timer when gameWon is true.
    */ 

    const buttonRef = useRef(null)// to focus on the button when game is won

    const gameWon = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)// return a bollean if all dice are held and have the same value
        
    useEffect(() => {
        if (gameWon) {
            buttonRef.current.focus()
            setCounter(0);// reset counter when game is won
        }
    }, [gameWon])// rendered when gamewon change if gamewon is true focus on the button

    function generateAllNewDice() {//1
        return new Array(10)
            .fill(0)
            .map(() => ({
                value: Math.ceil(Math.random() * 6),// usage of ceil to get value from 1 to 6
                isHeld: false,
                id: nanoid()
            }))
    }
   
    
    function rollDice() {
       
        if (!gameWon) {
            setDice(oldDice => oldDice.map(die =>
                die.isHeld ?
                    die :
                    { ...die, value: Math.ceil(Math.random() * 6) 
                }
            ))
        setCounter(prevCounter=>prevCounter+1);
        } else {
            setDice(generateAllNewDice())
        }
    }

    function hold(id) {
        setDice(oldDice => oldDice.map(die =>
            die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        ))
    }

    const diceElements = dice.map(dieObj => (// because it is an array of objects
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}
        />
    ))

    return (
        <main>
            {gameWon && <Confetti />}
            <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            </div>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="counter_container">
                <p className="counter">Rolls: {counter}</p>
            </div>
            
            <div className="dice-container">
                {diceElements}
            </div>
            <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
                {gameWon ? "New Game" : "Roll"}
            </button>
        </main>
    )
}

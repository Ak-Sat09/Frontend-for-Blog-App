import { useState } from 'react';

export default function GuessTheNumber() {
    const [range, setRange] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const [secretNumber, setSecretNumber] = useState(null);
    const [chances, setChances] = useState(0);
    const [guess, setGuess] = useState('');
    const [hint, setHint] = useState('');
    const [gameOver, setGameOver] = useState(false);

    const startGame = () => {
        const N = parseInt(range);
        if (!N || N <= 1) {
            alert('Enter valid N (>1)');
            return;
        }

        const secret = Math.floor(Math.random() * N) + 1;
        const maxAttempts = Math.floor(Math.log2(N)) + 1;

        setSecretNumber(secret);
        setChances(maxAttempts - 1);
        setGameStarted(true);
        setHint('');
        setGuess('');
        setGameOver(false);
    };

    const checkGuess = () => {
        if (chances <= 0 || gameOver) return;

        const guessNum = parseInt(guess);
        if (!guessNum) return;

        if (guessNum === secretNumber) {
            setHint('🎉 You Won!');
            setGameOver(true);
            return;
        }

        const newChances = chances - 1;
        setChances(newChances);

        if (guessNum < secretNumber) {
            setHint('📉 Too Small!');
        } else {
            setHint('📈 Too Large!');
        }

        if (newChances === 0) {
            setHint(`❌ Game Over! Number was ${secretNumber}`);
            setGameOver(true);
        }

        setGuess('');
    };

    const resetGame = () => {
        setGameStarted(false);
        setRange('');
        setSecretNumber(null);
        setChances(0);
        setGuess('');
        setHint('');
        setGameOver(false);
    };

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            background: '#0f172a',
            color: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px'
        }}>
            <div style={{
                background: '#1e293b',
                padding: '30px',
                borderRadius: '10px',
                width: '100%',
                maxWidth: '320px',
                textAlign: 'center'
            }}>
                <h1 style={{ marginBottom: '20px' }}>🎯 Guess The Number</h1>

                {!gameStarted ? (
                    <div>
                        <input
                            type="number"
                            value={range}
                            onChange={(e) => setRange(e.target.value)}
                            placeholder="Enter N (1 to N)"
                            style={{
                                width: '100%',
                                padding: '10px',
                                margin: '10px 0',
                                borderRadius: '5px',
                                border: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                        <button
                            onClick={startGame}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: '#38bdf8',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                color: '#000'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#0ea5e9'}
                            onMouseOut={(e) => e.target.style.background = '#38bdf8'}
                        >
                            Start Game
                        </button>
                    </div>
                ) : (
                    <div>
                        <div style={{ margin: '15px 0', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {Array.from({ length: Math.floor(Math.log2(parseInt(range))) }, (_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        background: i < chances ? '#22c55e' : '#ef4444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {i < chances ? '✓' : '✗'}
                                </div>
                            ))}
                        </div>
                        <p style={{ margin: '10px 0', fontSize: '14px' }}>
                            Chances Left: {chances}
                        </p>
                        <input
                            type="number"
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            placeholder="Enter your guess"
                            disabled={gameOver}
                            style={{
                                width: '100%',
                                padding: '10px',
                                margin: '10px 0',
                                borderRadius: '5px',
                                border: 'none',
                                boxSizing: 'border-box',
                                opacity: gameOver ? 0.6 : 1
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') checkGuess();
                            }}
                        />
                        <button
                            onClick={checkGuess}
                            disabled={gameOver && !hint.includes('Won')}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: gameOver ? '#64748b' : '#38bdf8',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: gameOver ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold',
                                color: '#000',
                                marginBottom: '10px'
                            }}
                            onMouseOver={(e) => {
                                if (!gameOver) e.target.style.background = '#0ea5e9';
                            }}
                            onMouseOut={(e) => {
                                if (!gameOver) e.target.style.background = '#38bdf8';
                            }}
                        >
                            Guess
                        </button>
                        {gameOver && (
                            <button
                                onClick={resetGame}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    background: '#22c55e',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    color: '#000'
                                }}
                                onMouseOver={(e) => e.target.style.background = '#16a34a'}
                                onMouseOut={(e) => e.target.style.background = '#22c55e'}
                            >
                                Play Again
                            </button>
                        )}
                        <p style={{
                            marginTop: '15px',
                            fontSize: '16px',
                            minHeight: '24px',
                            fontWeight: 'bold'
                        }}>
                            {hint}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
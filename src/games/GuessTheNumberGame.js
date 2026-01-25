import { useState } from 'react';

export default function GuessTheNumber() {
    const [range, setRange] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const [secretNumber, setSecretNumber] = useState(null);
    const [chances, setChances] = useState(0);
    const [totalChances, setTotalChances] = useState(0);
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
        const initialChances = maxAttempts - 1;

        setSecretNumber(secret);
        setChances(initialChances);
        setTotalChances(initialChances);
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
        setTotalChances(0);
        setGuess('');
        setHint('');
        setGameOver(false);
    };

    return (
        <div style={{
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '40px',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '420px',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{
                    fontSize: '48px',
                    marginBottom: '10px'
                }}>🎯</div>
                <h1 style={{
                    marginBottom: '10px',
                    color: '#667eea',
                    fontSize: '32px',
                    fontWeight: '700'
                }}>Guess The Number</h1>
                <p style={{
                    color: '#666',
                    marginBottom: '30px',
                    fontSize: '14px'
                }}>Can you find the secret number?</p>

                {!gameStarted ? (
                    <div>
                        <input
                            type="number"
                            value={range}
                            onChange={(e) => setRange(e.target.value)}
                            placeholder="Enter range (e.g., 100)"
                            style={{
                                width: '100%',
                                padding: '16px',
                                margin: '10px 0',
                                borderRadius: '12px',
                                border: '2px solid #e0e0e0',
                                boxSizing: 'border-box',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'all 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                        <button
                            onClick={startGame}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                color: '#fff',
                                fontSize: '16px',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                            }}
                        >
                            Start Game
                        </button>
                    </div>
                ) : (
                    <div>
                        <div style={{
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            padding: '20px',
                            borderRadius: '16px',
                            marginBottom: '20px',
                            color: '#fff'
                        }}>
                            <div style={{ fontSize: '14px', marginBottom: '10px', opacity: '0.9' }}>
                                Range: 1 - {range}
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: '700' }}>
                                {chances} / {totalChances}
                            </div>
                            <div style={{ fontSize: '12px', marginTop: '5px', opacity: '0.9' }}>
                                Chances Remaining
                            </div>
                        </div>

                        <div style={{
                            margin: '20px 0',
                            display: 'flex',
                            gap: '6px',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            {Array.from({ length: totalChances }, (_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        background: i < chances
                                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                            : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: '#fff',
                                        transition: 'all 0.4s ease',
                                        boxShadow: i < chances
                                            ? '0 4px 10px rgba(102, 126, 234, 0.4)'
                                            : '0 4px 10px rgba(255, 107, 107, 0.4)',
                                        transform: i < chances ? 'scale(1)' : 'scale(0.85)'
                                    }}
                                >
                                    {i < chances ? '♥' : '✗'}
                                </div>
                            ))}
                        </div>

                        <input
                            type="number"
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            placeholder="Enter your guess"
                            disabled={gameOver}
                            style={{
                                width: '100%',
                                padding: '16px',
                                margin: '10px 0',
                                borderRadius: '12px',
                                border: '2px solid #e0e0e0',
                                boxSizing: 'border-box',
                                fontSize: '16px',
                                outline: 'none',
                                opacity: gameOver ? 0.6 : 1,
                                transition: 'all 0.3s'
                            }}
                            onFocus={(e) => {
                                if (!gameOver) e.target.style.borderColor = '#667eea';
                            }}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') checkGuess();
                            }}
                        />
                        <button
                            onClick={checkGuess}
                            disabled={gameOver && !hint.includes('Won')}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: gameOver
                                    ? 'linear-gradient(135deg, #a0a0a0 0%, #888888 100%)'
                                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: gameOver ? 'not-allowed' : 'pointer',
                                fontWeight: '600',
                                color: '#fff',
                                fontSize: '16px',
                                marginBottom: '10px',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: gameOver
                                    ? 'none'
                                    : '0 4px 15px rgba(102, 126, 234, 0.4)'
                            }}
                            onMouseOver={(e) => {
                                if (!gameOver) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!gameOver) {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                                }
                            }}
                        >
                            Submit Guess
                        </button>
                        {gameOver && (
                            <button
                                onClick={resetGame}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    color: '#fff',
                                    fontSize: '16px',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    boxShadow: '0 4px 15px rgba(56, 239, 125, 0.4)'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(56, 239, 125, 0.6)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(56, 239, 125, 0.4)';
                                }}
                            >
                                🎮 Play Again
                            </button>
                        )}
                        {hint && (
                            <div style={{
                                marginTop: '20px',
                                padding: '16px',
                                borderRadius: '12px',
                                background: hint.includes('Won')
                                    ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                                    : hint.includes('Game Over')
                                        ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
                                        : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                color: '#fff',
                                fontSize: '18px',
                                fontWeight: '600',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                            }}>
                                {hint}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
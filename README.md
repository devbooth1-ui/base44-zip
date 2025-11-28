# Par 3 Challenge

A browser-based golf game where players try to complete 9 par-3 holes with the fewest strokes possible.

## How to Play

1. Open `index.html` in a web browser
2. Use the **Aim** slider to adjust your shot direction
3. Select the appropriate **Club** for the distance:
   - **Driver**: Long distance shots
   - **Iron**: Medium distance shots
   - **Wedge**: Short distance, good for bunker escapes
   - **Putter**: Very short distances, ideal near the hole
4. Click and hold the **Swing!** button to build power
5. Release to hit the ball

## Game Features

- 9 unique holes with different layouts
- Water hazards (penalty stroke if ball lands in water)
- Sand bunkers (reduced ball speed and power)
- Power meter with timing-based mechanics
- Score tracking relative to par

## Scoring

- **Hole in One**: Ball in the hole in 1 stroke
- **Eagle**: 2 under par (1 stroke on a par 3)
- **Birdie**: 1 under par (2 strokes on a par 3)
- **Par**: Expected strokes (3 strokes on a par 3)
- **Bogey**: 1 over par (4 strokes on a par 3)

## Project Structure

```
├── index.html      # Main game page
├── css/
│   └── style.css   # Game styling
├── js/
│   └── game.js     # Game logic and physics
└── README.md       # This file
```

## Technologies

- Pure HTML5, CSS3, and vanilla JavaScript
- Canvas API for game rendering
- No external dependencies required

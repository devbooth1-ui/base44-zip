/**
 * Par 3 Challenge - Golf Game
 * A simple browser-based golf game where players try to complete
 * 9 par-3 holes with the fewest strokes possible.
 */

// Game configuration
const CONFIG = {
    TOTAL_HOLES: 9,
    PAR_PER_HOLE: 3,
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    BALL_RADIUS: 6,
    HOLE_RADIUS: 10,
    FLAG_HEIGHT: 40,
    FRICTION: 0.98,
    BUNKER_FRICTION: 0.92,
    MIN_VELOCITY: 0.1,
    MAX_SPEED: 15,
    MAX_HOLE_ENTRY_SPEED: 3,
    PIXELS_PER_YARD: 5,
    DIMPLE_ANIMATION_SPEED: 100,
    CLUBS: {
        driver: { power: 1.0, name: 'Driver' },
        iron: { power: 0.7, name: 'Iron' },
        wedge: { power: 0.4, name: 'Wedge' },
        putter: { power: 0.15, name: 'Putter' }
    }
};

// Hole configurations - each hole has different layouts
const HOLES = [
    {
        name: "The Opener",
        distance: 150,
        tee: { x: 100, y: 500 },
        hole: { x: 700, y: 100 },
        hazards: [],
        bunkers: [{ x: 600, y: 150, radius: 40 }]
    },
    {
        name: "Water Hazard",
        distance: 130,
        tee: { x: 100, y: 500 },
        hole: { x: 650, y: 150 },
        hazards: [{ type: 'water', x: 350, y: 300, width: 100, height: 150 }],
        bunkers: []
    },
    {
        name: "The Bunker Challenge",
        distance: 140,
        tee: { x: 100, y: 300 },
        hole: { x: 700, y: 300 },
        hazards: [],
        bunkers: [
            { x: 400, y: 250, radius: 50 },
            { x: 550, y: 350, radius: 45 }
        ]
    },
    {
        name: "Island Green",
        distance: 120,
        tee: { x: 100, y: 500 },
        hole: { x: 600, y: 200 },
        hazards: [
            { type: 'water', x: 450, y: 100, width: 250, height: 250 }
        ],
        bunkers: []
    },
    {
        name: "Dogleg Left",
        distance: 160,
        tee: { x: 700, y: 500 },
        hole: { x: 150, y: 100 },
        hazards: [],
        bunkers: [
            { x: 300, y: 300, radius: 60 }
        ]
    },
    {
        name: "The Narrow",
        distance: 145,
        tee: { x: 100, y: 550 },
        hole: { x: 700, y: 50 },
        hazards: [
            { type: 'water', x: 0, y: 200, width: 300, height: 80 },
            { type: 'water', x: 500, y: 350, width: 300, height: 80 }
        ],
        bunkers: []
    },
    {
        name: "Triple Bunker",
        distance: 135,
        tee: { x: 400, y: 550 },
        hole: { x: 400, y: 80 },
        hazards: [],
        bunkers: [
            { x: 250, y: 250, radius: 35 },
            { x: 400, y: 300, radius: 35 },
            { x: 550, y: 250, radius: 35 }
        ]
    },
    {
        name: "Around the Lake",
        distance: 155,
        tee: { x: 100, y: 300 },
        hole: { x: 700, y: 300 },
        hazards: [
            { type: 'water', x: 300, y: 200, width: 200, height: 200 }
        ],
        bunkers: [
            { x: 600, y: 250, radius: 30 },
            { x: 600, y: 350, radius: 30 }
        ]
    },
    {
        name: "The Finale",
        distance: 170,
        tee: { x: 100, y: 550 },
        hole: { x: 700, y: 100 },
        hazards: [
            { type: 'water', x: 250, y: 250, width: 150, height: 100 }
        ],
        bunkers: [
            { x: 500, y: 150, radius: 50 },
            { x: 650, y: 200, radius: 35 }
        ]
    }
];

// Game state
let gameState = {
    currentHole: 0,
    currentStrokes: 0,
    totalScore: 0,
    scores: [],
    ball: { x: 0, y: 0, vx: 0, vy: 0 },
    isSwinging: false,
    isBallMoving: false,
    power: 0,
    powerDirection: 1,
    gameOver: false,
    inBunker: false
};

// DOM elements
let canvas, ctx;
let swingBtn, aimSlider, clubSelect;
let powerFill, powerValue, aimValue;
let currentHoleEl, currentStrokesEl, totalScoreEl;
let gameMessage, gameOverEl, finalScoreEl, scoreDescEl;

// Initialize the game
function init() {
    // Get DOM elements
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    swingBtn = document.getElementById('swing-btn');
    aimSlider = document.getElementById('aim');
    clubSelect = document.getElementById('club');
    
    powerFill = document.getElementById('power-fill');
    powerValue = document.getElementById('power-value');
    aimValue = document.getElementById('aim-value');
    
    currentHoleEl = document.getElementById('current-hole');
    currentStrokesEl = document.getElementById('current-strokes');
    totalScoreEl = document.getElementById('total-score');
    
    gameMessage = document.getElementById('game-message');
    gameOverEl = document.getElementById('game-over');
    finalScoreEl = document.getElementById('final-score');
    scoreDescEl = document.getElementById('score-description');
    
    // Set up event listeners
    swingBtn.addEventListener('mousedown', startSwing);
    swingBtn.addEventListener('mouseup', executeSwing);
    swingBtn.addEventListener('mouseleave', executeSwing);
    swingBtn.addEventListener('touchstart', startSwing);
    swingBtn.addEventListener('touchend', executeSwing);
    
    aimSlider.addEventListener('input', updateAimDisplay);
    
    document.getElementById('play-again-btn').addEventListener('click', resetGame);
    
    // Start the game
    startHole();
    requestAnimationFrame(gameLoop);
}

// Start a new hole
function startHole() {
    const hole = HOLES[gameState.currentHole];
    gameState.ball.x = hole.tee.x;
    gameState.ball.y = hole.tee.y;
    gameState.ball.vx = 0;
    gameState.ball.vy = 0;
    gameState.currentStrokes = 0;
    gameState.power = 0;
    gameState.inBunker = false;
    
    updateUI();
    updateMessage(`Hole ${gameState.currentHole + 1}: ${hole.name} - Par ${CONFIG.PAR_PER_HOLE}`);
}

// Start the swing (power building)
function startSwing(e) {
    e.preventDefault();
    if (gameState.isBallMoving || gameState.gameOver) return;
    
    gameState.isSwinging = true;
    gameState.power = 0;
    gameState.powerDirection = 1;
    
    buildPower();
}

// Build power while holding
function buildPower() {
    if (!gameState.isSwinging) return;
    
    gameState.power += 2 * gameState.powerDirection;
    
    if (gameState.power >= 100) {
        gameState.powerDirection = -1;
    } else if (gameState.power <= 0) {
        gameState.powerDirection = 1;
    }
    
    powerFill.style.width = gameState.power + '%';
    powerValue.textContent = Math.round(gameState.power) + '%';
    
    requestAnimationFrame(buildPower);
}

// Execute the swing
function executeSwing(e) {
    e.preventDefault();
    if (!gameState.isSwinging || gameState.isBallMoving) return;
    
    gameState.isSwinging = false;
    
    if (gameState.power < 5) {
        updateMessage("Too weak! Hold longer for more power.");
        gameState.power = 0;
        powerFill.style.width = '0%';
        powerValue.textContent = '0%';
        return;
    }
    
    // Calculate ball velocity based on power, aim, and club
    const aim = parseInt(aimSlider.value);
    const club = clubSelect.value;
    const clubPower = CONFIG.CLUBS[club].power;
    
    // Convert aim angle to radians (aim towards the right side of screen by default)
    const hole = HOLES[gameState.currentHole];
    const dx = hole.hole.x - gameState.ball.x;
    const dy = hole.hole.y - gameState.ball.y;
    const baseAngle = Math.atan2(dy, dx);
    const aimRadians = (aim * Math.PI) / 180;
    const finalAngle = baseAngle + aimRadians;
    
    // Calculate velocity
    let speed = (gameState.power / 100) * CONFIG.MAX_SPEED * clubPower;
    
    // Reduce speed if in bunker
    if (gameState.inBunker) {
        speed *= 0.5;
        updateMessage("Bunker shot! Reduced power.");
    }
    
    gameState.ball.vx = Math.cos(finalAngle) * speed;
    gameState.ball.vy = Math.sin(finalAngle) * speed;
    
    gameState.currentStrokes++;
    gameState.isBallMoving = true;
    
    // Reset power display
    gameState.power = 0;
    powerFill.style.width = '0%';
    powerValue.textContent = '0%';
    
    updateUI();
    updateMessage("Nice swing!");
}

// Update aim display
function updateAimDisplay() {
    aimValue.textContent = aimSlider.value + '°';
}

// Main game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Update game physics
function update() {
    if (!gameState.isBallMoving) return;
    
    const hole = HOLES[gameState.currentHole];
    
    // Apply friction
    let friction = CONFIG.FRICTION;
    
    // Check if in bunker (more friction)
    gameState.inBunker = false;
    for (const bunker of hole.bunkers) {
        const dist = Math.sqrt(
            Math.pow(gameState.ball.x - bunker.x, 2) + 
            Math.pow(gameState.ball.y - bunker.y, 2)
        );
        if (dist < bunker.radius) {
            friction = CONFIG.BUNKER_FRICTION;
            gameState.inBunker = true;
            break;
        }
    }
    
    gameState.ball.vx *= friction;
    gameState.ball.vy *= friction;
    
    // Update position
    gameState.ball.x += gameState.ball.vx;
    gameState.ball.y += gameState.ball.vy;
    
    // Check boundaries
    if (gameState.ball.x < CONFIG.BALL_RADIUS) {
        gameState.ball.x = CONFIG.BALL_RADIUS;
        gameState.ball.vx *= -0.5;
    }
    if (gameState.ball.x > CONFIG.CANVAS_WIDTH - CONFIG.BALL_RADIUS) {
        gameState.ball.x = CONFIG.CANVAS_WIDTH - CONFIG.BALL_RADIUS;
        gameState.ball.vx *= -0.5;
    }
    if (gameState.ball.y < CONFIG.BALL_RADIUS) {
        gameState.ball.y = CONFIG.BALL_RADIUS;
        gameState.ball.vy *= -0.5;
    }
    if (gameState.ball.y > CONFIG.CANVAS_HEIGHT - CONFIG.BALL_RADIUS) {
        gameState.ball.y = CONFIG.CANVAS_HEIGHT - CONFIG.BALL_RADIUS;
        gameState.ball.vy *= -0.5;
    }
    
    // Check water hazards
    for (const hazard of hole.hazards) {
        if (hazard.type === 'water') {
            if (gameState.ball.x > hazard.x && 
                gameState.ball.x < hazard.x + hazard.width &&
                gameState.ball.y > hazard.y && 
                gameState.ball.y < hazard.y + hazard.height) {
                // Ball in water - penalty stroke and reset
                gameState.currentStrokes++;
                gameState.ball.x = hole.tee.x;
                gameState.ball.y = hole.tee.y;
                gameState.ball.vx = 0;
                gameState.ball.vy = 0;
                gameState.isBallMoving = false;
                updateUI();
                updateMessage("Splash! In the water. Penalty stroke added.");
                return;
            }
        }
    }
    
    // Check if ball is in hole
    const distToHole = Math.sqrt(
        Math.pow(gameState.ball.x - hole.hole.x, 2) + 
        Math.pow(gameState.ball.y - hole.hole.y, 2)
    );
    
    const ballSpeed = Math.sqrt(
        Math.pow(gameState.ball.vx, 2) + 
        Math.pow(gameState.ball.vy, 2)
    );
    
    if (distToHole < CONFIG.HOLE_RADIUS && ballSpeed < CONFIG.MAX_HOLE_ENTRY_SPEED) {
        // Ball is in the hole!
        ballInHole();
        return;
    }
    
    // Check if ball has stopped
    if (ballSpeed < CONFIG.MIN_VELOCITY) {
        gameState.ball.vx = 0;
        gameState.ball.vy = 0;
        gameState.isBallMoving = false;
        
        if (gameState.inBunker) {
            updateMessage("In the bunker! Use a wedge to escape.");
        } else {
            const distDisplay = Math.round(distToHole / CONFIG.PIXELS_PER_YARD);
            updateMessage(`Ball stopped. ${distDisplay} yards to the hole.`);
        }
    }
}

// Handle ball going in hole
function ballInHole() {
    gameState.isBallMoving = false;
    gameState.ball.vx = 0;
    gameState.ball.vy = 0;
    
    const strokes = gameState.currentStrokes;
    const par = CONFIG.PAR_PER_HOLE;
    const diff = strokes - par;
    
    gameState.scores.push(strokes);
    gameState.totalScore += strokes;
    
    let message = "";
    if (strokes === 1) {
        message = "🎉 HOLE IN ONE! Amazing!";
    } else if (diff === -2) {
        message = "🦅 EAGLE! Incredible shot!";
    } else if (diff === -1) {
        message = "🐦 BIRDIE! Great job!";
    } else if (diff === 0) {
        message = "👍 PAR! Nice work!";
    } else if (diff === 1) {
        message = "BOGEY. Keep trying!";
    } else if (diff === 2) {
        message = "DOUBLE BOGEY. You can do better!";
    } else {
        message = `+${diff}. Tough hole!`;
    }
    
    updateMessage(message);
    updateUI();
    
    // Move to next hole after delay
    setTimeout(() => {
        gameState.currentHole++;
        
        if (gameState.currentHole >= CONFIG.TOTAL_HOLES) {
            endGame();
        } else {
            startHole();
        }
    }, 2000);
}

// End the game
function endGame() {
    gameState.gameOver = true;
    
    const totalPar = CONFIG.TOTAL_HOLES * CONFIG.PAR_PER_HOLE;
    const diff = gameState.totalScore - totalPar;
    
    finalScoreEl.textContent = gameState.totalScore;
    
    let description = "";
    if (diff < -5) {
        description = "🏆 Legendary! You're a golf master!";
    } else if (diff < 0) {
        description = "⭐ Under par! Excellent round!";
    } else if (diff === 0) {
        description = "👏 Right on par! Solid game!";
    } else if (diff <= 5) {
        description = "💪 Over par, but not bad!";
    } else {
        description = "🎯 Keep practicing! You'll improve!";
    }
    
    scoreDescEl.textContent = description;
    gameOverEl.classList.remove('hidden');
}

// Reset the game
function resetGame() {
    gameState = {
        currentHole: 0,
        currentStrokes: 0,
        totalScore: 0,
        scores: [],
        ball: { x: 0, y: 0, vx: 0, vy: 0 },
        isSwinging: false,
        isBallMoving: false,
        power: 0,
        powerDirection: 1,
        gameOver: false,
        inBunker: false
    };
    
    gameOverEl.classList.add('hidden');
    aimSlider.value = 0;
    updateAimDisplay();
    startHole();
}

// Render the game
function render() {
    const hole = HOLES[gameState.currentHole];
    
    // Clear canvas
    ctx.fillStyle = '#4a9c59';
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    
    // Draw fairway pattern
    ctx.fillStyle = '#5ab067';
    for (let i = 0; i < CONFIG.CANVAS_WIDTH; i += 40) {
        if ((i / 40) % 2 === 0) {
            ctx.fillRect(i, 0, 20, CONFIG.CANVAS_HEIGHT);
        }
    }
    
    // Draw water hazards
    for (const hazard of hole.hazards) {
        if (hazard.type === 'water') {
            ctx.fillStyle = '#3498db';
            ctx.fillRect(hazard.x, hazard.y, hazard.width, hazard.height);
            
            // Water ripple effect
            ctx.strokeStyle = '#2980b9';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(hazard.x + 10 + i * 30, hazard.y + hazard.height / 2);
                ctx.quadraticCurveTo(
                    hazard.x + 25 + i * 30, hazard.y + hazard.height / 2 - 10,
                    hazard.x + 40 + i * 30, hazard.y + hazard.height / 2
                );
                ctx.stroke();
            }
        }
    }
    
    // Draw bunkers
    for (const bunker of hole.bunkers) {
        ctx.fillStyle = '#f5d89a';
        ctx.beginPath();
        ctx.arc(bunker.x, bunker.y, bunker.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Bunker edge
        ctx.strokeStyle = '#d4b870';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    // Draw tee box
    ctx.fillStyle = '#2d7a3e';
    ctx.fillRect(hole.tee.x - 20, hole.tee.y - 10, 40, 20);
    
    // Draw putting green
    ctx.fillStyle = '#7ec850';
    ctx.beginPath();
    ctx.arc(hole.hole.x, hole.hole.y, 50, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw hole
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(hole.hole.x, hole.hole.y, CONFIG.HOLE_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw flag
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(hole.hole.x - 1, hole.hole.y - CONFIG.FLAG_HEIGHT, 3, CONFIG.FLAG_HEIGHT);
    
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.moveTo(hole.hole.x + 2, hole.hole.y - CONFIG.FLAG_HEIGHT);
    ctx.lineTo(hole.hole.x + 25, hole.hole.y - CONFIG.FLAG_HEIGHT + 12);
    ctx.lineTo(hole.hole.x + 2, hole.hole.y - CONFIG.FLAG_HEIGHT + 24);
    ctx.closePath();
    ctx.fill();
    
    // Draw aim line when not moving
    if (!gameState.isBallMoving && !gameState.gameOver) {
        const aim = parseInt(aimSlider.value);
        const dx = hole.hole.x - gameState.ball.x;
        const dy = hole.hole.y - gameState.ball.y;
        const baseAngle = Math.atan2(dy, dx);
        const aimRadians = (aim * Math.PI) / 180;
        const finalAngle = baseAngle + aimRadians;
        
        const lineLength = 60;
        const endX = gameState.ball.x + Math.cos(finalAngle) * lineLength;
        const endY = gameState.ball.y + Math.sin(finalAngle) * lineLength;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(gameState.ball.x, gameState.ball.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Draw ball
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, CONFIG.BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    
    // Ball outline
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw ball dimples
    ctx.fillStyle = '#f0f0f0';
    const dimpleAngle = Date.now() / CONFIG.DIMPLE_ANIMATION_SPEED;
    for (let i = 0; i < 4; i++) {
        const angle = dimpleAngle + (i * Math.PI / 2);
        const dimpleX = gameState.ball.x + Math.cos(angle) * 3;
        const dimpleY = gameState.ball.y + Math.sin(angle) * 3;
        ctx.beginPath();
        ctx.arc(dimpleX, dimpleY, 1, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw hole info
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(10, 10, 180, 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`Hole ${gameState.currentHole + 1}: ${hole.name}`, 20, 30);
    ctx.font = '12px Arial';
    ctx.fillText(`Distance: ${hole.distance} yards`, 20, 50);
    ctx.fillText(`Par: ${CONFIG.PAR_PER_HOLE}`, 20, 65);
}

// Update UI elements
function updateUI() {
    currentHoleEl.textContent = gameState.currentHole + 1;
    currentStrokesEl.textContent = gameState.currentStrokes;
    totalScoreEl.textContent = gameState.totalScore;
}

// Update message
function updateMessage(message) {
    gameMessage.textContent = message;
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

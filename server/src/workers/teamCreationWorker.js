const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

if (isMainThread) {
  // This is the main thread
  function createTeamAsync(teamData) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: teamData,
      })

      worker.on("message", (result) => {
        resolve(result)
      })

      worker.on("error", (error) => {
        reject(error)
      })

      worker.on("exit", (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`))
        }
      })
    })
  }

  module.exports = { createTeamAsync };
} else {
  // This is the worker thread
  const teamData = workerData;

  // Helper to get random unique players by position
  function getRandomPlayers(players, position, count) {
    const filtered = players.filter((p) => p.position === position);
    
    if (filtered.length < count) {
      return filtered; // Return what we have
    }
    
    // Shuffle array using Fisher-Yates algorithm for true randomness
    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
  }

  function resolvePlayersPath() {
    const candidates = [
      path.join(process.cwd(), 'data/players.json'),
      path.join(process.cwd(), '../data/players.json'),
      path.join(__dirname, '../../../data/players.json'),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
    return candidates[0];
  }

  async function createTeamWithPlayers() {
    try {
      // Read from JSON file
      const playersPath = resolvePlayersPath();
      const playersData = JSON.parse(fs.readFileSync(playersPath, 'utf8'));

      // Get all already assigned players across all teams
      const assignedPlayers = await prisma.team_players.findMany({
        select: { player_id: true }
      });
      
      const assignedPlayerIds = new Set(assignedPlayers.map(tp => tp.player_id));

      // Filter out already assigned players to ensure uniqueness
      const availablePlayers = playersData.filter((p) => !assignedPlayerIds.has(p.player_id));

      // Check position distribution in available players
      const positionCounts = {
        'Goalkeeper': availablePlayers.filter(p => p.position === 'Goalkeeper').length,
        'Defender': availablePlayers.filter(p => p.position === 'Defender').length,
        'Midfielder': availablePlayers.filter(p => p.position === 'Midfielder').length,
        'Forward': availablePlayers.filter(p => p.position === 'Forward').length
      };

      // Required formation: 3 GK, 6 DEF, 6 MID, 5 FWD = 20 total
      const requiredFormation = {
        'Goalkeeper': 3,
        'Defender': 6,
        'Midfielder': 6,
        'Forward': 5
      };

      // Check if we have enough players for each position
      for (const [position, required] of Object.entries(requiredFormation)) {
        if (positionCounts[position] < required) {
          throw new Error(`Not enough ${position} players available. Need ${required}, have ${positionCounts[position]}`);
        }
      }

      // Select players by position ensuring uniqueness
      const selectedPlayers = [];
      
      // Select Goalkeepers
      const gks = getRandomPlayers(availablePlayers, "Goalkeeper", 3);
      selectedPlayers.push(...gks);
      
      // Select Defenders  
      const defs = getRandomPlayers(availablePlayers, "Defender", 6);
      selectedPlayers.push(...defs);
      
      // Select Midfielders
      const mids = getRandomPlayers(availablePlayers, "Midfielder", 6);
      selectedPlayers.push(...mids);
      
      // Select Forwards
      const fwds = getRandomPlayers(availablePlayers, "Forward", 5);
      selectedPlayers.push(...fwds);

      if (selectedPlayers.length !== 20) {
        throw new Error(`Team creation failed: Expected 20 players, got ${selectedPlayers.length}`);
      }

      // Add players to team in database using transaction for atomicity
      await prisma.$transaction(async (tx) => {
        // Add all players to team_players table
        for (const player of selectedPlayers) {
          await tx.team_players.create({
            data: {
              team_id: teamData.id,
              player_id: player.player_id,
              created_at: new Date(),
              updated_at: new Date()
            }
          });
        }

        // Update team player count
        await tx.teams.update({
          where: { id: teamData.id },
          data: { 
            player_count: selectedPlayers.length,
            updated_at: new Date()
          }
        });
      });

      // Transform data to match frontend expectations
      const transformedTeam = {
        id: teamData.id,
        name: teamData.name,
        budget: teamData.budget,
        player_count: selectedPlayers.length,
        players: selectedPlayers.map(player => ({
          id: player.player_id,
          name: player.player_name,
          position: player.position,
          team: player.team_id,
          value: player.player_value,
          in_transfer_market: false,
          asking_price: null
        }))
      };

      parentPort?.postMessage({ success: true, team: transformedTeam });
      
    } catch (error) {
      parentPort?.postMessage({ success: false, error: error.message });
    } finally {
      await prisma.$disconnect();
    }
  }

  createTeamWithPlayers();
} 
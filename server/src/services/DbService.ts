import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Resolve players.json relative to the project root, not the compiled file location.
// process.cwd() is the server/ directory when running via npm scripts.
function getPlayersPath(): string {
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

let _playersCache: any[] | null = null;

function loadPlayersJson(): any[] {
  if (_playersCache) return _playersCache;
  try {
    _playersCache = JSON.parse(fs.readFileSync(getPlayersPath(), 'utf8'));
    return _playersCache!;
  } catch (error) {
    console.error('Error reading players.json:', error);
    return [];
  }
}

function getPlayerFromJson(playerId: number) {
  return loadPlayersJson().find((p: any) => p.player_id === playerId) || null;
}

function getPlayersFromJson(playerIds: number[]) {
  return loadPlayersJson().filter((p: any) => playerIds.includes(p.player_id));
}

export const dbService = {
  // User operations
  async getUserByEmail(email: string) {
    return prisma.users.findUnique({ 
      where: { email },
      include: { teams: true }
    });
  },
  async getUserById(id: string) {
    return prisma.users.findUnique({ 
      where: { id },
      include: { teams: true }
    });
  },
  async createUser(user: { email: string; password: string }) {
    return prisma.users.create({ 
      data: {
        id: randomUUID(),
        email: user.email,
        password: user.password,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: { teams: true }
    });
  },
  async updateUser(id: string, data: any) {
    return prisma.users.update({
      where: { id },
      data,
      include: { teams: true }
    });
  },

  // Team operations
  async getAllTeams() {
    const teams = await prisma.teams.findMany({ 
      include: { 
        team_players: true
      } 
    });
    
    return teams.map((team: any) => {
      const playerIds = team.team_players.map((tp: any) => tp.player_id);
      const playersData = getPlayersFromJson(playerIds);
      
      return {
        ...team,
        players: team.team_players.map((tp: any) => {
          const playerData = playersData.find((p: any) => p.player_id === tp.player_id);
          return {
            id: tp.player_id,
            name: playerData?.player_name || 'Unknown Player',
            position: playerData?.position || 'Unknown',
            team: playerData?.team_id || 'Unknown Team',
            value: playerData?.player_value || 1000000,
            in_transfer_market: tp.in_transfer_market,
            asking_price: tp.asking_price,
            player_id: tp.player_id
          };
        })
      };
    });
  },

  async getTeamByUserId(userId: string) {
    const team = await prisma.teams.findUnique({ 
      where: { user_id: userId }, 
      include: { 
        team_players: true
      } 
    });
    
    if (!team) return null;
    
    const playerIds = team.team_players.map((tp: any) => tp.player_id);
    const playersData = getPlayersFromJson(playerIds);
    
    return {
      ...team,
      players: team.team_players.map((tp: any) => {
        const playerData = playersData.find((p: any) => p.player_id === tp.player_id);
        return {
          id: tp.player_id,
          name: playerData?.player_name || 'Unknown Player',
          position: playerData?.position || 'Unknown',
          team: playerData?.team_id || 'Unknown Team',
          value: playerData?.player_value || 1000000,
          in_transfer_market: tp.in_transfer_market,
          asking_price: tp.asking_price,
          player_id: tp.player_id
        };
      })
    };
  },

  async createTeam(team: any) {
    const createdTeam = await prisma.teams.create({ 
      data: {
        ...team,
        updated_at: new Date()
      }, 
      include: { 
        team_players: true
      } 
    });
    
    return {
      ...createdTeam,
      players: [] // New teams start with no players
    };
  },

  async updateTeam(id: string, data: any) {
    const updatedTeam = await prisma.teams.update({ 
      where: { id }, 
      data: {
        ...data,
        updated_at: new Date()
      }, 
      include: { 
        team_players: true
      } 
    });
    
    const playerIds = updatedTeam.team_players.map((tp: any) => tp.player_id);
    const playersData = getPlayersFromJson(playerIds);
    
    return {
      ...updatedTeam,
      players: updatedTeam.team_players.map((tp: any) => {
        const playerData = playersData.find((p: any) => p.player_id === tp.player_id);
        return {
          id: tp.player_id,
          name: playerData?.player_name || 'Unknown Player',
          position: playerData?.position || 'Unknown',
          team: playerData?.team_id || 'Unknown Team',
          value: playerData?.player_value || 1000000,
          in_transfer_market: tp.in_transfer_market,
          asking_price: tp.asking_price,
          player_id: tp.player_id
        };
      })
    };
  },

  async updateTeamBudget(userId: string, budget: number) {
    return prisma.teams.update({
      where: { user_id: userId },
      data: { 
        budget,
        updated_at: new Date()
      }
    });
  },

  async deleteTeam(teamId: string) {
    return prisma.teams.delete({
      where: { id: teamId }
    });
  },

  // Player-Team relationship operations
  async addPlayerToTeam(teamId: string, playerId: number) {
    return prisma.team_players.create({
      data: {
        team_id: teamId,
        player_id: playerId,
        created_at: new Date(),
        updated_at: new Date(),
      }
    });
  },

  async removePlayerFromTeam(teamId: string, playerId: number) {
    return prisma.team_players.deleteMany({ 
      where: { team_id: teamId, player_id: playerId } 
    });
  },

  // Player operations (now using JSON)
  async getPlayers() {
    const playersData = loadPlayersJson();
    return playersData.map((p: any) => ({
      id: p.player_id,
      name: p.player_name,
      position: p.position,
      team_name: p.team_id,
      value: p.player_value
    }));
  },

  async getPlayerById(id: number) {
    const playerData = getPlayerFromJson(id);
    if (!playerData) return null;
    
    return {
      id: playerData.player_id,
      name: playerData.player_name,
      position: playerData.position,
      team_name: playerData.team_id,
      value: playerData.player_value
    };
  },

  // Market operations
  async getMarketListings() {
    const listings = await prisma.team_players.findMany({ 
      where: { in_transfer_market: true },
      include: { teams: true } 
    });
    
    return listings.map((listing: any) => {
      const playerData = getPlayerFromJson(listing.player_id);
      return {
        ...listing,
        players: playerData ? {
          id: playerData.player_id,
          name: playerData.player_name,
          position: playerData.position,
          team_name: playerData.team_id
        } : {
          id: listing.player_id,
          name: 'Unknown Player',
          position: 'Unknown',
          team_name: 'Unknown Team'
        }
      };
    });
  },

  async createMarketListing(teamId: string, playerId: number, askingPrice: number) {
    return prisma.team_players.updateMany({
      where: { team_id: teamId, player_id: playerId },
      data: { 
        in_transfer_market: true, 
        asking_price: askingPrice,
        updated_at: new Date()
      }
    });
  },

  async removeMarketListing(teamId: string, playerId: number) {
    return prisma.team_players.updateMany({
      where: { team_id: teamId, player_id: playerId },
      data: { 
        in_transfer_market: false, 
        asking_price: null,
        updated_at: new Date()
      }
    });
  },
}; 
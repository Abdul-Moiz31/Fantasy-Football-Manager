import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing players first
  await prisma.player.deleteMany({});

  // Add some players
  const players = [
    { name: "Alisson Becker", position: "Goalkeeper", team: "Liverpool", value: 15000000 },
    { name: "Virgil van Dijk", position: "Defender", team: "Liverpool", value: 18000000 },
    { name: "Mohamed Salah", position: "Forward", team: "Liverpool", value: 20000000 },
    { name: "Kevin De Bruyne", position: "Midfielder", team: "Manchester City", value: 22000000 },
    { name: "Erling Haaland", position: "Forward", team: "Manchester City", value: 25000000 },
    { name: "Harry Kane", position: "Forward", team: "Bayern Munich", value: 20000000 },
    { name: "Kylian Mbappé", position: "Forward", team: "Real Madrid", value: 30000000 },
    { name: "Jude Bellingham", position: "Midfielder", team: "Real Madrid", value: 18000000 },
    { name: "Bukayo Saka", position: "Midfielder", team: "Arsenal", value: 16000000 },
    { name: "Martin Ødegaard", position: "Midfielder", team: "Arsenal", value: 17000000 },
    { name: "Bruno Fernandes", position: "Midfielder", team: "Manchester United", value: 15000000 },
    { name: "Marcus Rashford", position: "Forward", team: "Manchester United", value: 14000000 },
    { name: "Son Heung-min", position: "Forward", team: "Tottenham", value: 16000000 },
    { name: "Rodri", position: "Midfielder", team: "Manchester City", value: 18000000 },
    { name: "Ruben Dias", position: "Defender", team: "Manchester City", value: 17000000 },
    { name: "Trent Alexander-Arnold", position: "Defender", team: "Liverpool", value: 16000000 },
    { name: "Andrew Robertson", position: "Defender", team: "Liverpool", value: 14000000 },
    { name: "Thiago Alcântara", position: "Midfielder", team: "Liverpool", value: 12000000 },
    { name: "Fabinho", position: "Midfielder", team: "Liverpool", value: 13000000 },
    { name: "Roberto Firmino", position: "Forward", team: "Liverpool", value: 14000000 },
    { name: "Sadio Mané", position: "Forward", team: "Al Nassr", value: 15000000 },
    { name: "Bernardo Silva", position: "Midfielder", team: "Manchester City", value: 16000000 },
    { name: "Jack Grealish", position: "Midfielder", team: "Manchester City", value: 14000000 },
    { name: "Phil Foden", position: "Midfielder", team: "Manchester City", value: 15000000 },
    { name: "Ederson", position: "Goalkeeper", team: "Manchester City", value: 14000000 },
  ];

  // Create all players
  await prisma.player.createMany({
    data: players,
    skipDuplicates: true,
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
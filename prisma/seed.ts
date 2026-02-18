import { PrismaClient, Role, NotificationType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing data (optional - comment out if you want to keep existing data)
  console.log("🧹 Cleaning existing data...");
  await prisma.notification.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.groupTag.deleteMany();
  await prisma.group.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Cleaned existing data");

  // Create users
  console.log("👥 Creating users...");
  const hashedPassword = await bcrypt.hash("Password123", 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alice Johnson",
        username: "alice",
        email: "alice@devmerge.com",
        password: hashedPassword,
        bio: "Full-stack developer passionate about AI and machine learning",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      },
    }),
    prisma.user.create({
      data: {
        name: "Bob Smith",
        username: "bob",
        email: "bob@devmerge.com",
        password: hashedPassword,
        bio: "Backend engineer with expertise in cloud architecture",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      },
    }),
    prisma.user.create({
      data: {
        name: "Carol Williams",
        username: "carol",
        email: "carol@devmerge.com",
        password: hashedPassword,
        bio: "Frontend developer and UX enthusiast",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
      },
    }),
    prisma.user.create({
      data: {
        name: "David Chen",
        username: "david",
        email: "david@devmerge.com",
        password: hashedPassword,
        bio: "Mobile developer building cross-platform apps",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create tags
  console.log("🏷️  Creating tags...");
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "AI", slug: "ai" } }),
    prisma.tag.create({ data: { name: "Full Stack", slug: "full-stack" } }),
    prisma.tag.create({ data: { name: "Cloud", slug: "cloud" } }),
    prisma.tag.create({ data: { name: "Mobile", slug: "mobile" } }),
    prisma.tag.create({ data: { name: "Robotics", slug: "robotics" } }),
    prisma.tag.create({ data: { name: "Blockchain", slug: "blockchain" } }),
    prisma.tag.create({ data: { name: "Data Science", slug: "data-science" } }),
  ]);

  console.log(`✅ Created ${tags.length} tags`);

  // Create groups
  console.log("📦 Creating groups...");
  
  const group1 = await prisma.group.create({
    data: {
      title: "AI Chatbot for Customer Service",
      description:
        "Building an intelligent chatbot using OpenAI API to automate customer support. Looking for frontend and backend developers to join the team.",
      timeline: "3 months",
      creatorId: users[0].id,
      members: {
        create: {
          userId: users[0].id,
          role: Role.LEADER,
        },
      },
      tags: {
        create: [
          { tag: { connect: { id: tags[0].id } } }, // AI
          { tag: { connect: { id: tags[1].id } } }, // Full Stack
        ],
      },
    },
  });

  const group2 = await prisma.group.create({
    data: {
      title: "Serverless E-commerce Platform",
      description:
        "Creating a scalable e-commerce platform using AWS Lambda and Next.js. Need cloud engineers and frontend developers.",
      timeline: "4 months",
      creatorId: users[1].id,
      members: {
        create: {
          userId: users[1].id,
          role: Role.LEADER,
        },
      },
      tags: {
        create: [
          { tag: { connect: { id: tags[2].id } } }, // Cloud
          { tag: { connect: { id: tags[1].id } } }, // Full Stack
        ],
      },
    },
  });

  const group3 = await prisma.group.create({
    data: {
      title: "Cross-Platform Fitness Tracker",
      description:
        "Developing a mobile fitness tracking app with React Native. Looking for mobile developers and UI/UX designers.",
      timeline: "2 months",
      creatorId: users[2].id,
      members: {
        create: {
          userId: users[2].id,
          role: Role.LEADER,
        },
      },
      tags: {
        create: [{ tag: { connect: { id: tags[3].id } } }], // Mobile
      },
    },
  });

  const group4 = await prisma.group.create({
    data: {
      title: "Blockchain-Based Voting System",
      description:
        "Building a transparent and secure voting system using blockchain technology. Seeking blockchain developers and security experts.",
      timeline: "6 months",
      creatorId: users[3].id,
      members: {
        create: {
          userId: users[3].id,
          role: Role.LEADER,
        },
      },
      tags: {
        create: [{ tag: { connect: { id: tags[5].id } } }], // Blockchain
      },
    },
  });

  console.log("✅ Created 4 groups");

  // Add members to groups
  console.log("👥 Adding members to groups...");
  
  await prisma.groupMember.create({
    data: {
      groupId: group1.id,
      userId: users[1].id,
      role: Role.MEMBER,
    },
  });

  await prisma.groupMember.create({
    data: {
      groupId: group1.id,
      userId: users[2].id,
      role: Role.MEMBER,
    },
  });

  await prisma.groupMember.create({
    data: {
      groupId: group2.id,
      userId: users[0].id,
      role: Role.MEMBER,
    },
  });

  console.log("✅ Added members to groups");

  // Create notifications
  console.log("🔔 Creating notifications...");
  
  await prisma.notification.createMany({
    data: [
      {
        userId: users[0].id,
        type: NotificationType.JOIN,
        message: `Bob Smith joined your group "${group1.title}"`,
        groupId: group1.id,
        actorId: users[1].id,
      },
      {
        userId: users[0].id,
        type: NotificationType.JOIN,
        message: `Carol Williams joined your group "${group1.title}"`,
        groupId: group1.id,
        actorId: users[2].id,
      },
      {
        userId: users[1].id,
        type: NotificationType.JOIN,
        message: `Alice Johnson joined your group "${group2.title}"`,
        groupId: group2.id,
        actorId: users[0].id,
      },
    ],
  });

  console.log("✅ Created notifications");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - ${users.length} users created`);
  console.log(`   - ${tags.length} tags created`);
  console.log(`   - 4 groups created`);
  console.log(`   - 3 additional memberships created`);
  console.log(`   - 3 notifications created`);
  console.log("\n🔐 Test Credentials:");
  console.log("   Email: alice@devmerge.com");
  console.log("   Password: Password123");
  console.log("   (Same password for all test users)\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

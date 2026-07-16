import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

const TEST_PASSWORD = "Password123!";

const userFixtures = [
    { username: "rohan.sharma", email: "rohan.sharma@chatwave.test" },
    { username: "ananya.verma", email: "ananya.verma@chatwave.test" },
    { username: "vikram.singh", email: "vikram.singh@chatwave.test" },
    { username: "neha.patel", email: "neha.patel@chatwave.test" },
    { username: "arjun.mehta", email: "arjun.mehta@chatwave.test" },
    { username: "riya.kapoor", email: "riya.kapoor@chatwave.test" },
];

const chatTexts = [
    "Hey, how are you doing?",
    "I am good. How about you?",
    "Are we still meeting today?",
    "Yes, around 5 PM works for me.",
    "Perfect, see you then.",
    "Did you check the latest update?",
    "Yes, it looks much better now.",
    "Can you send me the details?",
    "Sure, I will share them shortly.",
    "Thanks, that really helps.",
    "What are you working on today?",
    "Just finishing the chat feature.",
    "Nice, let me know when it is ready.",
    "Will do. Talk to you soon.",
    "Sounds good!",
];

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createUniquePairs(users, count) {
    const possiblePairs = [];

    for (let first = 0; first < users.length; first += 1) {
        for (let second = first + 1; second < users.length; second += 1) {
            possiblePairs.push([users[first]._id, users[second]._id]);
        }
    }

    for (let index = possiblePairs.length - 1; index > 0; index -= 1) {
        const randomIndex = randomInt(0, index);
        [possiblePairs[index], possiblePairs[randomIndex]] = [
            possiblePairs[randomIndex],
            possiblePairs[index],
        ];
    }

    return possiblePairs.slice(0, count);
}

function buildMessageTimestamp(conversationIndex, messageIndex, messageCount) {
    const now = Date.now();
    const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;
    const conversationOffset = (conversationIndex / 4) * threeDaysInMilliseconds;
    const conversationStart = now - threeDaysInMilliseconds + conversationOffset;
    const messageSpacing = threeDaysInMilliseconds / (4 * messageCount);

    return new Date(conversationStart + (messageIndex * messageSpacing));
}

async function clearCollections() {
    await Message.deleteMany({});
    await Conversation.deleteMany({});
    await User.deleteMany({});
}

async function createUsers() {
    return Promise.all(userFixtures.map((user) => User.create({
        ...user,
        password: TEST_PASSWORD,
    })));
}

async function createConversations(users) {
    const pairs = createUniquePairs(users, 4);

    return Promise.all(pairs.map((participants) => Conversation.create({
        participants,
        lastMessageAt: new Date(),
    })));
}

async function createMessages(conversations) {
    let totalMessages = 0;

    for (let conversationIndex = 0; conversationIndex < conversations.length; conversationIndex += 1) {
        const conversation = conversations[conversationIndex];
        const messageCount = randomInt(5, 15);
        const messages = [];

        for (let messageIndex = 0; messageIndex < messageCount; messageIndex += 1) {
            const timestamp = buildMessageTimestamp(
                conversationIndex,
                messageIndex,
                messageCount,
            );

            messages.push({
                conversationId: conversation._id,
                senderId: conversation.participants[messageIndex % 2],
                text: chatTexts[(conversationIndex * 3 + messageIndex) % chatTexts.length],
                delivered: Math.random() > 0.2,
                createdAt: timestamp,
                updatedAt: timestamp,
            });
        }

        const createdMessages = await Message.insertMany(messages);
        const lastMessage = createdMessages[createdMessages.length - 1];

        await Conversation.updateOne(
            { _id: conversation._id },
            { $set: { lastMessageAt: lastMessage.createdAt } },
        );

        totalMessages += createdMessages.length;
    }

    return totalMessages;
}

async function seedDatabase() {
    try {
        await connectDB();
        await clearCollections();

        const users = await createUsers();
        const conversations = await createConversations(users);
        const messageCount = await createMessages(conversations);

        console.log("\nSeed completed successfully");
        console.log(`Users created: ${users.length}`);
        console.log(`Conversations created: ${conversations.length}`);
        console.log(`Messages created: ${messageCount}`);
        console.log(`Test login: ${users[0].email} / ${TEST_PASSWORD}`);
    } catch (error) {
        console.error("Seed failed:", error);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
}

await seedDatabase();

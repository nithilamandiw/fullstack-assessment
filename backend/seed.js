require("dotenv").config();
const mongoose = require("mongoose");
const JobRequest = require("./models/JobRequest");

const sampleJobs = [
  {
    title: "Leaking kitchen tap needs repair",
    description:
      "The kitchen tap has been dripping constantly for two days. Need a plumber to inspect and fix the issue. The tap is a mixer-type faucet.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "James Wilson",
    contactEmail: "james.wilson@example.com",
    status: "Open",
  },
  {
    title: "Rewire living room lighting",
    description:
      "Want to replace the old wiring in the living room and install modern recessed LED lighting. The room is approximately 5m x 4m.",
    category: "Electrical",
    location: "Kandy",
    contactName: "Sarah Mitchell",
    contactEmail: "sarah.m@cloudivo.com",
    status: "Open",
  },
  {
    title: "Paint exterior walls of semi-detached house",
    description:
      "Two-storey semi-detached house needs exterior walls painted. Previous paint is peeling in several areas. Scaffolding may be required.",
    category: "Painting",
    location: "Galle",
    contactName: "Robert Campbell",
    contactEmail: "r.campbell@gmail.com",
    status: "In Progress",
  },
  {
    title: "Build custom bookshelves for home office",
    description:
      "Need floor-to-ceiling bookshelves built in a home office. The wall is 3m wide and 2.4m high. Looking for a clean, modern design in oak.",
    category: "Joinery",
    location: "Glasgow",
    contactName: "Emily Brown",
    contactEmail: "emily.brown@outlook.com",
    status: "Open",
  },
  {
    title: "Fix burst pipe in bathroom",
    description:
      "A pipe behind the bathroom wall has burst and is causing water damage. Urgent repair needed. The water has been turned off at the mains.",
    category: "Plumbing",
    location: "Colombo",
    contactName: "Michael Thomson",
    contactEmail: "m.thomson@hotmail.com",
    status: "Open",
  },
  {
    title: "Install new consumer unit (fuse box)",
    description:
      "Current fuse box is outdated and does not meet modern safety standards. Need a certified electrician to install a new consumer unit with RCDs.",
    category: "Electrical",
    location: "Glasgow",
    contactName: "Laura Stewart",
    contactEmail: "laura.s@icloud.com",
    status: "Closed",
  },
  {
    title: "Repaint children's bedrooms",
    description:
      "Two children's bedrooms need fresh paint. One room is 4m x 3m and the other is 3.5m x 3m. Walls only, ceilings are fine. Child-safe paint preferred.",
    category: "Painting",
    location: "Colombo",
    contactName: "David Reid",
    contactEmail: "david.reid@yahoo.com",
    status: "Open",
  },
  {
    title: "Repair wooden garden fence",
    description:
      "Several panels of the garden fence have blown down in recent storms. Need a joiner to replace damaged panels and reinforce the posts. Approximately 8m of fencing.",
    category: "Joinery",
    location: "Galle",
    contactName: "Karen MacDonald",
    contactEmail: "k.macdonald@gmail.com",
    status: "In Progress",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await JobRequest.deleteMany({});
    console.log("Cleared existing job requests");

    const inserted = await JobRequest.insertMany(sampleJobs);
    console.log(`Inserted ${inserted.length} sample job requests`);

    await mongoose.connection.close();
    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDB();

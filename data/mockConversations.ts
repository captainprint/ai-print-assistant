export type Conversation = {
  id: string;
  name: string;
  email: string;
  initials: string;
  time: string;
  status: string;
  message: string;
};

export const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@designco.com",
    initials: "SM",
    time: "2m",
    status: "New",
    message:
      "Hi, I need business cards printed before Friday. What paper stock do you recommend?",
  },
  {
    id: "2",
    name: "Marcus Brennan",
    email: "marcus.brennan@gmail.com",
    initials: "MB",
    time: "18m",
    status: "Open",
    message:
      "Can you quote 500 flyers, double-sided, full colour?",
  },
  {
    id: "3",
    name: "Priya Nair",
    email: "priya.nair@gmail.com",
    initials: "PN",
    time: "1h",
    status: "Resolved",
    message:
      "Thanks, the postcards look great. I'll place another order soon.",
  },
  {
    id: "4",
    name: "David Lee",
    email: "david.lee@gmail.com",
    initials: "DL",
    time: "3h",
    status: "Waiting",
    message:
      "Do you offer same-day printing for foam board signs?",
  },
  {
    id: "5",
    name: "Emma Wilson",
    email: "emma.wilson@gmail.com",
    initials: "EW",
    time: "5h",
    status: "New",
    message:
      "I'm looking for sticker sheets for a small product launch.",
  },
  {
    id: "6",
    name: "Michael Carter",
    email: "michael.carter@gmail.com",
    initials: "MC",
    time: "7h",
    status: "Open",
    message:
      "Can you print retractable banner stands with our supplied artwork?",
  },
  {
    id: "7",
    name: "Olivia Harris",
    email: "olivia.harris@gmail.com",
    initials: "OH",
    time: "9h",
    status: "Waiting",
    message:
      "I'd like a quote for 1,000 brochures with matte finish.",
  },
  {
    id: "8",
    name: "Daniel Kim",
    email: "daniel.kim@gmail.com",
    initials: "DK",
    time: "Yesterday",
    status: "Resolved",
    message:
      "Everything arrived on time. Thank you for the excellent quality.",
  },
  {
    id: "9",
    name: "Sophia Martinez",
    email: "sophia.martinez@gmail.com",
    initials: "SM",
    time: "Yesterday",
    status: "Open",
    message:
      "Can I combine business cards and postcards into one order?",
  },
  {
    id: "10",
    name: "Ethan Roberts",
    email: "ethan.roberts@gmail.com",
    initials: "ER",
    time: "Yesterday",
    status: "New",
    message:
      "Do you print waterproof menu cards for restaurants?",
  },
  {
    id: "11",
    name: "Chloe Bennett",
    email: "chloe.bennett@gmail.com",
    initials: "CB",
    time: "2d",
    status: "Waiting",
    message:
      "We're redesigning our packaging labels. Can you help with material options?",
  },
  {
    id: "12",
    name: "Ryan Cooper",
    email: "ryan.cooper@gmail.com",
    initials: "RC",
    time: "2d",
    status: "Resolved",
    message:
      "The presentation folders turned out exactly as expected.",
  },
  {
    id: "13",
    name: "Grace Thompson",
    email: "grace.thompson@gmail.com",
    initials: "GT",
    time: "3d",
    status: "Open",
    message:
      "Can you print on kraft paper for invitations?",
  },
  {
    id: "14",
    name: "Noah Anderson",
    email: "noah.anderson@gmail.com",
    initials: "NA",
    time: "4d",
    status: "New",
    message:
      "I'm interested in ordering custom die-cut stickers for our laptops.",
  },
  {
    id: "15",
    name: "Isabella Scott",
    email: "isabella.scott@gmail.com",
    initials: "IS",
    time: "5d",
    status: "Resolved",
    message:
      "Received the wedding invitations. They look beautiful!",
  },
  {
    id: "16",
    name: "Liam Walker",
    email: "liam.walker@gmail.com",
    initials: "LW",
    time: "1w",
    status: "Open",
    message:
      "Can you match Pantone colours for our corporate branding?",
  },
  {
    id: "17",
    name: "Ava Green",
    email: "ava.green@gmail.com",
    initials: "AG",
    time: "1w",
    status: "Waiting",
    message:
      "I'm waiting on my designer. Can I upload artwork later?",
  },
  {
    id: "18",
    name: "Benjamin Hall",
    email: "benjamin.hall@gmail.com",
    initials: "BH",
    time: "2w",
    status: "Resolved",
    message:
      "Thanks for helping us with the trade show banners.",
  },
];
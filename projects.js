// Edit this list to add, remove or reorder projects. The page builds itself from it.
// status: "live" | "dev" (in development) | "soon". url: "#" until the real link is known (card then flips instead of opening).
// logo: small badge in assets/logos/ (initials shown if missing).
// headline + about (optional): adds a "Read more" button that opens a details pop-up.
// media: card background. { logo: "file.png" } shows a transparent logo; { image: "file.jpg" } fills the panel with a photo.
// links (optional): [{ label, href }]. First link shows on the card back; all show in the pop-up. mailto: links open the email app.
window.KAFA_PROJECTS = [
  {
    name: "Takeaway Pacific",
    tagline: "Rides, food and delivery across the islands",
    desc: "Book a ride, order from local restaurants or get shop items delivered, all in one app. Live in Tonga, with Fiji coming next.",
    url: "https://takeawaypacific.com",
    logo: "takeaway-pacific.png",
    media: { logo: "assets/logos/takeaway-pacific.png" },
    status: "live"
  },
  {
    name: "All-Pacific Sports",
    tagline: "The Pacific's sports network",
    desc: "Live scores and verified stats from every island, plus free athlete profiles and a scout portal. On the road to the 2031 Pacific Games.",
    links: [{ label: "Join the Pilot", href: "https://allpacificsports.com/#join" }],
    url: "https://allpacificsports.com",
    logo: "all-pacific-sports.png",
    media: { logo: "assets/logos/all-pacific-sports.png" },
    status: "live"
  },
  {
    name: "PacificPay",
    tagline: "Payments, bookings and payouts",
    desc: "PacificPay helps Pacific businesses get paid and stay on top of their money through licensed partners.",
    headline: "PacificPay: Payments, bookings and payouts for every Pacific business, starting in Tonga.",
    about: [
      "PacificPay helps Pacific businesses get paid and stay on top of their money through licensed partners.",
      "Launching in Tonga, then the Pacific. Part of the Kafa Tech suite of tools for Pacific businesses, alongside Pacific Exchange and Takeaway Pacific."
    ],
    url: "#", // TODO: real URL
    logo: "pacific-pay.png",
    media: { logo: "assets/logos/pacific-pay-full.png" },
    status: "dev"
  },
  {
    name: "Pacific Exchange",
    tagline: "Filling today's open rooms, tours and services",
    desc: "Pacific Exchange fills open capacity across Tonga. Powered by the Takeaway Pacific agent network.",
    headline: "Pacific Exchange: Tonga's network for filling today's open rooms, tours and services.",
    about: [
      "Pacific Exchange fills open capacity across Tonga. Hotels, guesthouses, tours and local businesses list what's available today, and a trusted network of local agents books guests at a fixed rate, first come, first served. Guests get a confirmation code with nothing to print, businesses fill empty spots, and agents earn on every booking.",
      "Powered by the Takeaway Pacific agent network. Part of the Kafa Tech suite of tools for Pacific businesses."
    ],
    url: "#",
    logo: "pacific-exchange-icon.png",
    media: { logo: "assets/logos/pacific-exchange.png" },
    status: "dev"
  },
  {
    name: "Fale Fonua",
    tagline: "Land management for Tonga's estates",
    desc: "Fale Fonua: Land management for Tonga's estates, with clear requests, decisions and records. In development.",
    headline: "Fale Fonua: Land management for Tonga's estates, from the noble's office to the ministry.",
    about: [
      "Fale Fonua helps estate holders, secretaries, government and landholders manage land in one place. It covers allotments, requests, complaints and documents, with every step recorded and every decision clear.",
      "It starts with good local land management, then opens a clear, lawful path for public projects and development. It's built for Tonga's land law, where land is leased and never sold. Fale Fonua is part of the Kafa Tech suite of tools for the Pacific, alongside PacificPay, Pacific Exchange and Takeaway Pacific."
    ],
    links: [
      { label: "Try the demo", href: "fale-fonua/" },
      { label: "Follow progress", href: "mailto:hello@kafatech.to?subject=Fale%20Fonua%20updates" }
    ],
    url: "#",
    logo: "fale-fonua-icon.png",
    media: { logo: "assets/logos/fale-fonua.png" },
    status: "dev"
  },
  {
    name: "OFA MAI",
    tagline: "Love gives you Wings",
    desc: "A dating app for the whole Pacific, connecting people across the islands and the diaspora. Coming soon.",
    headline: "OFA MAI: Love gives you Wings.",
    about: [
      "OFA MAI is a dating app for the whole Pacific, connecting people across the islands and the diaspora.",
      "Coming soon. Get early access and be among the first to join, or follow along on Facebook."
    ],
    links: [
      { label: "Get early access", href: "mailto:hello@kafatech.to?subject=OFA%20MAI%20early%20access" },
      { label: "Follow on Facebook", href: "https://www.facebook.com/OfaMai.Love/" }
    ],
    url: "#",
    logo: "ofa-mai-icon.png",
    media: { logo: "assets/logos/ofa-mai.png" },
    status: "soon"
  }
];

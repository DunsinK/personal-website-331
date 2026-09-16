
// description -> the one-liner on the card.
// details     -> the long write-up, shown only in the popup dialog.
window.PROJECTS = [
    {
        id: "aggie-agenda",
        title: "Aggie Agenda",
        description: "The smarter way to synchronize all your academic events @ Texas A&M.",
        details:
            "Aggie Agenda is a full-stack JavaScript web app that keeps every academic event at Texas A&M in one synchronized place instead of scattered across separate calendars. It is live at aggieagenda.com, and the application code lives in the AggieAgenda GitHub organization.",
        tags: ["JavaScript", "Full-stack (repo in AggieAgenda org)"],
        websiteUrl: "https://aggieagenda.com",
        repoUrl: "https://github.com/AggieAgenda/App",
        featured: true,
        cover: "./photos/aggie-agenda/aggieagenda_logo.jpg",
        photos: [
            { src: "./photos/aggie-agenda/aggieagenda_logo.jpg", caption: "Aggie Agenda logo" }
        ]
    },
    {
        id: "real-time-talking-coach",
        title: "Real Time Talking Coach",
        description: "React + TypeScript + Vite web app (template-based) deployed on Vercel.",
        details:
            "A React and TypeScript front end, bundled with Vite and deployed on Vercel. It started from the Vite React-TS template and was built out from there into a coaching interface that responds while you are still talking.",
        tags: ["React", "TypeScript", "Vite", "Vercel"],
        demoUrl: "https://rtc-tidal26.vercel.app",
        repoUrl: "https://github.com/DunsinK/RTC_Tidal26",
        featured: true,
        emoji: "🎤",
        photos: [] 
    },
    {
        id: "instagram-unfollowers",
        title: "Instagram Unfollowers",
        description: "Privacy-first client-side tool to analyze Instagram data exports and see unfollowers.",
        details:
            "Upload the data export Instagram gives you and the tool compares your followers against your following list to surface who does not follow back. Everything runs in the browser: the parsing is Python executed client-side through PyScript, so no account data is ever sent to a server. The interface is plain HTML and CSS, deployed on Vercel.",
        emoji: "📸",
        tags: ["HTML", "CSS", "PyScript (Python in-browser)", "Vercel"],
        demoUrl: "https://instagram-unfollowers-gray.vercel.app",
        repoUrl: "https://github.com/DunsinK/InstagramUnfollowers",
        featured: true,
        photos: [] 
    },
    {
        id: "6-to-7-security",
        title: "Hitachi AI-Powered Regulatory Document Classifier",
        description: "TAMU Datathon: AI-powered regulatory document classifier (Hitachi).",
        details:
            "Built for the Hitachi challenge at TAMU Datathon. The app takes regulatory documents and classifies them with a machine learning model, served through a Python Flask backend and deployed on Vercel.",
        emoji: "🛡️",
        tags: ["Python", "Flask", "AI/ML"],
        demoUrl: "https://67-security.vercel.app",
        repoUrl: "https://github.com/DunsinK/67Security",
        photos: [] 
    },
    {
        id: "typeracer",
        title: "TypeRacer",
        description: "TypeRacer clone using API calls to fetch randomized text + WPM/time stats.",
        details:
            "A TypeRacer clone in plain HTML and JavaScript. Each round pulls a randomized passage from an API, then tracks keystrokes as you type to report words per minute and elapsed time at the end of the run.",
        emoji: "⌨️",
        tags: ["HTML", "JavaScript"],
        repoUrl: "https://github.com/DunsinK/TypeRacer",
        photos: [] 
    },
];

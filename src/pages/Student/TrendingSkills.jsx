import React, { useState } from "react";
import { ExternalLink, Play, TrendingUp, Zap, Star, Clock } from "lucide-react";

const SKILLS = [
  {
    id: 1,
    title: "Prompt Engineering",
    subtitle: "Master AI Communication",
    category: "AI / GenAI",
    categoryColor: "from-purple-500 to-pink-500",
    badgeBg: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
    level: "Beginner Friendly",
    duration: "3 hrs",
    trending: true,
    image: "/skills/prompt_engineering.png",
    youtubeUrl: "https://youtu.be/SpazTFm-e_8?si=MkTyJJVKTAhZFoal",
    description: "Learn to craft powerful prompts for ChatGPT, Gemini & more to 10x your productivity.",
  },
  {
    id: 2,
    title: "Machine Learning",
    subtitle: "with Python & TensorFlow",
    category: "AI / ML",
    categoryColor: "from-blue-500 to-cyan-500",
    badgeBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    level: "Intermediate",
    duration: "12 hrs",
    trending: true,
    image: "/skills/machine_learning.png",
    youtubeUrl: "https://youtu.be/7eh4d6sabA0?si=d3JFc0Zk8__4M4OD",
    description: "Full ML crash course — regression, classification, neural nets with hands-on projects.",
  },
  {
    id: 3,
    title: "DevOps & CI/CD",
    subtitle: "Docker, GitHub Actions",
    category: "DevOps",
    categoryColor: "from-orange-500 to-red-500",
    badgeBg: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
    level: "Intermediate",
    duration: "8 hrs",
    trending: true,
    image: "/skills/devops.png",
    youtubeUrl: "https://youtu.be/0yWAtQ6wYNM?si=lnDUrHZqJ6cBUf_y",
    description: "Automate deployments with Docker containers, GitHub Actions, and CI/CD pipelines.",
  },
  {
    id: 4,
    title: "Cloud Computing",
    subtitle: "AWS & Azure Fundamentals",
    category: "Cloud",
    categoryColor: "from-indigo-500 to-violet-500",
    badgeBg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
    level: "Beginner",
    duration: "10 hrs",
    trending: true,
    image: "/skills/cloud_computing.png",
    youtubeUrl: "https://youtu.be/2LaAJq1lB1Q?si=v7thXdzS907hLVx-",
    description: "Understand cloud architecture, services and deployment models used in the industry.",
  },
  {
    id: 5,
    title: "React.js",
    subtitle: "Full Stack Web Development",
    category: "Web Dev",
    categoryColor: "from-cyan-500 to-blue-500",
    badgeBg: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300",
    level: "Beginner Friendly",
    duration: "11 hrs",
    trending: true,
    image: "/skills/reactjs.png",
    youtubeUrl: "https://youtu.be/RGKi6LSPDLU?si=7DFRrfbw0nFthjgK",
    description: "Build modern, fast UIs with React, hooks, state management and component design.",
  },
  {
    id: 6,
    title: "Cybersecurity",
    subtitle: "Ethical Hacking & Defense",
    category: "Security",
    categoryColor: "from-green-500 to-emerald-500",
    badgeBg: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
    level: "Intermediate",
    duration: "9 hrs",
    trending: true,
    image: "/skills/cybersecurity.png",
    youtubeUrl: "https://youtu.be/U_P23SqJaDc?si=TeVG3puSCEn4CoYU",
    description: "Cybersecurity fundamentals — threat models, penetration testing, and secure coding.",
  },
  {
    id: 7,
    title: "Data Science & SQL",
    subtitle: "Analytics & Visualization",
    category: "Data",
    categoryColor: "from-yellow-500 to-orange-500",
    badgeBg: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
    level: "Beginner",
    duration: "15 hrs",
    trending: true,
    image: "/skills/data_science.png",
    youtubeUrl: "https://youtu.be/ua-CiDNNj30?si=x7SL7JwtqKQDMooo",
    description: "Master SQL queries, pandas, matplotlib and real-world data analysis workflows.",
  },
  {
    id: 8,
    title: "System Design",
    subtitle: "Interview Mastery",
    category: "Architecture",
    categoryColor: "from-slate-500 to-gray-600",
    badgeBg: "bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300",
    level: "Advanced",
    duration: "6 hrs",
    trending: true,
    image: "/skills/system_design.png",
    youtubeUrl: "https://youtu.be/xpDnVSmNFX0?si=faAjOYlt7aDxcvN5",
    description: "Scale systems like FAANG — load balancers, databases, caches and microservices.",
  },
  {
    id: 9,
    title: "Kubernetes",
    subtitle: "Container Orchestration",
    category: "DevOps",
    categoryColor: "from-blue-600 to-indigo-600",
    badgeBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    level: "Advanced",
    duration: "7 hrs",
    trending: true,
    image: "/skills/kubernetes.png",
    youtubeUrl: "https://youtu.be/X48VuDVv0do?si=Z_lNVU2ixe4iqO1U",
    description: "Orchestrate Docker containers at scale with Kubernetes pods, services and deployments.",
  },
  {
    id: 10,
    title: "TypeScript",
    subtitle: "Type-Safe JavaScript",
    category: "Backend",
    categoryColor: "from-blue-400 to-blue-600",
    badgeBg: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    level: "Intermediate",
    duration: "5 hrs",
    trending: false,
    image: "/skills/typescript.png",
    youtubeUrl: "https://youtu.be/30LWjhZzg50?si=yFACKD4-fQFsg6UN",
    description: "Write safer, scalable JavaScript with TypeScript types, generics and decorators.",
  },
  {
    id: 11,
    title: "Node.js",
    subtitle: "Server-Side JavaScript",
    category: "Backend",
    categoryColor: "from-green-600 to-teal-600",
    badgeBg: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
    level: "Intermediate",
    duration: "8 hrs",
    trending: false,
    image: "/skills/nodejs.png",
    youtubeUrl: "https://youtu.be/Oe421EPjeBE?si=OY47jBrWqU0ml79N",
    description: "Build fast REST APIs and backend services with Node.js, Express and async patterns.",
  },
  {
    id: 12,
    title: "Flutter",
    subtitle: "Cross-Platform Mobile Dev",
    category: "Mobile",
    categoryColor: "from-sky-400 to-blue-600",
    badgeBg: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
    level: "Beginner Friendly",
    duration: "10 hrs",
    trending: true,
    image: "/skills/flutter.png",
    youtubeUrl: "https://youtu.be/VPvVD8t02U8?si=wlkQU4WWnh0oNTFK",
    description: "Build stunning iOS & Android apps from a single codebase using Flutter and Dart.",
  },
];

const CATEGORIES = ["All", "AI / GenAI", "AI / ML", "DevOps", "Cloud", "Web Dev", "Security", "Data", "Architecture", "Backend", "Mobile"];

const SkillCard = ({ skill }) => {
  const [hovered, setHovered] = useState(false);

  const openVideo = () => {
    window.open(skill.youtubeUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={openVideo}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={skill.image}
          alt={skill.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${skill.categoryColor} opacity-40 group-hover:opacity-60 transition-opacity duration-300`} />

        {/* Play button */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-xl">
            <Play className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Trending badge */}
        {skill.trending && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow">
            <TrendingUp className="w-3 h-3" /> Trending
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${skill.badgeBg}`}>
            {skill.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{skill.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{skill.subtitle}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">{skill.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{skill.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Star className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" />
            <span>{skill.level}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
            <span>Watch</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

const TrendingSkills = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = SKILLS.filter(s => {
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Trending Skills</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Top IT skills hiring managers want in 2026 · Click any card to watch</p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-6 mt-4 mb-8">
          {[
            { label: "Curated Courses", value: "12" },
            { label: "Free on YouTube", value: "100%" },
            { label: "Trending Skills", value: "All In-Demand" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Search + Filter row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72 shadow-sm"
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No skills found matching "{search}"</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-12">
          All videos open on YouTube · Free to watch · No sign-in required
        </p>
      </div>
    </div>
  );
};

export default TrendingSkills;

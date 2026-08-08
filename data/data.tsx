import { FaXTwitter } from "react-icons/fa6";
import { BsGithub, BsGlobe, BsLinkedin } from "react-icons/bs";
import { TfiEmail } from "react-icons/tfi";
import { SiGoogleforms } from "react-icons/si";
import Pomero from "@/public/pomero.png";
import Sticko from "@/public/sticko.png";
import Kuchbhi from "@/public/kuchbhi.png";
export const DATA = {
  socialButtons: [
    {
      link: "https://x.com/justtayyabkhxn",
      icon: FaXTwitter,
      message: "Twitter",
    },
    {
      link: "https://github.com/justtayyabkhxn",
      icon: BsGithub,
      message: "GitHub",
    },
    {
      link: "https://www.linkedin.com/in/justtayyabkhan/",
      icon: BsLinkedin,
      message: "LinkedIn",
    },
    {
      link: "mailto:tayyabkhangk4734@gmail.com",
      icon: TfiEmail,
      message: "Email",
    },
    // {
    //   link: "https://www.upwork.com/freelancers/~01f29bf792f063bb1b?mp_source=share",
    //   icon: FaUpwork,
    //   message: "Upwork",
    // },
    {
      link: "https://drive.google.com/file/d/13NazEPxb7xMuIE2_yG5yK_8uQ7tu7JT4/view?usp=sharing",
      icon: SiGoogleforms,
      message: "Resume",
    },
  ],
  skills: {
    languages: ["C++", "Java", "Python"],
    web: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "MySQL",
      "MongoDB",
      "PostgreSQL",
    ],
    cms: ["Shopify", "Webflow", "WordPress"],
    tools: ["Git", "GitHub", "Postman", "Docker", "Prisma", "WebSockets"],
  },

  ProfessionalProjects: [
    {
      title: "VOLUME",
      dates: "Oct-Nov 2025",
      href: "https://www.volume.in/",
      active: true,
      description:
        "Built VOLUME's official website and CMS — immersive animations via Framer Motion and GSAP, with a drag-and-drop admin dashboard backed by Node.js, Express, and MongoDB.",
      technologies: [
        "Next.js",
        "Tailwind CSS",
        "Framer Motion",
        "Node.js",
        "Express.js",
        "MongoDB",
      ],
      links: [
        {
          type: "Website",
          href: "https://www.volume.in/",
          icon: <BsGlobe className="size-3" />,
        },
      ],
      image: "",
      video: "/volume.mp4",
    },
  ],

  ClientProjects: [
    {
      title: "Bharatiyam",
      dates: "July 2025",
      href: "https://www.bhrtym.com/",
      active: true,
      description:
        "Responsive business portfolio built with React and Tailwind CSS, featuring smooth animations and SEO best practices for a New Delhi-based client.",
      technologies: ["ReactJS", "Tailwind CSS"],
      links: [
        {
          type: "Website",
          href: "https://www.bhrtym.com/",
          icon: <BsGlobe className="size-3" />,
        },
      ],
      image: "",
      video: "/bhrtym.mp4",
    },
    // {
    //   title: "Angies HomeStay",
    //   dates: "August 2025",
    //   href: "https://www.angieshomestays.com/",
    //   active: false,
    //   description:
    //     "Elegant and responsive hotel website built with React and Tailwind CSS, featuring immersive visuals, seamless booking experience, and SEO optimization for a luxury hospitality client.",
    //   technologies: ["ReactJS", "Tailwind CSS"],
    //   links: [
    //     {
    //       type: "Website",
    //       href: "https://www.angieshomestays.com/",
    //       icon: <BsGlobe className="size-3" />,
    //     },
    //   ],
    //   image: "",
    //   video: "/angies.mp4",
    // },
    {
      title: "Symphonies Life",
      dates: "July 2025",
      href: "https://symphonieslife.com/",
      active: true,
      description:
        "Custom Shopify storefront with Liquid templates, optimised product pages, and SEO-friendly architecture for a lifestyle and wellness brand.",
      technologies: ["Shopify", "Liquid"],
      links: [
        {
          type: "Website",
          href: "https://symphonieslife.com/",
          icon: <BsGlobe className="size-3" />,
        },
      ],
      image: "",
      video: "/symphonies.mp4",
    },
    {
      title: "ATLAS",
      dates: "June 2025",
      active: true,
      href: "https://atlas.com/",
      description:
        "Modern WordPress landing page with custom Elementor sections, performance optimisations, and SEO-friendly architecture tailored to the client’s brand.",
      technologies: ["WordPress", "Elementor", "PHP", "CSS", "JavaScript"],
      links: [
        {
          type: "Website",
          href: "https://atlas.com/",
          icon: <BsGlobe className="size-3" />,
        },
      ],
      image: "",
      video: "/atlas.mp4",
    },
  ],
  Projects: [
    {
      title: "watchlr",
      dates: "June 2026",
      href: "https://watchlr.justtayyabkhan.com/",
      active: true,
      category: "personal",
      description:
        "A sleek, modern movie and show recommendation platform with AI-powered suggestions, profile-based taste tracking, and a premium UI designed to feel effortlessly stylish, intuitive, and immersive.",
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "MongoDB"

      ],
       links: [
        {
          type: "Website",
          href: "https://watchlr.justtayyabkhan.com/",
          icon: <BsGlobe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/justtayyabkhxn/watchlr/",
          icon: <BsGithub className="size-3" />,
        },
      ],
      image: "/watchlr.png",
      video: "",
    },
    {
      title: "wePass",
      dates: "May 2026",
      href: "https://wepass.vercel.app/",
      active: true,
      category: "personal",
      description:
        "A zero-knowledge password manager that encrypts credentials client-side using AES-256-GCM and PBKDF2, ensuring the server never has access to plaintext user data.",
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "TanStack",
        "Prisma",
        "PostgreSQL",
        "Web Crypto API",
      ],
       links: [
        {
          type: "Website",
          href: "https://wepass.vercel.app/",
          icon: <BsGlobe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/justtayyabkhxn/wepass/",
          icon: <BsGithub className="size-3" />,
        },
      ],
      image: "/wepass.png",
      video: "",
    },
    {
      title: "FarazPsd Portfolio",
      dates: "April 2026",
      href: "https://farazpsd.vercel.app/",
      active: true,
      category: "personal",
      description:
        "A modern, responsive portfolio website for a creative designer, showcasing work, skills, and contact information — built with Next.js and Tailwind CSS with a strong focus on UI/UX and performance.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
      links: [
        {
          type: "Website",
          href: "https://farazpsd.vercel.app/",
          icon: <BsGlobe className="size-3" />,
        },
        // {
        //   type: "Source",
        //   href: "https://github.com/your-repo-link",
        //   icon: <BsGithub className="size-3" />,
        // },
      ],
      image: "/farazpsd.png", // update this if you have a proper screenshot
      video: "",
    },
    {
      title: "Find My Tutor Live",
      dates: "May 2026-Current",
      href: "https://live.findmytutorindia.com/",
      active: true,
      category: "freelance",
      description:
        "A full live-learning platform for real-time tuition sessions with WebRTC-based tutor-student connection, session creation, payments, recordings, chat, notes upload, and classroom management.",
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Node.js",
        "MongoDB",
        "WebRTC",
        "Web Sockets",
      ],
      links: [
        {
          type: "Website",
          href: "https://live.findmytutorindia.com/",
          icon: <BsGlobe className="size-3" />,
        },
        // {
        //   type: "Source",
        //   href: "https://github.com/justtayyabkhxn/findmytutorpanel/",
        //   icon: <BsGithub className="size-3" />,
        // },
      ],
      image: "/fmt-live.png",
      video: "",
    },
    {
      title: "Find My Tutor India",
      dates: "April 2026-Current",
      href: "https://findmytutorindia.com/",
      active: true,
      category: "freelance",
      description:
        "A beautifully crafted tutor discovery website with a polished landing experience, tutor profiles, search, and a powerful admin panel to manage listings, content, and platform operations.",
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Node.js",
        "MongoDB",
      ],
      links: [
        {
          type: "Website",
          href: "https://findmytutorindia.com/",
          icon: <BsGlobe className="size-3" />,
        },
        // {
        //   type: "Source",
        //   href: "https://github.com/justtayyabkhxn/findmytutorpanel/",
        //   icon: <BsGithub className="size-3" />,
        // },
      ],
      image: "/fmt.png",
      video: "",
    },
    {
      title: "MyBudgetory",
      dates: "May 2025-Current",
      href: "https://mybudgetory.vercel.app/",
      active: true,
      category: "personal",
      description:
        "Personal finance tracker with transaction management, monthly analytics, and an automated WhatsApp nudge for outstanding debts — Next.js and MongoDB.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB"],
      links: [
        {
          type: "Website",
          href: "https://mybudgetory.vercel.app/",
          icon: <BsGlobe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/justtayyabkhxn/mybudgetory/",
          icon: <BsGithub className="size-3" />,
        },
      ],
      image: "/mybudgetory.png",
      video: "",
    },
    {
      title: "TrackR",
      dates: "Aug-Oct 2024",
      active: true,
      category: "personal",
      description:
        "Platform for reporting and reclaiming lost items — location-based search, admin moderation, and secure auth. React, Node.js, Express, MongoDB.",
      technologies: ["Node.js", "React", "MongoDB", "Express"],
      links: [
        {
          type: "Source",
          href: "https://github.com/justtayyabkhxn/TrackR",
          icon: <BsGithub className="size-3" />,
        },
      ],
      image: "/trackit.png",
      video: "",
    },

    {
      title: "Sticko",
      href: "https://stickonotes.vercel.app/",
      active: true,
      category: "personal",
      description:
        "Notes and to-do PWA with task management and data export, fully responsive and offline-capable — Next.js, TypeScript, MongoDB.",
      technologies: [
        "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Express", "MongoDB",
      ],
      links: [
        {
          type: "Website",
          href: "https://https://stickonotes.vercel.app/",
          icon: <BsGlobe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/justtayyabkhxn/sticko/",
          icon: <BsGithub className="size-3" />,
        },
      ],
      image: Sticko,
      video: "",
    },
    {
      title: "Pomero",
      href: "https://justtayyabkhxn.github.io/pomero/",
      active: true,
      archived: true,
      category: "personal",
      description:
        "Pomodoro timer with customisable intervals, task tracking, and progress reports — HTML/CSS/JS.",
      technologies: ["HTML", "CSS", "JavaScript"],
      links: [
        {
          type: "Website",
          href: "https://justtayyabkhxn.github.io/pomero/",
          icon: <BsGlobe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/justtayyabkhxn/pomero/",
          icon: <BsGithub className="size-3" />,
        },
      ],
      image: Pomero,
      video: "",
    },
    {
      title: "Instant QR Code Generator",
      href: "https://myqr-gen.vercel.app/",
      dates: "",
      active: true,
      category: "personal",
      description:
        "Instant QR code generator for URLs and text, with optional account-based customisation — Next.js, TypeScript, MongoDB.",
      technologies: ["Next.js", "TypeScript", "MongoDB", "TailwindCSS,JWTs"],
      links: [
        {
          type: "Website",
          href: "https://myqr-gen.vercel.app/",
          icon: <BsGlobe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/justtayyabkhxn/myqr-gen",
          icon: <BsGithub className="size-3" />,
        },
      ],
      image: "/qr-gen.png",
      video: "",
    },
    {
      title: "Restaurant Landing Page",
      href: "https://justtayyabkhxn.github.io/kuchbhirestaurant",
      dates: "",
      active: true,
      archived: true,
      category: "personal",
      description:
        "Restaurant landing page with menu display and location info — HTML/CSS/JS.",
      technologies: ["HTML", "CSS", "JavaScript"],
      links: [
        {
          type: "Website",
          href: "https://justtayyabkhxn.github.io/kuchbhirestaurant",
          icon: <BsGlobe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/justtayyabkhxn/kuchbhirestaurant",
          icon: <BsGithub className="size-3" />,
        },
      ],
      image: Kuchbhi,
      video: "",
    },
    {
      title: "My Portfolio",
      href: "https://justtayyabkhxn.github.io/portfolio/",
      dates: "",
      active: true,
      archived: true,
      category: "personal",
      description:
        "Early HTML/CSS portfolio website showcasing initial projects.",
      technologies: ["HTML", "CSS", "JavaScript"],
      links: [
        {
          type: "Website",
          href: "https://justtayyabkhxn.github.io/portfolio/",
          icon: <BsGlobe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/justtayyabkhxn/portfolio",
          icon: <BsGithub className="size-3" />,
        },
      ],
      image: "/portfolio.png",
      video: "",
    },
    {
      title: "WhatsTheWeather",
      href: "https://justtayyabkhxn.github.io/whatstheweather/",
      dates: "",
      active: true,
      archived: true,
      category: "personal",
      description:
        "Real-time weather app with location-based forecasts — HTML/CSS/JS.",
      technologies: ["HTML", "CSS", "JavaScript"],
      links: [
        {
          type: "Website",
          href: "https://justtayyabkhxn.github.io/whatstheweather",
          icon: <BsGlobe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/justtayyabkhxn/whatstheweather",
          icon: <BsGithub className="size-3" />,
        },
      ],
      image: "/weather.png",
      video: "",
    },
    {
      title: "Plate-Picker",
      href: "https://justtayyabkhxn.github.io/plate-picker",
      dates: "",
      active: true,
      archived: true,
      category: "personal",
      description:
        "Food recommendation app that suggests meals based on preferences and cravings — HTML/CSS/JS.",
      technologies: ["HTML", "CSS", "JavaScript"],
      links: [
        {
          type: "Website",
          href: "https://justtayyabkhxn.github.io/plate-picker",
          icon: <BsGlobe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/justtayyabkhxn/plate-picker",
          icon: <BsGithub className="size-3" />,
        },
      ],
      image: "/platepicker.png",
      video: "",
    },
  ],
  experience: [
    {
      company: "VOLUME Creative Agency",
      href: "https://www.volume.in/",
      role: "Creative Web Developer",
      location: "Connaught Place, New Delhi",
      logoUrl: "/volume.png",
      start: "July-2025",
      end: "Present",
    },
  ],
  education: [
    {
      school: "Aligarh Muslim University",
      href: "https://www.amu.ac.in/",
      degree: "Master in Computer Applications",
      location: "Aligarh, UP",
      logoUrl: "/amu.png",
      start: "2023",
      end: "2025",
    },
    {
      school: "Aligarh Muslim University",
      href: "https://www.amu.ac.in/",
      degree: "Bachelors in Science(Physics)",
      location: "Aligarh, UP",
      logoUrl: "/amu.png",
      start: "2020",
      end: "2023",
    },
  ],
};

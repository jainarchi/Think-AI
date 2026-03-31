/**
 * POWER_PROMPTS_DATA
 * Categorized Power Prompts for the Explore Component.
 * Each prompt is engineered to provide professional, deep-dive results.
 */

// [[dev , {}]]


export const Power_Promts_Data = {
  development: [
    {
      title: "Explain React Basics",
      powerPrompt: "Explain React 4/5 core concepts (Hooks, Props, State, and Server Components). Use simple analogies for a beginner."
    },
    {
      title: "Fix My Bug",
      powerPrompt: "I am facing a logical or syntax error in the following code. Please: 1. Identify the bug. 2. Explain why it happened. 3. Provide a patched, optimized version of the code. 4. Suggest a best practice to avoid this in the future."
    },
    {
      title: "Folder Architecture",
      powerPrompt: "Design a professional and scalable folder structure for a MERN stack application. Ensure it follows Clean Architecture principles (Separation of concerns). Provide a brief explanation of why this structure is efficient for production."
    },
    {
      title: "Optimize Code",
      powerPrompt: "Analyze the provided code for time and space complexity ($O(n)$). Suggest optimizations to improve performance and readability without changing the core functionality."
    }
  ],

  marketIntelligence: [
    {
      title: "Latest Tech Trends 2026",
      powerPrompt: "Use web search to identify the top 5 breakout technology trends in March 2026. Focus on Web Development, AI, and Cloud Computing. Provide a summary of how these will impact developers this year."
    },
    {
      title: "Compare Libraries",
      powerPrompt: "Perform a web search to compare the latest versions of [Library A] and [Library B] as of 2026. Compare them based on Bundle Size, Community Support, and Ease of Use in modern frameworks."
    },
    {
      title: "Find Open Source Projects",
      powerPrompt: "Search the web for trending Open Source projects on GitHub related to [Topic/Technology] in 2026. Suggest 3 projects where a contributor can start helping."
    }
  ],

  careerStrategy: [
    {
      title: "Resume Review",
      powerPrompt: "Act as a Senior Tech Recruiter. Review my resume details for a [Job Role] position. Identify gaps, suggest stronger action verbs, and ensure the layout is ATS-friendly."
    },
    {
      title: "Mock Technical Interview",
      powerPrompt: "Act as an interviewer for a Frontend Developer role. Ask me 3 challenging questions based on React and JavaScript, one at a time. Wait for my response before moving to the next question."
    },
    {
      title: "Make LinkedIn Bio",
      powerPrompt: "Write a professional, high-impact LinkedIn headline and 'About' section for a Full Stack Developer. Highlight expertise in MERN stack and passion for building AI-integrated apps."
    }
  ],

  productivity: [
    {
      title: "Brainstorm Startup Ideas",
      powerPrompt: "Generate 5 innovative startup ideas based on current 2026 market gaps in the [Industry] sector. For each idea, provide a unique value proposition and a basic tech stack."
    },
    {
      title: "Task Prioritizer",
      powerPrompt: "Review my list of tasks and use the Eisenhower Matrix (Urgent/Important) to prioritize them. Explain why certain tasks should be delegated or deleted."
    },
    {
      title: "Daily Standup Summary",
      powerPrompt: "Based on my progress yesterday and my plans for today, write a professional 3-point daily standup update that I can share on Slack or Teams."
    }
  ]
};


export const getPowerPromptByTitle = (title) => {
  // Flatten all categories into one array to search
  const allPrompts = Object.values(Power_Promts_Data).flat();
  const match = allPrompts.find(p => p.title === title);
  return match ? match.powerPrompt : title;                  // return power prompt if found, else return title
};
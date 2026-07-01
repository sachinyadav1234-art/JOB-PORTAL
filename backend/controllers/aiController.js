const Groq = require('groq-sdk');
const axios = require('axios');
const User = require('../models/User');
const Job = require('../models/Job');
const VerifiedJob = require('../models/VerifiedJob');
const UpcomingEvent = require('../models/UpcomingEvent');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─────────────────────────────────────
// @route   GET /api/ai/search-jobs
// @access  Private (student only)
// ─────────────────────────────────────
const searchRealJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.skills || user.skills.length === 0) {
      return res.status(400).json({
        message: 'Please add your skills in profile first'
      });
    }

    // skills se search query banao
    const skillsText = user.skills.join(' ');
    const searchQuery = `${skillsText} fresher jobs India`;

    // Serper API se Google search karo
    const serperRes = await axios.post(
      'https://google.serper.dev/search',
      { q: searchQuery, num: 10 },
      {
        headers: {
          'X-API-KEY': process.env.SERPER_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const searchResults = serperRes.data.organic || [];

    if (searchResults.length === 0) {
      return res.json({ success: true, jobs: [] });
    }

    // raw results AI ko bhejo cleanup ke liye
    const rawData = searchResults.map(r => ({
      title: r.title,
      link: r.link,
      snippet: r.snippet
    }));

    const prompt = `You are a job listing extractor. Below are raw Google search results for job listings.
Extract and clean up the job information. For each result, identify if it's actually a job listing.

Search Results:
${JSON.stringify(rawData)}

Return ONLY a JSON array (no extra text) in this exact format:
[{"title": "job title", "company": "company name if found else Unknown", "snippet": "short 1 line description", "link": "the original link", "isJob": true}]

Only include items where isJob is true (actual job postings, not articles or unrelated pages).`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3
    });

    let aiResponse = completion.choices[0].message.content;
    aiResponse = aiResponse.replace(/```json|```/g, '').trim();

    const cleanedJobs = JSON.parse(aiResponse);

    res.json({ success: true, jobs: cleanedJobs });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Job search failed: ' + error.message });
  }
};

// ─────────────────────────────────────
// @route   GET /api/ai/match-jobs
// @access  Private (student only)
// ─────────────────────────────────────
const matchJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.skills || user.skills.length === 0) {
      return res.status(400).json({
        message: 'Please add your skills in profile first'
      });
    }

    const jobs = await Job.find({});
    if (jobs.length === 0) {
      return res.json({ success: true, matches: [] });
    }

    const jobList = jobs.map(j => ({
      id: j._id,
      title: j.title,
      company: j.company,
      description: j.description,
      skills: j.skills
    }));

    const prompt = `You are an AI job matcher. We have a candidate with these skills: ${JSON.stringify(user.skills)}.
Below are the available job listings:
${JSON.stringify(jobList)}

Compare the candidate's skills with each job. Calculate a match percentage (0 to 100) and provide a short 1-line reason explaining the match based on overlapping skills or experience.
Only include jobs that have a match percentage of 40% or higher.
Sort the matches by match percentage in descending order.

Return ONLY a JSON object (no extra markdown blocks or text) with a "matches" key containing an array of objects in this exact format:
{
  "matches": [
    {
      "jobId": "the job ID",
      "matchPercent": 85,
      "reason": "Reason for the match"
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2
    });

    let aiResponse = completion.choices[0].message.content;
    aiResponse = aiResponse.replace(/```json|```/g, '').trim();

    const parsed = JSON.parse(aiResponse);
    const rawMatches = parsed.matches || [];

    const matches = rawMatches.map(m => {
      const job = jobs.find(j => j._id.toString() === m.jobId);
      return {
        job,
        matchPercent: m.matchPercent,
        reason: m.reason
      };
    }).filter(m => m.job !== undefined);

    res.json({ success: true, matches });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Job matching failed: ' + error.message });
  }
};

// ─────────────────────────────────────
// @route   GET /api/ai/verified-fresher-jobs
// @access  Private (student only)
// ─────────────────────────────────────
const getVerifiedFresherJobs = async (req, res) => {
  try {
    const { refresh } = req.query;

    if (refresh !== 'true') {
      const cachedJobs = await VerifiedJob.find({}).sort({ verifiedAt: -1 }).limit(30);
      if (cachedJobs.length > 0) {
        return res.json({ success: true, count: cachedJobs.length, jobs: cachedJobs });
      }
    }

    // Call Serper API for real-world fresher job postings using simple queries
    const queries = [
      'fresher software engineer jobs India 2026',
      'software developer internship India 2026',
      'BTech CSE IT entry level hiring India'
    ];
    
    let allSearchResults = [];
    for (const q of queries) {
      try {
        const serperRes = await axios.post(
          'https://google.serper.dev/search',
          { q, num: 10 },
          {
            headers: {
              'X-API-KEY': process.env.SERPER_API_KEY,
              'Content-Type': 'application/json'
            }
          }
        );
        if (serperRes.data.organic) {
          allSearchResults.push(...serperRes.data.organic);
        }
      } catch (err) {
        console.error(`Serper query "${q}" failed:`, err.message);
      }
    }

    // Deduplicate by link
    const uniqueResults = [];
    const seenLinks = new Set();
    for (const item of allSearchResults) {
      if (!seenLinks.has(item.link)) {
        seenLinks.add(item.link);
        uniqueResults.push(item);
      }
    }

    if (uniqueResults.length === 0) {
      return res.json({ success: true, count: 0, jobs: [] });
    }

    const rawData = uniqueResults.map(r => ({
      title: r.title,
      link: r.link,
      snippet: r.snippet
    }));

    const prompt = `You are an expert tech job verifier. Review these search results for software fresher/internship positions in India:
${JSON.stringify(rawData)}

For each result:
1. Verify if it is an actual fresher job or internship listing in India.
2. Extract the job title, company name, location, and key skills required.
3. Clean the title and description (keep description short: 1-2 sentences).
4. Verify if the application link is direct and official (e.g. Lever, Greenhouse, Ashby, Workday, or company career portal).

Return ONLY a JSON array of verified jobs (no markdown blocks, no text around it) in this format:
[
  {
    "title": "Job Title",
    "company": "Company Name",
    "description": "Short description of the job and requirements",
    "location": "Location (e.g., Bangalore, Remote)",
    "jobType": "internship" or "full-time",
    "skills": ["Skill1", "Skill2"],
    "link": "https://..."
  }
]`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2
    });

    let aiResponse = completion.choices[0].message.content;
    aiResponse = aiResponse.replace(/```json|```/g, '').trim();

    const jobsList = JSON.parse(aiResponse);

    const savedJobs = [];
    for (const job of jobsList) {
      try {
        const updated = await VerifiedJob.findOneAndUpdate(
          { link: job.link },
          job,
          { upsert: true, new: true }
        );
        savedJobs.push(updated);
      } catch (err) {
        console.error('Error saving verified job:', err.message);
      }
    }

    res.json({ success: true, count: savedJobs.length, jobs: savedJobs });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch verified jobs: ' + error.message });
  }
};

// ─────────────────────────────────────
// @route   GET /api/ai/job-fairs-mass-hiring
// @access  Private (student only)
// ─────────────────────────────────────
const getJobFairsAndMassHiring = async (req, res) => {
  try {
    const { refresh } = req.query;

    if (refresh !== 'true') {
      const cachedEvents = await UpcomingEvent.find({}).sort({ fetchedAt: -1 }).limit(20);
      if (cachedEvents.length > 0) {
        return res.json({ success: true, count: cachedEvents.length, events: cachedEvents });
      }
    }

    // Call Serper API for events using simple queries
    const queries = [
      'mass hiring IT freshers India 2026',
      'off campus drive CSE IT 2026 India',
      'upcoming tech job fairs India 2026'
    ];
    
    let allSearchResults = [];
    for (const q of queries) {
      try {
        const serperRes = await axios.post(
          'https://google.serper.dev/search',
          { q, num: 10 },
          {
            headers: {
              'X-API-KEY': process.env.SERPER_API_KEY,
              'Content-Type': 'application/json'
            }
          }
        );
        if (serperRes.data.organic) {
          allSearchResults.push(...serperRes.data.organic);
        }
      } catch (err) {
        console.error(`Serper event query "${q}" failed:`, err.message);
      }
    }

    // Deduplicate by link
    const uniqueResults = [];
    const seenLinks = new Set();
    for (const item of allSearchResults) {
      if (!seenLinks.has(item.link)) {
        seenLinks.add(item.link);
        uniqueResults.push(item);
      }
    }

    if (uniqueResults.length === 0) {
      return res.json({ success: true, count: 0, events: [] });
    }

    const rawData = uniqueResults.map(r => ({
      title: r.title,
      link: r.link,
      snippet: r.snippet
    }));

    const prompt = `You are a mass hiring and career fair tracker for fresh BTech/MCA graduates in India.
Review these search results:
${JSON.stringify(rawData)}

Extract active upcoming events like:
- Mass hiring programs (e.g. TCS NQT, Wipro Elite, Cognizant GenC, Infosys SP/DSE, Accenture, Capgemini, etc.)
- Pooled or off-campus recruitment drives for 2025/2026 batches
- Tech job fairs and hiring events (both online and physical)

Identify:
1. Event Title
2. Organizer (e.g. TCS, Cocubes, AMCAT, NASSCOM, or Government)
3. Type: "mass-hiring", "job-fair", or "off-campus-drive"
4. Date (extract date if mentioned, else use "Ongoing" or "Refer to link")
5. Eligibility criteria (e.g., BTech CSE/IT, 60% criteria, batch of 2026)
6. Location (Online or specific city)
7. Brief Description
8. Registration Link

Return ONLY a JSON array of events (no markdown, no other text) in this format:
[
  {
    "title": "Event Title",
    "organizer": "Organizer Name",
    "type": "mass-hiring" or "job-fair" or "off-campus-drive",
    "date": "Date of event or Ongoing",
    "registrationLink": "https://...",
    "eligibility": "BTech IT/CS, MCA, batch 2025/2026",
    "location": "Online / Delhi / etc.",
    "description": "Short description of the drive or fair"
  }
]`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2
    });

    let aiResponse = completion.choices[0].message.content;
    aiResponse = aiResponse.replace(/```json|```/g, '').trim();

    const eventsList = JSON.parse(aiResponse);

    const savedEvents = [];
    for (const event of eventsList) {
      try {
        const updated = await UpcomingEvent.findOneAndUpdate(
          { registrationLink: event.registrationLink },
          event,
          { upsert: true, new: true }
        );
        savedEvents.push(updated);
      } catch (err) {
        console.error('Error saving event:', err.message);
      }
    }

    res.json({ success: true, count: savedEvents.length, events: savedEvents });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch events: ' + error.message });
  }
};

// ─────────────────────────────────────
// @route   POST /api/ai/review-resume
// @access  Private (student only)
// ─────────────────────────────────────
const reviewResume = async (req, res) => {
  try {
    const { skills, textContent } = req.body;

    if (!skills && !textContent) {
      return res.status(400).json({ message: 'Please provide skills or resume text' });
    }

    const prompt = `You are a professional ATS (Applicant Tracking System) reviewer specialized in BTech IT and Computer Science fresher recruitment in India.
Analyze this candidate's profile:
Skills Provided: ${skills ? JSON.stringify(skills) : 'None'}
Resume Text: ${textContent ? textContent : 'None'}

Evaluate the candidate's readiness for modern software engineering roles (Frontend, Backend, Fullstack, or QA/DevOps).
Provide a response strictly in JSON format (no markdown blocks, no other text) with the following structure:
{
  "atsScore": 65,
  "strengths": ["list of strengths"],
  "criticalMissingSkills": ["list of key IT skills missing, e.g. DSA, DBMS, React, Docker, OS"],
  "academicGaps": ["list of key academic computer science/IT subjects missing, e.g., DBMS, Computer Networks, Operating Systems"],
  "projectRecommendations": [
    {
      "title": "Project Idea Name",
      "description": "Short description of an advanced project they should build to stand out, specifying tech stack."
    }
  ],
  "atsTips": ["ATS formatting or phrasing tips specifically for freshers"]
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3
    });

    let aiResponse = completion.choices[0].message.content;
    aiResponse = aiResponse.replace(/```json|```/g, '').trim();

    const analysis = JSON.parse(aiResponse);
    res.json({ success: true, analysis });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Resume review failed: ' + error.message });
  }
};

// ─────────────────────────────────────
// @route   POST /api/ai/mock-interview/generate
// @access  Private (student only)
// ─────────────────────────────────────
const generateMockInterview = async (req, res) => {
  try {
    const { targetRole, skills } = req.body;

    if (!targetRole) {
      return res.status(400).json({ message: 'Please provide a target role' });
    }

    const prompt = `You are an AI interviewer for entry-level tech roles in India. 
The candidate is applying for the role: "${targetRole}"
Their skills are: ${skills ? JSON.stringify(skills) : 'Basic BTech IT Graduate skills'}

Generate 3 interview questions suitable for a fresher BTech IT graduate.
- Question 1: Data Structures and Algorithms (DSA) or Coding logic.
- Question 2: Core IT subject (DBMS SQL, Operating Systems, or Computer Networks).
- Question 3: Real-world technology question (e.g. REST APIs, React state, or Git basics).

Return the questions strictly as a JSON object (no markdown, no extra text) in this format:
{
  "questions": [
    {"id": 1, "category": "DSA/Coding", "question": "Write a function to..."},
    {"id": 2, "category": "Core CS", "question": "Explain ACID properties..."},
    {"id": 3, "category": "System/Web Tech", "question": "What is the difference between... "}
  ]
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3
    });

    let aiResponse = completion.choices[0].message.content;
    aiResponse = aiResponse.replace(/```json|```/g, '').trim();

    res.json({ success: true, data: JSON.parse(aiResponse) });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate interview questions: ' + error.message });
  }
};

// ─────────────────────────────────────
// @route   POST /api/ai/mock-interview/grade
// @access  Private (student only)
// ─────────────────────────────────────
const gradeMockInterview = async (req, res) => {
  try {
    const { answers } = req.body; // Array of { question, answer }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers must be an array' });
    }

    const prompt = `You are a tech interviewer grading a BTech IT fresher's answers.
Here are the questions and their submitted answers:
${JSON.stringify(answers)}

Evaluate the correctness, completeness, and phrasing of each answer. Provide constructive feedback and score each answer out of 10. Also calculate an overall percentage score.

Return the evaluation strictly as a JSON object (no markdown, no extra text) in this format:
{
  "overallScore": 75,
  "overallFeedback": "Overall feedback summary...",
  "grades": [
    {
      "question": "Question text",
      "submittedAnswer": "User's answer",
      "score": 8,
      "feedback": "Feedback on this answer",
      "sampleCorrectAnswer": "Sample high-quality answer for freshers"
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2
    });

    let aiResponse = completion.choices[0].message.content;
    aiResponse = aiResponse.replace(/```json|```/g, '').trim();

    res.json({ success: true, evaluation: JSON.parse(aiResponse) });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Grading failed: ' + error.message });
  }
};

module.exports = {
  searchRealJobs,
  matchJobs,
  getVerifiedFresherJobs,
  getJobFairsAndMassHiring,
  reviewResume,
  generateMockInterview,
  gradeMockInterview
};
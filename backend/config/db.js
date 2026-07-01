const mongoose = require('mongoose');

const seedJobs = async () => {
  try {
    const User = require('../models/User');
    const Job = require('../models/Job');
    const bcrypt = require('bcryptjs');

    // Find or create guest recruiter
    const recruiterEmail = 'guest_recruiter@jobportal.com';
    let recruiter = await User.findOne({ email: recruiterEmail });
    if (!recruiter) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('guestpassword123', salt);
      recruiter = await User.create({
        name: 'Demo Recruiter (Guest)',
        email: recruiterEmail,
        password: hashedPassword,
        role: 'recruiter',
        phone: '9876543210',
        skills: []
      });
    }
    const hasSeeded = await Job.findOne({ company: 'Google', title: 'Software Engineer Intern' });
    if (!hasSeeded) {
      console.log('Seeding demo job postings...');
      const demoJobs = [
        {
          title: 'Software Engineer Intern',
          company: 'Google',
          location: 'Bangalore / Remote',
          salary: '₹80,000 / month',
          jobType: 'internship',
          skills: ['Java', 'Python', 'DSA', 'C++', 'Problem Solving'],
          description: 'Join Google as a software engineering intern. You will work on real-world projects, design scalable systems, write clean code, and learn from world-class engineering teams. Requires strong problem-solving skills and foundations in Data Structures and Algorithms.',
          postedBy: recruiter._id
        },
        {
          title: 'Frontend Engineer (React)',
          company: 'Razorpay',
          location: 'Bangalore (Hybrid)',
          salary: '10 - 14 LPA',
          jobType: 'full-time',
          skills: ['React', 'JavaScript', 'CSS', 'Tailwind CSS', 'Redux'],
          description: 'We are looking for a passionate Frontend Engineer who can build rich, high-performance web experiences. You will design, develop, and refine payment flows, merchant dashboards, and component libraries. Proficiency in React, hooks, and responsive styling is essential.',
          postedBy: recruiter._id
        },
        {
          title: 'Backend Engineer (Node/Go)',
          company: 'Stripe',
          location: 'Remote (India)',
          salary: '18 - 24 LPA',
          jobType: 'remote',
          skills: ['Node.js', 'Go', 'APIs', 'SQL', 'MongoDB', 'Docker'],
          description: 'Build backend pipelines, transaction engines, and core payment APIs at scale. You will focus on API latency optimization, database querying, data persistence layer design, and microservices scaling. Requires node/golang experience and containerization tooling knowledge.',
          postedBy: recruiter._id
        },
        {
          title: 'Associate Software Developer (NQT)',
          company: 'TCS',
          location: 'Pune / Mumbai',
          salary: '3.6 - 7 LPA',
          jobType: 'full-time',
          skills: ['Java', 'SQL', 'C++', 'Python', 'SDLC'],
          description: 'Entry-level engineering role focused on enterprise application delivery. You will assist in coding, testing, debugging, and documenting Java-based applications for global clients. Training will be provided upon onboarding.',
          postedBy: recruiter._id
        },
        {
          title: 'Data Science Intern',
          company: 'Microsoft',
          location: 'Hyderabad',
          salary: '₹60,000 / month',
          jobType: 'internship',
          skills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'NumPy'],
          description: 'Microsoft AI Research team is hiring data science interns. Work on natural language processing pipelines, feature engineering, and classification models. Ideal for candidates with statistical modeling knowledge and numerical library expertise.',
          postedBy: recruiter._id
        },
        {
          title: 'Cloud Security Engineer',
          company: 'Netflix',
          location: 'Remote',
          salary: '22 - 28 LPA',
          jobType: 'remote',
          skills: ['AWS', 'Python', 'Cybersecurity', 'Linux', 'Docker'],
          description: 'Maintain Netflix security posture across global microservices architecture. Set up automated threat scanners, audit AWS IAM roles, and configure secure container boundaries. Python scripting and cloud networking knowledge are highly valued.',
          postedBy: recruiter._id
        },
        {
          title: 'Mobile Developer (React Native)',
          company: 'Uber',
          location: 'Bangalore',
          salary: '12 - 16 LPA',
          jobType: 'full-time',
          skills: ['React Native', 'JavaScript', 'iOS', 'Android', 'Git'],
          description: 'Contribute to building fast, modular user experiences in Uber mobile applications. Work on cross-platform codebases, optimize layouts for high-fps, and integrate with native platform APIs.',
          postedBy: recruiter._id
        },
        {
          title: 'Full Stack Engineer',
          company: 'Zomato',
          location: 'Gurugram',
          salary: '10 - 15 LPA',
          jobType: 'full-time',
          skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
          description: 'Work on both customer-facing applications and vendor dashboard features. You will handle database design, backend services, API structures, and responsive front-end views. Mastery of the MERN stack is required.',
          postedBy: recruiter._id
        },
        {
          title: 'QA Engineer Intern',
          company: 'Atlassian',
          location: 'Bengaluru (Hybrid)',
          salary: '₹50,000 / month',
          jobType: 'internship',
          skills: ['Selenium', 'Java', 'Jest', 'Testing', 'Jira'],
          description: 'Help ensure software quality across core collaboration tools. Design and execute automated test scripts, record regressions, and collaborate with software engineering teams to resolve bugs early.',
          postedBy: recruiter._id
        },
        {
          title: 'System Engineer (Power Programmer)',
          company: 'Infosys',
          location: 'Bengaluru',
          salary: '6.2 - 9 LPA',
          jobType: 'full-time',
          skills: ['Java', 'Spring Boot', 'SQL', 'Microservices'],
          description: 'Specialist programmer role. You will work on high-value systems, build Spring Boot microservices, optimize performance bottlenecks, and design relational database schemas. Focuses on advanced coding capabilities.',
          postedBy: recruiter._id
        }
      ];

      await Job.insertMany(demoJobs);
      console.log('Demo jobs seeded successfully.');
    }
  } catch (err) {
    console.error('Failed to seed demo jobs:', err.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedJobs();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
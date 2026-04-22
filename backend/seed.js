import { config } from 'dotenv';
import mongoose from 'mongoose';
import Application from './models/Application.js';
import Job from './models/Job.js';
import User from './models/User.js';

config();

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
};

const employers = [
  { name: 'Google Inc', email: 'hr@google.com', password: 'password123', role: 'employer', companyName: 'Google', companyDescription: 'Google LLC is a global technology company specializing in Internet-related services including search, cloud computing, software, and hardware.', companyWebsite: 'https://google.com', companySize: '1000+', industry: 'Technology', location: 'Mountain View, CA' },
  { name: 'Microsoft Corp', email: 'hr@microsoft.com', password: 'password123', role: 'employer', companyName: 'Microsoft', companyDescription: 'Microsoft is a leading technology corporation that develops, manufactures, licenses, and supports a wide range of software products and services.', companyWebsite: 'https://microsoft.com', companySize: '1000+', industry: 'Technology', location: 'Redmond, WA' },
  { name: 'Amazon HR', email: 'hr@amazon.com', password: 'password123', role: 'employer', companyName: 'Amazon', companyDescription: 'Amazon is a global e-commerce and cloud computing company offering a vast range of products, services, and digital streaming.', companyWebsite: 'https://amazon.com', companySize: '1000+', industry: 'E-Commerce', location: 'Seattle, WA' },
  { name: 'Meta Platforms', email: 'hr@meta.com', password: 'password123', role: 'employer', companyName: 'Meta', companyDescription: 'Meta builds technologies that help people connect, find communities, and grow businesses.', companyWebsite: 'https://meta.com', companySize: '1000+', industry: 'Social Media', location: 'Menlo Park, CA' },
  { name: 'Netflix Talent', email: 'hr@netflix.com', password: 'password123', role: 'employer', companyName: 'Netflix', companyDescription: 'Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries and more.', companyWebsite: 'https://netflix.com', companySize: '500-1000', industry: 'Entertainment', location: 'Los Gatos, CA' },
  { name: 'Shopify HR', email: 'hr@shopify.com', password: 'password123', role: 'employer', companyName: 'Shopify', companyDescription: 'Shopify is a leading e-commerce platform that allows businesses to create and manage their online stores.', companyWebsite: 'https://shopify.com', companySize: '500-1000', industry: 'E-Commerce', location: 'Ottawa, Canada' },
];

const jobseekers = [
  { name: 'Alice Johnson', email: 'alice@example.com', password: 'password123', role: 'jobseeker', headline: 'Senior React Developer', bio: 'Passionate frontend developer with 5+ years of experience building scalable web applications.', location: 'San Francisco, CA', skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'CSS'], experience: '5 years in frontend development at various startups and Fortune 500 companies.' },
  { name: 'Bob Martinez', email: 'bob@example.com', password: 'password123', role: 'jobseeker', headline: 'Full Stack Engineer', bio: 'Full stack developer specializing in MERN stack and cloud infrastructure.', location: 'New York, NY', skills: ['MongoDB', 'Express', 'React', 'Node.js', 'AWS', 'Docker'], experience: '4 years building full stack applications.' },
  { name: 'Carol Chen', email: 'carol@example.com', password: 'password123', role: 'jobseeker', headline: 'UI/UX Designer', bio: 'Creative designer with a passion for building beautiful and intuitive user interfaces.', location: 'Austin, TX', skills: ['Figma', 'Adobe XD', 'CSS', 'HTML', 'Prototyping'], experience: '3 years in product design at tech companies.' },
  { name: 'David Kim', email: 'david@example.com', password: 'password123', role: 'jobseeker', headline: 'Backend Engineer', bio: 'Python and Java backend engineer with expertise in microservices and distributed systems.', location: 'Chicago, IL', skills: ['Python', 'Java', 'PostgreSQL', 'Redis', 'Kafka'], experience: '6 years in backend engineering.' },
  { name: 'Emma Wilson', email: 'emma@example.com', password: 'password123', role: 'jobseeker', headline: 'Data Scientist', bio: 'Machine learning engineer passionate about turning data into actionable insights.', location: 'Boston, MA', skills: ['Python', 'TensorFlow', 'SQL', 'Pandas', 'Machine Learning'], experience: '4 years in data science and ML.' },
];

const createJobs = (employerMap) => [
  {
    employer: employerMap['hr@google.com'],
    title: 'Senior React Developer',
    company: 'Google',
    description: 'We are looking for a Senior React Developer to join our front-end engineering team. You will build highly scalable, performant user interfaces for Google products used by billions of users worldwide.\n\nYou will collaborate with designers, product managers, and backend engineers to ship features that make a real impact.',
    qualifications: '• Bachelor\'s degree in Computer Science or related field\n• 5+ years of frontend development experience\n• Expert knowledge of React and its ecosystem\n• Experience with TypeScript and GraphQL\n• Strong understanding of performance optimization',
    responsibilities: '• Design and implement new frontend features\n• Lead code reviews and mentor junior developers\n• Collaborate with UX/UI designers\n• Optimize applications for performance and scalability\n• Write unit and integration tests',
    location: 'Mountain View, CA',
    jobType: 'full-time',
    experienceLevel: 'senior',
    salaryMin: 150000, salaryMax: 220000, salaryCurrency: 'USD',
    skills: ['React', 'TypeScript', 'GraphQL', 'Node.js', 'CSS-in-JS'],
    industry: 'Technology',
    isActive: true,
    applicationCount: 0,
  },
  {
    employer: employerMap['hr@google.com'],
    title: 'Cloud Solutions Architect',
    company: 'Google',
    description: 'Join Google Cloud team to design and architect enterprise-scale cloud solutions. You\'ll work directly with customers to understand their infrastructure needs and help them migrate to GCP.\n\nThis is an exciting opportunity to work at the cutting edge of cloud technology.',
    qualifications: '• 7+ years of cloud architecture experience\n• GCP, AWS, or Azure certifications\n• Experience with Kubernetes and containerization\n• Strong knowledge of network and security',
    responsibilities: '• Design cloud infrastructure for enterprise clients\n• Lead technical discovery workshops\n• Create architecture diagrams and proposals\n• Provide guidance on cloud best practices',
    location: 'Remote',
    jobType: 'remote',
    experienceLevel: 'lead',
    salaryMin: 180000, salaryMax: 250000, salaryCurrency: 'USD',
    skills: ['GCP', 'Kubernetes', 'Terraform', 'Docker', 'Networking'],
    industry: 'Technology',
    isActive: true,
    applicationCount: 0,
  },
  {
    employer: employerMap['hr@microsoft.com'],
    title: 'Full Stack Engineer (.NET + React)',
    company: 'Microsoft',
    description: 'Microsoft is hiring a Full Stack Engineer to work on Azure DevOps platform. You\'ll be building tools that millions of developers use daily.\n\nJoin a team that values innovation, diversity, and work-life balance.',
    qualifications: '• 4+ years of full stack development experience\n• Proficiency in C#/.NET and React\n• Experience with Azure services\n• Understanding of CI/CD pipelines',
    responsibilities: '• Build and maintain Azure DevOps features\n• Write clean, testable code\n• Participate in Agile ceremonies\n• Contribute to open source projects',
    location: 'Redmond, WA',
    jobType: 'full-time',
    experienceLevel: 'mid',
    salaryMin: 130000, salaryMax: 180000, salaryCurrency: 'USD',
    skills: ['C#', '.NET', 'React', 'Azure', 'SQL Server'],
    industry: 'Technology',
    isActive: true,
    applicationCount: 0,
  },
  {
    employer: employerMap['hr@microsoft.com'],
    title: 'Machine Learning Engineer',
    company: 'Microsoft',
    description: 'Join Microsoft\'s AI team to build the next generation of intelligent features in Microsoft 365. You\'ll design and train machine learning models that power Copilot and other AI features.\n\nWork alongside world-class researchers and engineers in a collaborative environment.',
    qualifications: '• MS or PhD in Computer Science, ML, or related field\n• 3+ years of ML engineering experience\n• Proficiency in Python and PyTorch or TensorFlow\n• Experience deploying models at scale',
    responsibilities: '• Design and train ML models\n• Build data pipelines for model training\n• Deploy and monitor models in production\n• Collaborate with research teams',
    location: 'Seattle, WA',
    jobType: 'full-time',
    experienceLevel: 'senior',
    salaryMin: 160000, salaryMax: 230000, salaryCurrency: 'USD',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'Azure ML', 'Data Engineering'],
    industry: 'Technology',
    isActive: true,
    applicationCount: 0,
  },
  {
    employer: employerMap['hr@amazon.com'],
    title: 'Backend Software Engineer (Java)',
    company: 'Amazon',
    description: 'Amazon is looking for a passionate Backend Software Engineer to join our supply chain team. You\'ll design and build distributed systems that power Amazon\'s logistics network.\n\nYou will have the opportunity to work on systems that process millions of transactions per day.',
    qualifications: '• 3+ years of backend engineering experience\n• Strong Java or Python skills\n• Experience with distributed systems\n• Understanding of AWS services',
    responsibilities: '• Design and implement microservices\n• Build fault-tolerant distributed systems\n• Optimize system performance and reliability\n• Participate in on-call rotations',
    location: 'Seattle, WA',
    jobType: 'full-time',
    experienceLevel: 'mid',
    salaryMin: 140000, salaryMax: 200000, salaryCurrency: 'USD',
    skills: ['Java', 'AWS', 'DynamoDB', 'Microservices', 'Kafka'],
    industry: 'E-Commerce',
    isActive: true,
    applicationCount: 0,
  },
  {
    employer: employerMap['hr@amazon.com'],
    title: 'DevOps / Site Reliability Engineer',
    company: 'Amazon',
    description: 'Join Amazon Web Services (AWS) as a Site Reliability Engineer. You\'ll be responsible for maintaining the reliability, availability, and performance of AWS infrastructure at global scale.',
    qualifications: '• 5+ years of SRE or DevOps experience\n• Deep expertise in AWS services\n• Proficiency in Python or Go for automation\n• Experience with Kubernetes and Terraform',
    responsibilities: '• Monitor and improve system reliability\n• Build automation tools and scripts\n• Lead incident response\n• Work on capacity planning',
    location: 'Remote',
    jobType: 'remote',
    experienceLevel: 'senior',
    salaryMin: 155000, salaryMax: 210000, salaryCurrency: 'USD',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Python', 'Go'],
    industry: 'Technology',
    isActive: true,
    applicationCount: 0,
  },
  {
    employer: employerMap['hr@meta.com'],
    title: 'iOS Developer (Swift)',
    company: 'Meta',
    description: 'Meta is hiring an iOS Developer to work on the Facebook and Instagram apps — two of the most widely used mobile applications in the world. You\'ll implement features seen by billions of users.',
    qualifications: '• 3+ years of iOS development experience\n• Expert knowledge of Swift and UIKit\n• Experience with SwiftUI is a plus\n• Understanding of mobile performance optimization',
    responsibilities: '• Develop and maintain iOS features\n• Write and review code for quality\n• Collaborate with cross-functional teams\n• Improve app performance and stability',
    location: 'Menlo Park, CA',
    jobType: 'full-time',
    experienceLevel: 'mid',
    salaryMin: 145000, salaryMax: 195000, salaryCurrency: 'USD',
    skills: ['Swift', 'UIKit', 'SwiftUI', 'Xcode', 'REST APIs'],
    industry: 'Social Media',
    isActive: true,
    applicationCount: 0,
  },
  {
    employer: employerMap['hr@meta.com'],
    title: 'Product Designer (UI/UX)',
    company: 'Meta',
    description: 'Meta\'s design team is looking for a talented Product Designer to shape the future of social connection. You\'ll work on VR/AR experiences and the core Facebook and Instagram products.',
    qualifications: '• 4+ years of product design experience\n• Strong portfolio demonstrating mobile and web design\n• Proficiency in Figma\n• Experience with design systems',
    responsibilities: '• Create wireframes, prototypes, and high-fidelity designs\n• Conduct user research and usability testing\n• Collaborate with engineers to implement designs\n• Contribute to the Meta design system',
    location: 'Remote',
    jobType: 'remote',
    experienceLevel: 'senior',
    salaryMin: 130000, salaryMax: 180000, salaryCurrency: 'USD',
    skills: ['Figma', 'Product Design', 'User Research', 'Prototyping', 'Design Systems'],
    industry: 'Social Media',
    isActive: true,
    applicationCount: 0,
  },
  {
    employer: employerMap['hr@netflix.com'],
    title: 'Senior Data Engineer',
    company: 'Netflix',
    description: 'Netflix is seeking a Senior Data Engineer to join our data platform team. You\'ll build and maintain the data infrastructure that powers our recommendations, analytics, and content decisions.',
    qualifications: '• 5+ years of data engineering experience\n• Proficiency in Python and Spark\n• Experience with Kafka and Flink\n• Knowledge of data warehouse design',
    responsibilities: '• Build and maintain data pipelines\n• Design data models and schemas\n• Optimize query performance\n• Collaborate with data scientists',
    location: 'Los Gatos, CA',
    jobType: 'full-time',
    experienceLevel: 'senior',
    salaryMin: 160000, salaryMax: 220000, salaryCurrency: 'USD',
    skills: ['Python', 'Apache Spark', 'Kafka', 'SQL', 'AWS', 'Airflow'],
    industry: 'Entertainment',
    isActive: true,
    applicationCount: 0,
  },
  {
    employer: employerMap['hr@netflix.com'],
    title: 'Frontend Engineer (Video Player)',
    company: 'Netflix',
    description: 'Join Netflix\'s video player team to build the best streaming experience on the planet. You\'ll work on the core player technology that serves content to 260M+ subscribers globally.',
    qualifications: '• 4+ years of frontend engineering experience\n• Deep knowledge of JavaScript and React\n• Experience with video/media technologies\n• Understanding of web performance',
    responsibilities: '• Build and optimize the Netflix web player\n• Implement adaptive streaming features\n• Debug and fix player issues\n• Improve streaming performance',
    location: 'Los Gatos, CA',
    jobType: 'full-time',
    experienceLevel: 'mid',
    salaryMin: 140000, salaryMax: 195000, salaryCurrency: 'USD',
    skills: ['JavaScript', 'React', 'WebRTC', 'HLS', 'Performance Optimization'],
    industry: 'Entertainment',
    isActive: true,
    applicationCount: 0,
  },
  {
    employer: employerMap['hr@shopify.com'],
    title: 'Ruby on Rails Developer',
    company: 'Shopify',
    description: 'Shopify is looking for a Ruby on Rails developer to work on the core commerce platform. You\'ll help merchants around the world build and grow their businesses.\n\nThis is a remote-first role — work from anywhere.',
    qualifications: '• 3+ years of Ruby on Rails experience\n• Strong knowledge of SQL databases\n• Experience with Kubernetes\n• Understanding of e-commerce concepts',
    responsibilities: '• Develop new platform features\n• Improve platform performance and scalability\n• Review code and mentor teammates\n• Participate in on-call',
    location: 'Remote',
    jobType: 'remote',
    experienceLevel: 'mid',
    salaryMin: 110000, salaryMax: 160000, salaryCurrency: 'USD',
    skills: ['Ruby on Rails', 'PostgreSQL', 'Redis', 'Kubernetes', 'GraphQL'],
    industry: 'E-Commerce',
    isActive: true,
    applicationCount: 0,
  },
  {
    employer: employerMap['hr@shopify.com'],
    title: 'Junior Frontend Developer (React)',
    company: 'Shopify',
    description: 'Great opportunity for a junior developer to grow at one of the world\'s leading e-commerce companies. You\'ll work on Shopify Admin and merchant-facing features using React and Polaris design system.',
    qualifications: '• 1-2 years of frontend development experience\n• Solid knowledge of React and JavaScript\n• Familiarity with CSS and responsive design\n• Eagerness to learn and grow',
    responsibilities: '• Build UI components using React\n• Fix bugs and improve existing features\n• Write tests\n• Participate in code reviews',
    location: 'Ottawa, Canada',
    jobType: 'full-time',
    experienceLevel: 'entry',
    salaryMin: 70000, salaryMax: 100000, salaryCurrency: 'USD',
    skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Git'],
    industry: 'E-Commerce',
    isActive: true,
    applicationCount: 0,
  },
];

async function seed() {
  try {
    await connectDB();
    console.log('\n🌱 Starting database seed...\n');

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create employer users
    const createdEmployers = [];
    for (const emp of employers) {
      const user = await User.create(emp);
      createdEmployers.push(user);
      console.log(`✅ Employer: ${emp.companyName} (${emp.email})`);
    }

    // Build employer email -> _id map
    const employerMap = {};
    createdEmployers.forEach(e => { employerMap[e.email] = e._id; });

    // Create jobs
    const jobDefs = createJobs(employerMap);
    const createdJobs = [];
    for (const jd of jobDefs) {
      const job = await Job.create(jd);
      createdJobs.push(job);
      console.log(`✅ Job: ${job.title} @ ${job.company}`);
    }

    // Create jobseeker users
    const createdSeekers = [];
    for (const seeker of jobseekers) {
      const user = await User.create(seeker);
      createdSeekers.push(user);
      console.log(`✅ Jobseeker: ${seeker.name} (${seeker.email})`);
    }

    // Create sample applications
    const appData = [
      { job: createdJobs[0]._id, applicant: createdSeekers[0]._id, coverLetter: 'I am very excited about this role at Google. With 5+ years of React experience and a track record of building highly performant UIs, I believe I would be a great fit for your team.', status: 'shortlisted' },
      { job: createdJobs[0]._id, applicant: createdSeekers[1]._id, coverLetter: 'Google is my dream company. My full stack background and deep React expertise make me a strong candidate for this role.', status: 'reviewing' },
      { job: createdJobs[2]._id, applicant: createdSeekers[1]._id, coverLetter: 'I have been working with .NET and React for 4 years. Microsoft\'s culture of growth and learning aligns perfectly with my values.', status: 'pending' },
      { job: createdJobs[4]._id, applicant: createdSeekers[3]._id, coverLetter: 'I have deep expertise in Java and distributed systems. Working at Amazon on supply chain technology would be an incredible opportunity.', status: 'hired' },
      { job: createdJobs[7]._id, applicant: createdSeekers[2]._id, coverLetter: 'As a UI/UX designer with 3 years of experience, I am passionate about creating beautiful and intuitive experiences. Meta\'s design challenges are exactly what I am looking for.', status: 'shortlisted' },
      { job: createdJobs[8]._id, applicant: createdSeekers[4]._id, coverLetter: 'Netflix\'s data infrastructure is world-class. My experience with Spark and Kafka pipelines aligns perfectly with this role.', status: 'reviewing' },
      { job: createdJobs[11]._id, applicant: createdSeekers[0]._id, coverLetter: 'I am eager to grow at Shopify. My React skills are solid and I love e-commerce products.', status: 'pending' },
      { job: createdJobs[3]._id, applicant: createdSeekers[4]._id, coverLetter: 'As a data scientist with ML experience using TensorFlow and PyTorch, I am thrilled by Microsoft Copilot\'s potential.', status: 'reviewing' },
    ];

    for (const app of appData) {
      await Application.create(app);
      await Job.findByIdAndUpdate(app.job, { $inc: { applicationCount: 1 } });
    }
    console.log(`✅ Created ${appData.length} sample applications`);

    console.log('\n🎉 Seed complete!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Test Accounts:');
    console.log('');
    console.log('👔 EMPLOYERS:');
    employers.forEach(e => console.log(`   ${e.email} / password123  (${e.companyName})`));
    console.log('');
    console.log('👤 JOB SEEKERS:');
    jobseekers.forEach(s => console.log(`   ${s.email} / password123  (${s.name})`));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();

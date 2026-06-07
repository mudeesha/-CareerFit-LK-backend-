import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CareerFit LK database...");

  await prisma.adminAction.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.cvAnalysis.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.employerProfile.deleteMany();
  await prisma.candidateProfile.deleteMany();
  await prisma.company.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const candidateUser = await prisma.user.create({
    data: {
      email: "nimal.perera@example.com",
      password: "demo-password",
      role: "CANDIDATE",
      status: "ACTIVE",
    },
  });

  const employerUser = await prisma.user.create({
    data: {
      email: "hr@colombotech.lk",
      password: "demo-password",
      role: "EMPLOYER",
      status: "ACTIVE",
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@careerfit.lk",
      password: "demo-password",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: "WSO2",
        logoText: "WSO2",
        logoType: "text",
        logoColor: "#F97316",
        industry: "Software",
        location: "Colombo",
        openJobs: 18,
        size: "1000+",
        website: "https://wso2.com",
        description: "A global enterprise software company building API management and integration platforms.",
        contactEmail: "careers@wso2.com",
        phone: "+94 11 214 5345",
        status: "APPROVED",
      },
    }),
    prisma.company.create({
      data: {
        name: "Kandy Digital Labs",
        logoText: "KD",
        logoType: "initials",
        logoColor: "#7C3AED",
        industry: "Software",
        location: "Kandy",
        openJobs: 5,
        size: "50-100",
        website: "https://kandydigital.lk",
        description: "A software development company focused on web and mobile products.",
        contactEmail: "careers@kandydigital.lk",
        status: "APPROVED",
      },
    }),
    prisma.company.create({
      data: {
        name: "Colombo Tech Solutions",
        logoText: "CT",
        logoType: "initials",
        logoColor: "#2563EB",
        industry: "Software",
        location: "Colombo",
        openJobs: 6,
        size: "100-200",
        website: "https://colombotech.lk",
        description: "A Colombo-based technology company building cloud-native web applications.",
        contactEmail: "hr@colombotech.lk",
        status: "APPROVED",
      },
    }),
    prisma.company.create({
      data: {
        name: "LankaPay Digital Labs",
        logoText: "LP",
        logoType: "text",
        logoColor: "#1E40AF",
        industry: "FinTech",
        location: "Colombo",
        openJobs: 9,
        size: "200-500",
        website: "https://lankapay.lk",
        description: "A Sri Lankan digital payment and financial technology organization.",
        contactEmail: "careers@lankapay.lk",
        status: "APPROVED",
      },
    }),
    prisma.company.create({
      data: {
        name: "Dialog Innovation Hub",
        logoText: "Dialog",
        logoType: "text",
        logoColor: "#EF4444",
        industry: "Telecommunications",
        location: "Colombo",
        openJobs: 12,
        size: "1000+",
        website: "https://dialog.lk",
        description: "Innovation division focused on digital products, analytics, and customer platforms.",
        contactEmail: "careers@dialog.lk",
        status: "APPROVED",
      },
    }),
    prisma.company.create({
      data: {
        name: "Commercial Bank",
        logoText: "CB",
        logoType: "initials",
        logoColor: "#0F766E",
        industry: "Banking",
        location: "Colombo",
        openJobs: 11,
        size: "1000+",
        website: "https://combank.lk",
        description: "A leading Sri Lankan bank offering retail and corporate banking services.",
        contactEmail: "careers@combank.lk",
        status: "APPROVED",
      },
    }),
    prisma.company.create({
      data: {
        name: "NDB Bank",
        logoText: "NDB",
        logoType: "text",
        logoColor: "#DC2626",
        industry: "Banking",
        location: "Colombo",
        openJobs: 9,
        size: "1000+",
        website: "https://ndbbank.com",
        description: "A leading banking and financial services company in Sri Lanka.",
        contactEmail: "careers@ndb.lk",
        status: "APPROVED",
      },
    }),
    prisma.company.create({
      data: {
        name: "Hemas Hospitals",
        logoText: "HH",
        logoType: "initials",
        logoColor: "#059669",
        industry: "Healthcare",
        location: "Colombo",
        openJobs: 8,
        size: "500-1000",
        website: "https://hemashospitals.com",
        description: "Healthcare provider offering hospital and medical services.",
        contactEmail: "careers@hemas.lk",
        status: "APPROVED",
      },
    }),
  ]);

  const categoryData = [
    {
      name: "Software Engineering",
      jobCount: 420,
      iconName: "Code",
      description: "Frontend, backend, QA, DevOps, and cloud engineering roles.",
      topSkills: ["React", "Node.js", "AWS"],
    },
    {
      name: "Accounting & Finance",
      jobCount: 230,
      iconName: "Calculator",
      description: "Finance, accounting, reporting, and audit roles.",
      topSkills: ["Excel", "Reporting", "Accounting"],
    },
    {
      name: "Banking",
      jobCount: 180,
      iconName: "Building2",
      description: "Banking operations, credit, risk, and branch roles.",
      topSkills: ["Banking", "Reconciliation", "Customer Service"],
    },
    {
      name: "Customer Service",
      jobCount: 310,
      iconName: "Headphones",
      description: "Call center, support, customer success, and CRM roles.",
      topSkills: ["English", "Sinhala", "CRM"],
    },
    {
      name: "Sales & Marketing",
      jobCount: 275,
      iconName: "Megaphone",
      description: "Sales, brand marketing, digital marketing, and product roles.",
      topSkills: ["Sales", "Marketing", "Analytics"],
    },
    {
      name: "Healthcare",
      jobCount: 155,
      iconName: "HeartPulse",
      description: "Healthcare support, medical coordination, and hospital administration.",
      topSkills: ["Healthcare", "Customer Support", "Sinhala"],
    },
  ];

  const categories = await Promise.all(
    categoryData.map((category) =>
      prisma.category.create({
        data: category,
      })
    )
  );

  const softwareCategory = categories.find((c) => c.name === "Software Engineering")!;
  const financeCategory = categories.find((c) => c.name === "Accounting & Finance")!;
  const bankingCategory = categories.find((c) => c.name === "Banking")!;
  const customerCategory = categories.find((c) => c.name === "Customer Service")!;
  const marketingCategory = categories.find((c) => c.name === "Sales & Marketing")!;
  const healthcareCategory = categories.find((c) => c.name === "Healthcare")!;

  const wso2 = companies.find((c) => c.name === "WSO2")!;
  const kandyDigital = companies.find((c) => c.name === "Kandy Digital Labs")!;
  const colomboTech = companies.find((c) => c.name === "Colombo Tech Solutions")!;
  const lankaPay = companies.find((c) => c.name === "LankaPay Digital Labs")!;
  const dialog = companies.find((c) => c.name === "Dialog Innovation Hub")!;
  const commercialBank = companies.find((c) => c.name === "Commercial Bank")!;
  const hemas = companies.find((c) => c.name === "Hemas Hospitals")!;

  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: "Senior Software Engineer",
        companyId: wso2.id,
        categoryId: softwareCategory.id,
        location: "Colombo",
        workMode: "HYBRID",
        jobType: "FULL_TIME",
        salaryMin: 350000,
        salaryMax: 450000,
        experienceLevel: "FIVE_PLUS_YEARS",
        skills: ["Java", "Spring Boot", "AWS"],
        preferredSkills: ["Docker", "Kubernetes"],
        description: "We are looking for an experienced Senior Software Engineer to join our core platform team.",
        responsibilities: ["Design and implement scalable APIs", "Mentor junior developers", "Participate in architecture reviews"],
        benefits: ["Health insurance", "Flexible working hours", "Training budget"],
        status: "ACTIVE",
        isFeatured: true,
        applicantCount: 45,
        postedDate: "2 days ago",
      },
    }),
    prisma.job.create({
      data: {
        title: "Frontend Developer Intern",
        companyId: kandyDigital.id,
        categoryId: softwareCategory.id,
        location: "Kandy",
        workMode: "ONSITE",
        jobType: "INTERNSHIP",
        salaryMin: 35000,
        salaryMax: 50000,
        experienceLevel: "ENTRY_LEVEL",
        skills: ["React", "JavaScript", "CSS"],
        preferredSkills: ["Tailwind CSS", "Git"],
        description: "Internship opportunity for a frontend developer familiar with React and modern web UI.",
        responsibilities: ["Build reusable UI components", "Fix frontend bugs", "Work with senior developers"],
        benefits: ["Mentorship", "Internship allowance", "Flexible learning"],
        status: "ACTIVE",
        isFeatured: true,
        applicantCount: 120,
        postedDate: "3 days ago",
      },
    }),
    prisma.job.create({
      data: {
        title: "Junior Full Stack Developer",
        companyId: colomboTech.id,
        categoryId: softwareCategory.id,
        location: "Colombo",
        workMode: "HYBRID",
        jobType: "FULL_TIME",
        salaryMin: 120000,
        salaryMax: 180000,
        experienceLevel: "ONE_TO_TWO_YEARS",
        skills: ["React", "TypeScript", "Node.js", "REST API"],
        preferredSkills: ["AWS Lambda", "DynamoDB", "CI/CD"],
        description: "We are looking for a junior full stack developer to build modern web applications.",
        responsibilities: ["Develop React features", "Build REST APIs", "Integrate backend services"],
        benefits: ["Health insurance", "Hybrid work", "Career growth"],
        status: "ACTIVE",
        isFeatured: true,
        applicantCount: 85,
        postedDate: "1 week ago",
      },
    }),
    prisma.job.create({
      data: {
        title: "Finance Executive",
        companyId: lankaPay.id,
        categoryId: financeCategory.id,
        location: "Colombo",
        workMode: "ONSITE",
        jobType: "FULL_TIME",
        salaryMin: 90000,
        salaryMax: 140000,
        experienceLevel: "ONE_TO_TWO_YEARS",
        skills: ["Accounting", "Excel", "Reporting"],
        preferredSkills: ["Banking", "Payments"],
        description: "Finance executive role for reporting, reconciliation, and payment operations.",
        responsibilities: ["Prepare finance reports", "Handle reconciliations", "Support payment operations"],
        benefits: ["Medical insurance", "Performance bonus"],
        status: "ACTIVE",
        applicantCount: 34,
        postedDate: "5 days ago",
      },
    }),
    prisma.job.create({
      data: {
        title: "Customer Support Associate",
        companyId: dialog.id,
        categoryId: customerCategory.id,
        location: "Colombo",
        workMode: "HYBRID",
        jobType: "FULL_TIME",
        salaryMin: 65000,
        salaryMax: 95000,
        experienceLevel: "ENTRY_LEVEL",
        skills: ["English", "Sinhala", "CRM"],
        preferredSkills: ["Tamil", "Technical Support"],
        description: "Customer support associate role for digital products and customer care.",
        responsibilities: ["Respond to customer inquiries", "Use CRM systems", "Escalate technical issues"],
        benefits: ["Hybrid work", "Training", "Mobile allowance"],
        status: "ACTIVE",
        applicantCount: 210,
        postedDate: "1 day ago",
      },
    }),
    prisma.job.create({
      data: {
        title: "Banking Operations Assistant",
        companyId: commercialBank.id,
        categoryId: bankingCategory.id,
        location: "Colombo",
        workMode: "ONSITE",
        jobType: "FULL_TIME",
        salaryMin: 80000,
        salaryMax: 120000,
        experienceLevel: "ONE_TO_TWO_YEARS",
        skills: ["Banking", "Excel", "Reconciliation"],
        preferredSkills: ["Risk Operations", "Customer Service"],
        description: "Support branch and back-office banking operation tasks.",
        responsibilities: ["Assist banking operations", "Prepare reconciliations", "Support customer documentation"],
        benefits: ["Banking benefits", "Training", "Career growth"],
        status: "ACTIVE",
        applicantCount: 156,
        postedDate: "3 days ago",
      },
    }),
    prisma.job.create({
      data: {
        title: "Healthcare Support Coordinator",
        companyId: hemas.id,
        categoryId: healthcareCategory.id,
        location: "Colombo",
        workMode: "HYBRID",
        jobType: "FULL_TIME",
        salaryMin: 70000,
        salaryMax: 110000,
        experienceLevel: "ONE_TO_TWO_YEARS",
        skills: ["Healthcare", "Customer Support", "Sinhala"],
        preferredSkills: ["Insurance Claims", "CRM"],
        description: "Coordinate healthcare support requests and patient service workflows.",
        responsibilities: ["Coordinate patient support", "Maintain records", "Communicate with healthcare teams"],
        benefits: ["Healthcare benefits", "Hybrid work"],
        status: "ACTIVE",
        applicantCount: 89,
        postedDate: "2 days ago",
      },
    }),
  ]);

  await prisma.employerProfile.create({
    data: {
      userId: employerUser.id,
      companyId: colomboTech.id,
      fullName: "Chamath Silva",
      position: "HR Manager",
      phone: "+94 77 555 1234",
    },
  });

  const candidate = await prisma.candidateProfile.create({
    data: {
      userId: candidateUser.id,
      fullName: "Nimal Perera",
      phone: "+94 77 123 4567",
      district: "Gampaha",
      currentRole: "Junior Full Stack Developer",
      preferredLocations: ["Colombo", "Remote", "Gampaha"],
      expectedSalary: 150000,
      experienceYears: 1.5,
      skills: ["React", "JavaScript", "Node.js", "REST API", "MySQL", "Git"],
      languages: ["Sinhala", "English"],
      education: "BSc in Information Technology",
      linkedinUrl: "https://linkedin.com/in/nimalperera",
      githubUrl: "https://github.com/nimalperera",
      portfolioUrl: "https://nimal.dev",
      profileCompletion: 78,
    },
  });

  const juniorFullStackJob = jobs.find((j) => j.title === "Junior Full Stack Developer")!;
  const financeJob = jobs.find((j) => j.title === "Finance Executive")!;
  const supportJob = jobs.find((j) => j.title === "Customer Support Associate")!;

  await prisma.application.create({
    data: {
      candidateId: candidate.id,
      jobId: juniorFullStackJob.id,
      coverLetter: "I am interested in this role because I have experience with React and Node.js.",
      status: "SHORTLISTED",
      matchScore: 78,
    },
  });

  const financeApplication = await prisma.application.create({
    data: {
      candidateId: candidate.id,
      jobId: financeJob.id,
      coverLetter: "I am interested in applying for the finance role.",
      status: "VIEWED",
      matchScore: 62,
    },
  });

  await prisma.application.create({
    data: {
      candidateId: candidate.id,
      jobId: supportJob.id,
      coverLetter: "I have strong communication skills and customer support experience.",
      status: "APPLIED",
      matchScore: 81,
    },
  });

  await prisma.interview.create({
    data: {
      applicationId: financeApplication.id,
      interviewDate: "2026-06-15",
      interviewTime: "10:30",
      interviewType: "ONLINE",
      locationOrLink: "https://meet.google.com/demo-link",
      notes: "Initial screening interview.",
      status: "SCHEDULED",
    },
  });

  await prisma.cvAnalysis.create({
    data: {
      candidateId: candidate.id,
      fileName: "nimal-perera-cv.pdf",
      fileUrl: "/uploads/nimal-perera-cv.pdf",
      strengthScore: 72,
      extractedSkills: ["React", "JavaScript", "Node.js", "REST API", "MySQL", "Git"],
      missingSkills: ["TypeScript", "AWS Lambda", "DynamoDB"],
      experienceYears: 1.5,
      education: ["BSc in Information Technology"],
      languages: ["Sinhala", "English"],
      suggestions: [
        "Add measurable achievements",
        "Add TypeScript and AWS keywords",
        "Include GitHub and portfolio links",
        "Add project impact numbers",
      ],
    },
  });

  await prisma.savedJob.create({
    data: {
      candidateId: candidate.id,
      jobId: juniorFullStackJob.id,
    },
  });

  await prisma.adminAction.create({
    data: {
      adminUserId: adminUser.id,
      entityType: "COMPANY",
      entityId: colomboTech.id,
      action: "APPROVED",
      companyId: colomboTech.id,
      reason: "Company profile verified.",
    },
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
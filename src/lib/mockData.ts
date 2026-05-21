// ============================================================
// OsunFix Mock Data — Resilient fallback for Civic Hub
// Covers: Constituency Projects & Civic Flashcards
// ============================================================

export type ProjectStatus = 'Completed' | 'In Progress' | 'Pending' | 'Stalled';
export type ProjectCategory = 'Roads & Transport' | 'Water & Sanitation' | 'Education' | 'Healthcare' | 'Energy' | 'Agriculture';

export interface ConstituencyProject {
  id: string;
  title: string;
  constituency: string;
  lga: string;
  category: ProjectCategory;
  contractor: string;
  budgetNGN: number;
  amountReleasedNGN: number;
  progressPercent: number;
  status: ProjectStatus;
  startDate: string;
  expectedCompletion: string;
  description: string;
  co2SavedKg: number;
  beneficiaries: number;
}

export interface CivicFlashcard {
  id: string;
  category: 'State Government' | 'Local Government' | 'Citizen Rights' | 'Financial Accountability';
  question: string;
  answer: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
}

// ── CONSTITUENCY PROJECTS ────────────────────────────────────
export const mockProjects: ConstituencyProject[] = [
  {
    id: 'proj-001',
    title: 'Rehabilitation of Gbongan–Osogbo Expressway (Phase 2)',
    constituency: 'Osogbo Central',
    lga: 'Osogbo',
    category: 'Roads & Transport',
    contractor: 'Jubaili Construction Nig. Ltd',
    budgetNGN: 4_800_000_000,
    amountReleasedNGN: 2_400_000_000,
    progressPercent: 52,
    status: 'In Progress',
    startDate: '2024-03-01',
    expectedCompletion: '2025-12-31',
    description:
      'Dual carriageway rehabilitation spanning 34km connecting Gbongan to Osogbo, covering road resurfacing, median installation, drainage improvement, and roadside lighting.',
    co2SavedKg: 124_000,
    beneficiaries: 380_000,
  },
  {
    id: 'proj-002',
    title: 'Construction of 120-Bed General Hospital, Ilesa',
    constituency: 'Ilesa East',
    lga: 'Ilesa East',
    category: 'Healthcare',
    contractor: 'Messrs Dabi Engineering Ltd',
    budgetNGN: 2_100_000_000,
    amountReleasedNGN: 2_100_000_000,
    progressPercent: 100,
    status: 'Completed',
    startDate: '2022-01-10',
    expectedCompletion: '2024-06-30',
    description:
      "A fully equipped 120-bed general hospital with emergency wing, maternity ward, children's ward, diagnostic centre, and 24-hour solar power backup. Serving over 250,000 residents.",
    co2SavedKg: 54_000,
    beneficiaries: 250_000,
  },
  {
    id: 'proj-003',
    title: 'Rural Water Supply & Borehole Sinking — Ede North LGA (30 Communities)',
    constituency: 'Ede North',
    lga: 'Ede North',
    category: 'Water & Sanitation',
    contractor: 'Hydrolink Nigeria Ltd',
    budgetNGN: 750_000_000,
    amountReleasedNGN: 525_000_000,
    progressPercent: 70,
    status: 'In Progress',
    startDate: '2024-06-15',
    expectedCompletion: '2025-06-14',
    description:
      'Drilling and equipping of 30 boreholes across underserved communities in Ede North LGA with solar-powered pumps and elevated storage tanks. Targeted to eliminate water-borne disease in the corridor.',
    co2SavedKg: 18_200,
    beneficiaries: 95_000,
  },
  {
    id: 'proj-004',
    title: 'Renovation & ICT Equipment Supply — 50 Public Primary Schools, Iwo LGA',
    constituency: 'Iwo Central',
    lga: 'Iwo',
    category: 'Education',
    contractor: 'Quantum Educational Services Ltd',
    budgetNGN: 960_000_000,
    amountReleasedNGN: 192_000_000,
    progressPercent: 20,
    status: 'In Progress',
    startDate: '2025-01-05',
    expectedCompletion: '2025-11-30',
    description:
      'Comprehensive renovation of 50 primary school blocks: roofing, painting, furniture replacement, toilet blocks, and provision of computers and projectors per classroom to modernise learning.',
    co2SavedKg: 9_800,
    beneficiaries: 42_000,
  },
  {
    id: 'proj-005',
    title: 'Solar Street Lighting — Ikirun Township (Phase 1)',
    constituency: 'Ifelodun',
    lga: 'Ifelodun',
    category: 'Energy',
    contractor: 'SolarBase Africa Nig. Ltd',
    budgetNGN: 320_000_000,
    amountReleasedNGN: 320_000_000,
    progressPercent: 100,
    status: 'Completed',
    startDate: '2023-09-01',
    expectedCompletion: '2024-03-31',
    description:
      'Installation of 400 solar street lights across 15 major streets in Ikirun. Lights are fitted with motion-sensor technology and a 4-night battery backup. Reduced nighttime crime by 61% (police report).',
    co2SavedKg: 76_400,
    beneficiaries: 68_000,
  },
  {
    id: 'proj-006',
    title: 'Construction of Modern Market Complex — Ejigbo',
    constituency: 'Ejigbo',
    lga: 'Ejigbo',
    category: 'Agriculture',
    contractor: 'Build-Right Construction Co.',
    budgetNGN: 1_200_000_000,
    amountReleasedNGN: 180_000_000,
    progressPercent: 15,
    status: 'Stalled',
    startDate: '2024-10-01',
    expectedCompletion: '2026-04-30',
    description:
      'A 2,000-stall market complex with cold-storage facilities for farm produce, covered trading halls, dedicated waste management systems, and ICT banking booths. Stalled due to contractor funding dispute.',
    co2SavedKg: 0,
    beneficiaries: 120_000,
  },
  {
    id: 'proj-007',
    title: 'Dualisation of Oshogbo–Ikirun–Ila Road (Km 0–14)',
    constituency: 'Boripe',
    lga: 'Boripe',
    category: 'Roads & Transport',
    contractor: 'Mothercat Construction Ltd',
    budgetNGN: 6_500_000_000,
    amountReleasedNGN: 3_250_000_000,
    progressPercent: 48,
    status: 'In Progress',
    startDate: '2024-01-15',
    expectedCompletion: '2026-01-15',
    description:
      'Dualisation of 14km of the strategic Osogbo–Ikirun–Ila highway, featuring side drains, pedestrian walkways, bus lay-bys, and road markings. Critical link connecting Osogbo to Kwara State border.',
    co2SavedKg: 198_000,
    beneficiaries: 560_000,
  },
  {
    id: 'proj-008',
    title: 'Free Maternal & Child Health Programme — Ife North',
    constituency: 'Ife North',
    lga: 'Ife North',
    category: 'Healthcare',
    contractor: 'State Ministry of Health (Direct Labour)',
    budgetNGN: 180_000_000,
    amountReleasedNGN: 180_000_000,
    progressPercent: 100,
    status: 'Completed',
    startDate: '2023-01-01',
    expectedCompletion: '2023-12-31',
    description:
      'Free antenatal, delivery, and postnatal services for all pregnant women in Ife North LGA. Programme covered vaccines, drugs, and ambulance services for 12 months.',
    co2SavedKg: 4_200,
    beneficiaries: 18_000,
  },
];

// ── CIVIC FLASHCARDS ─────────────────────────────────────────
export const mockFlashcards: CivicFlashcard[] = [
  // ── State Government
  {
    id: 'fc-001',
    category: 'State Government',
    question: 'Who is the executive head of Osun State government?',
    answer:
      'The Governor of Osun State. The Governor is elected by popular vote for a 4-year term (renewable once) and is responsible for implementing state laws, managing the executive branch, and overseeing the state budget.',
    difficulty: 'Beginner',
    icon: '🏛️',
  },
  {
    id: 'fc-002',
    category: 'State Government',
    question: 'How many Local Government Areas (LGAs) does Osun State have?',
    answer:
      '30 LGAs and 1 Area Office (Modakeke). Osun State was created on August 27, 1991, carved from the old Oyo State. Its 30 LGAs include major ones like Osogbo (capital), Ilesa, Ife, Ede, Iwo, and Ejigbo.',
    difficulty: 'Beginner',
    icon: '🗺️',
  },
  {
    id: 'fc-003',
    category: 'State Government',
    question: 'What is the role of the Osun State House of Assembly?',
    answer:
      'The House of Assembly is the legislature of Osun State. It makes state laws, approves the state budget, confirms governor\'s appointments, and oversees the executive. It has 26 elected members representing constituencies across the 30 LGAs.',
    difficulty: 'Intermediate',
    icon: '⚖️',
  },
  {
    id: 'fc-004',
    category: 'State Government',
    question: 'What is the State Executive Council (SEC)?',
    answer:
      'The State Executive Council (SEC) is a body comprising the Governor, Deputy Governor, and all Commissioners. It advises the Governor on key policy decisions, approves state expenditure plans, and coordinates the activities of all ministries and parastatals.',
    difficulty: 'Intermediate',
    icon: '📋',
  },
  // ── Local Government
  {
    id: 'fc-005',
    category: 'Local Government',
    question: 'What is the primary function of a Local Government Council?',
    answer:
      'LGCs provide grassroots governance. Their duties include: maintenance of public roads and drains, primary healthcare delivery, primary school oversight, registration of births/deaths, environmental sanitation, and collection of local taxes and rates.',
    difficulty: 'Beginner',
    icon: '🏘️',
  },
  {
    id: 'fc-006',
    category: 'Local Government',
    question: 'How is an LGA chairperson elected in Osun State?',
    answer:
      'Local Government Chairpersons are elected by registered voters in each LGA via elections conducted by the Osun State Independent Electoral Commission (OSSIEC). The chairperson serves a 3-year term and leads the legislative council of elected councillors.',
    difficulty: 'Intermediate',
    icon: '🗳️',
  },
  {
    id: 'fc-007',
    category: 'Local Government',
    question: 'What is the State-Local Government Joint Account?',
    answer:
      'The Joint Account receives allocations from the Federation Account that belong to both the state and LGAs. The state government distributes LGA portions monthly, but must account for these funds transparently. Citizens can demand for LGA allocation statements under the Freedom of Information Act.',
    difficulty: 'Advanced',
    icon: '💰',
  },
  // ── Citizen Rights
  {
    id: 'fc-008',
    category: 'Citizen Rights',
    question: 'What right does the Freedom of Information (FOI) Act give citizens?',
    answer:
      'The FOI Act 2011 grants every Nigerian the right to request and receive any government document, record, or information within 7 days of application. Government institutions cannot refuse without a valid legal exemption. Violations can be challenged in court.',
    difficulty: 'Intermediate',
    icon: '📜',
  },
  {
    id: 'fc-009',
    category: 'Citizen Rights',
    question: 'How can a citizen report corruption by a government official in Osun State?',
    answer:
      "Citizens can report corruption to: (1) The Economic and Financial Crimes Commission (EFCC), (2) The Independent Corrupt Practices Commission (ICPC), (3) The Osun State Public Complaints Commissioner, or (4) Directly via the Osun State Government's e-petition portal. Anonymous reports are accepted.",
    difficulty: 'Beginner',
    icon: '🔍',
  },
  {
    id: 'fc-010',
    category: 'Citizen Rights',
    question: 'What is a Town Hall Meeting and why does it matter for citizens?',
    answer:
      'A Town Hall Meeting is an official public forum where government officials present budgets, project plans, and reports to citizens for feedback. Citizens are legally entitled to attend, ask questions, and receive responses. Elected officials are required to hold at least one per quarter in Osun State.',
    difficulty: 'Beginner',
    icon: '🤝',
  },
  {
    id: 'fc-011',
    category: 'Citizen Rights',
    question: 'What is the role of the Osun State Auditor-General?',
    answer:
      'The Auditor-General independently audits all state government expenditures annually and submits a public report to the House of Assembly. Citizens can request the Auditor-General\'s annual report via FOI. The report highlights financial irregularities and project cost overruns.',
    difficulty: 'Advanced',
    icon: '🧾',
  },
  // ── Financial Accountability
  {
    id: 'fc-012',
    category: 'Financial Accountability',
    question: 'What is the Osun State annual budget for 2024?',
    answer:
      'The Osun State 2024 Appropriation Bill was ₦273.98 billion. It allocated ₦128.4B (46.9%) to capital expenditure and ₦145.5B (53.1%) to recurrent expenditure. Key capital votes went to infrastructure (roads, hospitals), education, and social protection.',
    difficulty: 'Intermediate',
    icon: '📊',
  },
  {
    id: 'fc-013',
    category: 'Financial Accountability',
    question: 'What is SFTAS and how does it benefit Osun State citizens?',
    answer:
      'SFTAS (State Fiscal Transparency, Accountability and Sustainability) is a World Bank programme that rewards Nigerian states for improving public financial management. Osun State received performance-based grants for publishing budgets online, reducing wage bill fraud, and opening procurement processes to citizens.',
    difficulty: 'Advanced',
    icon: '🌍',
  },
  {
    id: 'fc-014',
    category: 'Financial Accountability',
    question: 'What is the difference between Recurrent and Capital Expenditure?',
    answer:
      'Recurrent Expenditure covers day-to-day running costs: salaries, allowances, utility bills, debt service. Capital Expenditure covers investment in new assets: roads, schools, hospitals, equipment. A state that spends more on capital than recurrent is investing in its future. Citizens should demand a high capital-to-recurrent ratio.',
    difficulty: 'Intermediate',
    icon: '💡',
  },
  {
    id: 'fc-015',
    category: 'Financial Accountability',
    question: 'How does the Open Contracting Data Standard (OCDS) help citizens track projects?',
    answer:
      'OCDS requires governments to publish machine-readable data on contracts: the award, contractor details, contract value, and updates. Citizens and journalists can download this data to detect inflated contracts, ghost contractors, or projects that were paid for but never executed.',
    difficulty: 'Advanced',
    icon: '🔗',
  },
];

// ─── Sample Data for CampusSync ───────────────────────────────────────────────

export const ROOM_TYPES = ['Classroom', 'Seminar Hall', 'Computer Lab', 'Science Lab', 'Auditorium'];
export const EVENT_TYPES = ['Workshop', 'Seminar', 'Examination', 'Technical Event', 'Cultural Event', 'Meeting', 'Competition', 'Training'];
export const EQUIPMENT_OPTIONS = ['Projector', 'Computers', 'Microphone', 'Speakers', 'Smart Board', 'Internet', 'Lab Equipment'];
export const PRIORITY_LEVELS = ['High', 'Medium', 'Low'];

export const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const initialResources = [
  // Classrooms
  { id: 'r1',  name: 'Classroom 101',   type: 'Classroom',    capacity: 60,  equipment: ['Projector', 'Smart Board'], available: true },
  { id: 'r2',  name: 'Classroom 102',   type: 'Classroom',    capacity: 60,  equipment: ['Projector'],               available: true },
  { id: 'r3',  name: 'Classroom 103',   type: 'Classroom',    capacity: 45,  equipment: ['Smart Board'],             available: true },
  // Computer Labs
  { id: 'r4',  name: 'Computer Lab 1',  type: 'Computer Lab', capacity: 50,  equipment: ['Computers', 'Projector', 'Internet'],           available: true },
  { id: 'r5',  name: 'Computer Lab 2',  type: 'Computer Lab', capacity: 50,  equipment: ['Computers', 'Projector', 'Internet'],           available: true },
  { id: 'r6',  name: 'Computer Lab 3',  type: 'Computer Lab', capacity: 40,  equipment: ['Computers', 'Internet'],                        available: true },
  // Science Labs
  { id: 'r7',  name: 'Science Lab 1',   type: 'Science Lab',  capacity: 35,  equipment: ['Lab Equipment', 'Projector'],                   available: true },
  { id: 'r8',  name: 'Science Lab 2',   type: 'Science Lab',  capacity: 35,  equipment: ['Lab Equipment'],                                available: true },
  // Seminar Halls
  { id: 'r9',  name: 'Seminar Hall A',  type: 'Seminar Hall', capacity: 200, equipment: ['Projector', 'Microphone', 'Speakers', 'Smart Board'], available: true },
  { id: 'r10', name: 'Seminar Hall B',  type: 'Seminar Hall', capacity: 150, equipment: ['Projector', 'Microphone', 'Speakers'],               available: true },
  // Auditorium
  { id: 'r11', name: 'Auditorium',      type: 'Auditorium',   capacity: 500, equipment: ['Projector', 'Microphone', 'Speakers', 'Smart Board'], available: true },
];

// today's date string
const today = new Date().toISOString().split('T')[0];

export const initialEvents = [
  {
    id: 'e1',
    name: 'AI & Machine Learning Workshop',
    organizer: 'Dr. Priya Sharma',
    participants: 45,
    date: today,
    startTime: '09:00',
    duration: 2,
    type: 'Workshop',
    roomType: 'Computer Lab',
    equipment: ['Computers', 'Projector', 'Internet'],
    priority: 'High',
    status: 'Pending',
    assignedRoom: null,
    assignedStartTime: null,
  },
  {
    id: 'e2',
    name: 'Coding Competition',
    organizer: 'Prof. Arjun Mehta',
    participants: 48,
    date: today,
    startTime: '10:00',
    duration: 2,
    type: 'Competition',
    roomType: 'Computer Lab',
    equipment: ['Computers', 'Internet'],
    priority: 'High',
    status: 'Pending',
    assignedRoom: null,
    assignedStartTime: null,
  },
  {
    id: 'e3',
    name: 'Industry Expert Seminar',
    organizer: 'Dr. Kavita Reddy',
    participants: 180,
    date: today,
    startTime: '10:00',
    duration: 2,
    type: 'Seminar',
    roomType: 'Seminar Hall',
    equipment: ['Projector', 'Microphone', 'Speakers'],
    priority: 'High',
    status: 'Pending',
    assignedRoom: null,
    assignedStartTime: null,
  },
  {
    id: 'e4',
    name: 'Robotics Demonstration',
    organizer: 'Prof. Rajan Kumar',
    participants: 30,
    date: today,
    startTime: '14:00',
    duration: 2,
    type: 'Technical Event',
    roomType: 'Science Lab',
    equipment: ['Lab Equipment', 'Projector'],
    priority: 'Medium',
    status: 'Pending',
    assignedRoom: null,
    assignedStartTime: null,
  },
  {
    id: 'e5',
    name: 'Python Training',
    organizer: 'Ms. Ananya Singh',
    participants: 40,
    date: today,
    startTime: '10:00',   // intentional conflict with e1 for the demo
    duration: 2,
    type: 'Training',
    roomType: 'Computer Lab',
    equipment: ['Computers', 'Projector', 'Internet'],
    priority: 'Medium',
    status: 'Pending',
    assignedRoom: null,
    assignedStartTime: null,
  },
  {
    id: 'e6',
    name: 'Cybersecurity Workshop',
    organizer: 'Mr. Vikram Nair',
    participants: 35,
    date: today,
    startTime: '13:00',
    duration: 3,
    type: 'Workshop',
    roomType: 'Computer Lab',
    equipment: ['Computers', 'Internet', 'Projector'],
    priority: 'Medium',
    status: 'Pending',
    assignedRoom: null,
    assignedStartTime: null,
  },
  {
    id: 'e7',
    name: 'Project Presentation',
    organizer: 'Dr. Suresh Iyer',
    participants: 55,
    date: today,
    startTime: '09:00',
    duration: 2,
    type: 'Technical Event',
    roomType: 'Classroom',
    equipment: ['Projector', 'Smart Board'],
    priority: 'Medium',
    status: 'Pending',
    assignedRoom: null,
    assignedStartTime: null,
  },
  {
    id: 'e8',
    name: 'Cultural Committee Meeting',
    organizer: 'Ms. Pooja Verma',
    participants: 20,
    date: today,
    startTime: '15:00',
    duration: 1,
    type: 'Meeting',
    roomType: 'Classroom',
    equipment: ['Projector'],
    priority: 'Low',
    status: 'Pending',
    assignedRoom: null,
    assignedStartTime: null,
  },
];

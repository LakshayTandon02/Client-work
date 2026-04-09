export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  departmentId: string;
  experience: string;
  education: string;
  image: string;
  bio: string;
  consultationFee: number;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  longDescription: string;
}

export const departments: Department[] = [
  {
    id: "cardiology",
    name: "Cardiology",
    description: "Expert care for your heart and vascular system.",
    icon: "Heart",
    longDescription: "Our Cardiology department provides comprehensive diagnostic and therapeutic services for patients with heart disease. We use state-of-the-art technology to ensure the best outcomes for our patients."
  },
  {
    id: "neurology",
    name: "Neurology",
    description: "Advanced treatment for brain and nervous system disorders.",
    icon: "Brain",
    longDescription: "The Neurology department at Kalyani Hospital specializes in the diagnosis and treatment of all categories of conditions and disease involving the central and peripheral nervous systems."
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    description: "Compassionate healthcare for infants, children, and adolescents.",
    icon: "Baby",
    longDescription: "Our Pediatrics department is dedicated to providing the highest quality of care for children from birth through adolescence. We focus on preventive care as well as treating acute and chronic illnesses."
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    description: "Specialized care for bones, joints, and muscles.",
    icon: "Stethoscope",
    longDescription: "The Orthopedics department provides expert care for a wide range of musculoskeletal conditions, from sports injuries to complex joint replacements."
  },
  {
    id: "oncology",
    name: "Oncology",
    description: "Comprehensive cancer care with a personalized approach.",
    icon: "Activity",
    longDescription: "Our Oncology department offers a full range of cancer treatments, including chemotherapy, radiation therapy, and surgical oncology, supported by a multidisciplinary team."
  },
  {
    id: "dermatology",
    name: "Dermatology",
    description: "Expert treatment for skin, hair, and nail conditions.",
    icon: "User",
    longDescription: "The Dermatology department provides comprehensive care for all skin types and conditions, from common skin rashes to complex dermatological diseases."
  }
];

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Arvind Sharma",
    specialty: "Senior Cardiologist",
    departmentId: "cardiology",
    experience: "15+ Years",
    education: "MD, DM (Cardiology)",
    image: "https://picsum.photos/seed/doc1/400/400",
    bio: "Dr. Sharma is a renowned cardiologist with extensive experience in interventional cardiology and heart failure management.",
    consultationFee: 300
  },
  {
    id: "d2",
    name: "Dr. Meera Reddy",
    specialty: "Interventional Cardiologist",
    departmentId: "cardiology",
    experience: "10+ Years",
    education: "MD, DNB (Cardiology)",
    image: "https://picsum.photos/seed/doc2/400/400",
    bio: "Dr. Reddy specializes in complex coronary interventions and structural heart disease.",
    consultationFee: 300
  },
  {
    id: "d3",
    name: "Dr. Rajesh Gupta",
    specialty: "Neurologist",
    departmentId: "neurology",
    experience: "12+ Years",
    education: "MD, DM (Neurology)",
    image: "https://picsum.photos/seed/doc3/400/400",
    bio: "Dr. Gupta has a special interest in stroke management and neuro-rehabilitation.",
    consultationFee: 300
  },
  {
    id: "d4",
    name: "Dr. Sunita Rao",
    specialty: "Pediatrician",
    departmentId: "pediatrics",
    experience: "8+ Years",
    education: "MD (Pediatrics)",
    image: "https://picsum.photos/seed/doc4/400/400",
    bio: "Dr. Rao is passionate about child health and development, with a focus on neonatal care.",
    consultationFee: 300
  },
  {
    id: "d5",
    name: "Dr. Vikram Singh",
    specialty: "Orthopedic Surgeon",
    departmentId: "orthopedics",
    experience: "20+ Years",
    education: "MS (Ortho), MCh",
    image: "https://picsum.photos/seed/doc5/400/400",
    bio: "Dr. Singh is an expert in joint replacement surgeries and sports medicine.",
    consultationFee: 300
  },
  {
    id: "d6",
    name: "Dr. Ananya Iyer",
    specialty: "Oncologist",
    departmentId: "oncology",
    experience: "14+ Years",
    education: "MD, DM (Oncology)",
    image: "https://picsum.photos/seed/doc6/400/400",
    bio: "Dr. Iyer specializes in medical oncology and has been involved in several clinical trials for cancer treatment.",
    consultationFee: 300
  }
];

export const hospitalDetails = {
  name: "Kalyani Hospital",
  address: "123, Healthcare Lane, Medical District, New Delhi, 110001",
  phone: "+91 11 2345 6789",
  email: "info@kalyanihospital.com",
  emergency: "+91 11 2345 0000",
  hours: "24/7 Emergency Services | OPD: 9:00 AM - 8:00 PM",
  socials: {
    facebook: "#",
    twitter: "#",
    linkedin: "#",
    instagram: "#"
  }
};

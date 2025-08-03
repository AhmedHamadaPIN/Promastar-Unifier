import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ChevronDown, BookOpen, Sparkles, Building2, 
  DollarSign, FileText, Users, MessageSquare, Settings, 
  BarChart3, HelpCircle, Zap,
  MapPin, Send
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

// TYPE DEFINITIONS
// ========================================
type SectionCategory = 'introduction' | 'gettingStarted' | 'coreFeatures' | 'advancedTopics' | 'reporting' | 'integrations' | 'community';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  category: SectionCategory;
}

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
}

interface FAQ {
    question: string;
    answer: string;
}

// Reusable UI Components
// ========================================

const Accordion: React.FC<AccordionProps> = ({ title, children, icon, isOpen, onToggle }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left text-lg font-semibold text-gray-800"
      >
        <div className="flex items-center gap-3">
            {icon}
            <span className='text-base'>{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-2 text-gray-700 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, gradient }) => (
    <div className={`text-center p-8 ${gradient} rounded-2xl border border-transparent shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-white`}>
      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-5 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="opacity-90">{description}</p>
    </div>
  );

const TestimonialCard: React.FC<Testimonial> = ({ name, role, quote, avatar }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg border-gray-100 text-center flex flex-col items-center">
      <img src={avatar} alt={name} className="w-24 h-24 rounded-full mx-auto mb-5 border-4 border-blue-200 object-cover"/>
      <div className="flex-grow">
        <p className="text-gray-600 italic mb-6">"{quote}"</p>
      </div>
      <div>
        <h4 className="font-bold text-gray-900 text-lg">{name}</h4>
        <p className="text-sm text-blue-600 font-medium">{role}</p>
      </div>
    </div>
  );

const FAQItem: React.FC<{ faq: FAQ; isOpen: boolean; onToggle: () => void }> = ({ faq, isOpen, onToggle }) => (
    <Accordion title={faq.question} isOpen={isOpen} onToggle={onToggle} icon={<HelpCircle className="w-5 h-5 text-blue-500"/>}>
      {faq.answer}
    </Accordion>
  );

// Chart Data and Options
// ========================================
const costDonutData = {
    labels: ['Line items with WBS code', 'Line items with fund code', 'Line items with both', 'Other'],
    datasets: [{
      data: [45, 25, 20, 10],
      backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
      borderColor: '#ffffff',
      borderWidth: 4,
    }],
  };

  const costBarData = {
    labels: ['Commitments', 'Invoices', 'Cost Sheet', 'Journal Entries', 'Change Orders'],
    datasets: [
      {
        label: 'Budget Amount',
        data: [100000, 180000, 80000, 150000, 110000],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Actual Cost',
        data: [95000, 165000, 75000, 120000, 98000],
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };
  
  const costBarOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { family: 'Inter, sans-serif', size: 16 },
        bodyFont: { family: 'Inter, sans-serif', size: 14 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
          borderDash: [2, 4],
        },
        ticks: {
          color: '#6b7280',
          font: { family: 'Inter, sans-serif' },
          callback: function(value: any) {
            return '$' + value / 1000 + 'K';
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: { family: 'Inter, sans-serif' },
        }
      }
    }
  };

// App Content Data
// ========================================
const testimonials: Testimonial[] = [
    {
      name: 'Sarah Johnson',
      role: 'Project Manager, ABC Corp',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      quote: 'This guide has been an invaluable resource for our team. The detailed explanations and practical examples for cost management are top-notch!',
    },
    {
      name: 'David Lee',
      role: 'Unifier Consultant, Innovate Solutions',
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
      quote: 'A comprehensive and well-structured guide. It has significantly reduced the time I spend training new users on our Unifier instance.',
    },
    {
      name: 'Maria Garcia',
      role: 'Financial Analyst, BuildWell Inc.',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      quote: 'As a new administrator, this guide made the learning curve so much smoother. The community and support sections are fantastic.',
    },
  ];
  
  const faqs: FAQ[] = [
    {
      question: 'What is the primary purpose of this guide?',
      answer: 'This guide serves as a comprehensive resource for understanding and utilizing Oracle Unifier\'s Business Processes (BPs), with a special focus on cost management, reporting, and integrations. It aims to provide clear, actionable insights for users at all levels.',
    },
    {
      question: 'Who is the target audience for this guide?',
      answer: 'The guide is designed for a wide range of Unifier users, including project managers, cost controllers, system administrators, and consultants. Whether you are new to Unifier or an experienced user, you will find valuable information here.',
    },
    {
      question: 'How often is the content updated?',
      answer: 'We strive to keep the content current with the latest Oracle Unifier updates and best practices. Major updates are rolled out quarterly, with minor adjustments made as needed.',
    },
    {
      question: 'Can I contribute to the guide?',
      answer: 'Absolutely! We welcome contributions and suggestions from the community. Please use the contact form to send us your ideas, and our team will review them for inclusion in future updates.',
    },
  ];

const categories: Record<SectionCategory, { title: string; color: string }> = {
    introduction: { title: 'Introduction', color: 'text-purple-600' },
    gettingStarted: { title: 'Getting Started', color: 'text-green-600' },
    coreFeatures: { title: 'Core Features', color: 'text-blue-600' },
    advancedTopics: { title: 'Advanced Topics', color: 'text-red-600' },
    reporting: { title: 'Reporting & Analytics', color: 'text-yellow-600' },
    integrations: { title: 'Integrations', color: 'text-indigo-600' },
    community: { title: 'Community & Support', color: 'text-pink-600' },
};

const sections: Section[] = [
    { id: 'introduction', title: 'Welcome to the Guide', icon: <BookOpen size={20} />, category: 'introduction' },
    { id: 'glossary', title: 'Glossary', icon: <FileText size={20} />, category: 'introduction' },
    { id: 'setup', title: 'Initial Setup', icon: <Settings size={20} />, category: 'gettingStarted' },
    { id: 'navigation', title: 'Navigating Unifier', icon: <MapPin size={20} />, category: 'gettingStarted' },
    { id: 'costManagement', title: 'Cost Management', icon: <DollarSign size={20} />, category: 'coreFeatures' },
    { id: 'documentControl', title: 'Document Control', icon: <FileText size={20} />, category: 'coreFeatures' },
    { id: 'collaboration', title: 'Team Collaboration', icon: <Users size={20} />, category: 'coreFeatures' },
    { id: 'customReports', title: 'Custom Reports', icon: <BarChart3 size={20} />, category: 'reporting' },
    { id: 'dashboards', title: 'Dashboards', icon: <Sparkles size={20} />, category: 'reporting' },
    { id: 'restApi', title: 'REST API', icon: <Zap size={20} />, category: 'integrations' },
    { id: 'dataConnectors', title: 'Data Connectors', icon: <Building2 size={20} />, category: 'integrations' },
    { id: 'contact', title: 'Contact & Contribute', icon: <Send size={20} />, category: 'community' },
    { id: 'support', title: 'Getting Support', icon: <HelpCircle size={20} />, category: 'community' },
    { id: 'forum', title: 'Community Forum', icon: <MessageSquare size={20} />, category: 'community' },
];

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction');
  const [scrolled, setScrolled] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<number | null>(0);

  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionChange = (id: string) => {
    setActiveSection(id);
    setSidebarOpen(false);
    mainContentRef.current?.scrollTo(0, 0);
  };

  const renderContent = () => {
    const section = sections.find(s => s.id === activeSection);

    const contents: { [key: string]: React.ReactNode } = {
      glossary: (
        <div className="space-y-8 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-gray-900">Glossary of Terms</h1>
          <p className="text-lg text-gray-600">
            An A-Z list of common terms, acronyms, and concepts you'll encounter when working with Oracle Unifier Business Processes.
          </p>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Business Process (BP)</h3>
              <p className="text-gray-700 mt-2">A configurable module in Unifier designed to automate a specific business workflow, such as a Request for Information (RFI), a Change Order, or an Invoice. BPs consist of forms, workflows, and logs.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Data Element (DE)</h3>
              <p className="text-gray-700 mt-2">The fundamental building block of a form in Unifier. Each field on a form is a Data Element, which has properties like data type (text, number, date), input method (pull-down, text box), and validation rules.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Workflow</h3>
              <p className="text-gray-700 mt-2">The sequence of steps and actions that a BP record moves through from creation to completion. Workflows define who can act on a record at each step and what actions they can take.</p>
            </div>
          </div>
        </div>
      ),
      introduction: (
        <div className="space-y-12">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Oracle Unifier BP Guide</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Your comprehensive resource for mastering business processes in Oracle Unifier, from cost management to advanced integrations.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Core Cost Management" 
              description="Master budget, commitments, and cash flow."
              icon={<DollarSign size={28} />} 
              gradient="bg-gradient-to-br from-blue-500 to-blue-700"
            />
            <FeatureCard 
              title="Advanced Business Processes" 
              description="Customize complex workflows and data structures."
              icon={<Zap size={28} />} 
              gradient="bg-gradient-to-br from-purple-500 to-purple-700"
            />
            <FeatureCard 
              title="Reporting & Dashboards" 
              description="Create insightful analytics and visualizations."
              icon={<BarChart3 size={28} />} 
              gradient="bg-gradient-to-br from-green-500 to-green-700"
            />
          </div>
        </div>
      ),
      costManagement: (
        <div className="space-y-12">
            <h2 className="text-4xl font-bold text-gray-900 text-center">Cost Management Deep Dive</h2>
            <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-bold mb-4">Cost Distribution Analysis</h3>
                    <p className="text-gray-600 mb-6">Visualize how costs are distributed across different codes. This donut chart illustrates the percentage of line items associated with WBS codes, fund codes, or both, providing a clear overview of your project's financial structure.</p>
                    <div className="h-80 relative">
                        <Doughnut data={costDonutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' }} }} />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-bold mb-4">Budget vs. Actuals</h3>
                    <p className="text-gray-600 mb-6">Track your project's financial health by comparing budgeted amounts against actual costs for key business processes. This bar chart helps identify potential overruns and informs forecasting.</p>
                    <div className="h-80 relative">
                        <Bar data={costBarData} options={costBarOptions} />
                    </div>
                </div>
            </div>
        </div>
      ),
      'document-control': (
        <div className="space-y-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Document Business Process (BP)</h1>
          <p className="text-lg text-gray-600">
            Document BPs function as a digital "envelope" to package and manage a set of files (like drawings or specifications) that need to flow systematically from one group or department to another within the project or organization. They are essential for formal document control and collaboration.
          </p>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Key Characteristics & Sub-Types</h3>
            <ul className="list-disc list-inside space-y-3 text-gray-700">
              <li><strong>Individual Status Control:</strong> Each file attached as a line item can be approved or rejected independently within the same package. This is crucial for managing formal exchanges and reviews.</li>
              <li><strong>Common Use Cases:</strong> Ideal for managing Submittals and Transmittals where multiple documents are formally bundled for review and distribution.</li>
            </ul>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub-Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folder Structure Handling</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">With folder structure</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Allows documents and their original folder hierarchy to be uploaded and displayed within the BP form.</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Maintained</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Without folder structure</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Ignores the original folder structure, attaching documents in a flat list.</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Ignored; flat list</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
      'line-item-bp': (
        <div className="space-y-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Line Item Business Process (BP)</h1>
          <p className="text-lg text-gray-600">
            The most versatile BP type, used for any generic data. It's perfect for documenting miscellaneous information, creating lists, or collecting data that doesn't fit into more restricted BP types. It excels at filtering large numbers of company records into smaller, project-specific lists.
          </p>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Key Features</h3>
            <ul className="list-disc list-inside space-y-3 text-gray-700">
              <li><strong>Detail Form and Line Item List:</strong> Utilizes a separate detail form for entering individual line items, which then appear on a consolidated list.</li>
              <li><strong>Grid View:</strong> For short line items, users can enter information directly into the line item list using a convenient "grid view."</li>
              <li><strong>Line Item Status Control:</strong> Can be designed to provide granular control over modifications to individual line items based on their specific status.</li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Sub-Types & Applications</h3>
            <ul className="list-disc list-inside space-y-4 text-gray-700">
              <li><strong>Generic:</strong> The default sub-type for general data collection needs, such as meeting minutes, vendor contact lists, or simple logs. Can roll up data across shells to a code-and-record-based manager, requiring data pickers for each manager class and a configurable manager picker.</li>
              <li><strong>Line items to filter business process records:</strong> Specifically designed to filter large numbers of company records (e.g., from a master vendor list) into smaller, more relevant lists for specific projects. Requires a BP picker to specify the source BP and a uuu_line_item_status field to define the status for inclusion/exclusion.</li>
              <li><strong>Preventive Maintenance (If module available):</strong> Used for proactively and regularly maintaining assets, even when no issue has been reported. Includes specific classifications: Asset, Asset Template, PM Book, PM Book Template, and Meter Reading.</li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">General Design Requirements (uDesigner)</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Create a data structure (if necessary).</li>
              <li>Launch the design.</li>
              <li>Design an upper form.</li>
              <li>Design a detail form.</li>
              <li>Design a line item list.</li>
            </ol>
          </div>
        </div>
      ),
      'reporting-analytics': (
        <div className="space-y-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Reporting & Analytics</h1>
          <p className="text-lg text-gray-600">
            Oracle Unifier provides robust reporting and analytics capabilities to gain insights from your BP data. This includes standard reports, custom reports, and dashboards.
          </p>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Standard Reports</h3>
            <p className="text-gray-700">Unifier comes with a suite of pre-built standard reports that cover common operational and financial metrics. These reports are often sufficient for basic needs and provide quick access to key information.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Custom Reports (Report Designer)</h3>
            <p className="text-gray-700 mb-2">For more specific analytical needs, Unifier's Report Designer allows users to create highly customized reports. You can select specific data elements, apply filters, define sorting, and even incorporate charts and graphs.</p>
            <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Steps to create a Custom Report:</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Navigate to Company Workspace &gt; Reports &gt; Report Designer.</li>
              <li>Click New and select the BP or data source.</li>
              <li>Drag and drop desired data elements into the report layout.</li>
              <li>Configure filters, sorting, and grouping as needed.</li>
              <li>Add charts or pivot tables for visual analysis.</li>
              <li>Save and publish the report for user access.</li>
            </ol>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Dashboards</h3>
            <p className="text-gray-700">Dashboards provide an interactive, visual summary of key performance indicators (KPIs) and critical project data. They typically aggregate information from multiple BPs and reports, offering a high-level overview for decision-makers.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Reporting on Auto-Created Entities</h3>
            <p className="text-gray-700">Data generated through auto-creation methods (e.g., auto-created projects, shells, BP records, or line items) is stored within Unifier's database just like any other manually entered data. This means that all standard and custom reporting capabilities apply equally to auto-created entities. You can include data elements from auto-created BPs in your reports and dashboards to track their status, progress, and any associated financial or operational metrics. The audit logs of the source BPs also provide valuable information on the auto-creation events themselves, which can be leveraged for auditing and process analysis.</p>
          </div>
        </div>
      ),
      support: (
        <div className="space-y-16">
            <div>
                <h2 className="text-4xl font-bold text-gray-900 text-center mb-10">Community Testimonials</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} />
                    ))}
                </div>
            </div>
            <div>
                <h2 className="text-4xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
                <div className="max-w-4xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem 
                            key={index} 
                            faq={faq} 
                            isOpen={openFaqId === index}
                            onToggle={() => setOpenFaqId(openFaqId === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </div>
      ),
      contact: (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-10">Get In Touch</h2>
            <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
                <form className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input type="text" id="subject" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea id="message" rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                        <Send size={18} />
                        <span>Send Message</span>
                    </button>
                </form>
            </div>
        </div>
      ),
      'data-connectors': (
        <div className="space-y-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Data Elements & Advanced Logic</h1>
          <p className="text-lg text-gray-600">
            Data Elements (DEs) are the fundamental building blocks of all forms in Unifier, defining the characteristics of every field. Mastering their use and combining them with advanced logic is essential for creating powerful, dynamic, and user-friendly Business Processes.
          </p>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Key Data Element Properties</h3>
            <ul className="list-disc list-inside space-y-3 text-gray-700">
              <li><strong>Data Type:</strong> Defines the kind of data the field will hold (e.g., Text, Number, Date, Currency).</li>
              <li><strong>Input Method:</strong> Determines how users interact with the field (e.g., Text Box, Pull-Down Menu, Radio Buttons, Checkbox).</li>
              <li><strong>Validation Rules:</strong> Enforces data integrity by setting constraints (e.g., required field, character limits, numeric ranges).</li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Advanced Logic with Formulas</h3>
            <p className="text-gray-700 mb-6">
              Formulas are a powerful tool for automating calculations and logic within a BP form. They can be used to perform simple mathematical operations, concatenate strings, and even implement complex conditional logic based on data entered into other fields. Common uses include calculating totals, due dates, or populating fields based on user selections.
            </p>
            <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common Formula Functions:</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Mathematical:</strong> SUM(), AVG(), IF(), ROUND(), ABS(), etc.</li>
              <li><strong>Date/Time:</strong> DATE(), TODAY(), DAYS(), WORKDAYS(), etc.</li>
              <li><strong>Text:</strong> CONCATENATE(), LEFT(), RIGHT(), MID(), LEN(), FIND(), etc.</li>
              <li><strong>Logical:</strong> AND(), OR(), NOT(), IF().</li>
            </ul>
            <h4 className="text-xl font-semibold text-gray-800 mt-8 mb-3">Example Formula (Concatenation):</h4>
            <p className="text-gray-700 mb-2">To combine a project number and description:</p>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 overflow-x-auto"><code>CONCATENATE("Project-", [Project Number], "-", [Project Description])</code></pre>
            <h4 className="text-xl font-semibold text-gray-800 mt-8 mb-3">Example Formula (Conditional Logic):</h4>
            <p className="text-gray-700 mb-2">To calculate a discount based on total amount:</p>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 overflow-x-auto"><code>IF([Total Amount] &gt; 10000, [Total Amount] * 0.05, 0)</code></pre>
          </div>
        </div>
      ),
    };

    if (contents[activeSection]) {
      return contents[activeSection];
    }

    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          {section?.icon && <div className="text-6xl mb-6 opacity-50 text-gray-400">{section.icon}</div>}
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Content Coming Soon</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Detailed information about {section?.title} will be added here. 
            This section will cover comprehensive guidelines, best practices, and implementation details.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-sm shadow-md' : 'bg-white'}`}>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open sidebar</span>
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex-shrink-0 flex items-center gap-3 ml-4 lg:ml-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Oracle Unifier BP Guide</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16 max-w-screen-2xl mx-auto">
        <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-white border-r border-gray-200 z-40 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
              {Object.entries(categories).map(([categoryKey, category]) => (
                <div key={categoryKey}>
                  <h3 className={`px-2 py-2 text-sm font-semibold ${category.color}`}>{category.title}</h3>
                  <div className="space-y-1">
                    {sections.filter(s => s.category === categoryKey).map(section => (
                      <button
                        key={section.id}
                        onClick={() => handleSectionChange(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm font-medium transition-all duration-200 ${activeSection === section.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`}>
                        {section.icon}
                        <span>{section.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">Created by Ahmed Hamada</p>
            </div>
          </div>
        </aside>

        <main ref={mainContentRef} className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-4rem)]">
          {renderContent()}
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default App;
'use client';

import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { HelpCircle, MessageSquare, Book, Video, Mail, Phone, FileText, Search } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'How do I create a new budget?',
    answer: 'Navigate to Budgets page, click "Create Budget", fill in the required details including department, amount, and period, then submit.'
  },
  {
    question: 'How do approval workflows work?',
    answer: 'Approval workflows are configured in Approval Rules. Each rule defines amount thresholds, approver roles, and departments. Requests matching these criteria are automatically routed to appropriate approvers.'
  },
  {
    question: 'Can I export financial reports?',
    answer: 'Yes! Go to the Reports page, select your report type and date range, then click "Generate Report". You can export in PDF, Excel, or CSV formats.'
  },
  {
    question: 'How do I add a new department?',
    answer: 'Go to Departments page, click "Add Department", enter the department name, description, manager, and budget allocation, then save.'
  },
  {
    question: 'What currencies are supported?',
    answer: 'The system supports multiple currencies. Visit Currency Settings to add new currencies, set exchange rates, and configure your base currency.'
  },
  {
    question: 'How do I track recurring expenses?',
    answer: 'Go to Recurring Expenses page to manage subscriptions and recurring payments. You can set frequency, track next payment dates, and pause/resume subscriptions.'
  }
];

const resources = [
  { icon: Book, title: 'User Guide', description: 'Comprehensive guide to using the system', color: 'emerald' },
  { icon: Video, title: 'Video Tutorials', description: 'Step-by-step video instructions', color: 'blue' },
  { icon: FileText, title: 'API Documentation', description: 'Technical documentation for developers', color: 'purple' },
  { icon: MessageSquare, title: 'Community Forum', description: 'Connect with other users', color: 'orange' },
];

const contactOptions = [
  { icon: Mail, title: 'Email Support', detail: 'support@company.com', color: 'emerald' },
  { icon: Phone, title: 'Phone Support', detail: '+1 (555) 123-4567', color: 'blue' },
  { icon: MessageSquare, title: 'Live Chat', detail: 'Available 24/7', color: 'purple' },
];

export default function OrgHelp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-gray-900">Help & Support</h2>
        <p className="mt-1 text-gray-600">Get help and support resources</p>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {contactOptions.map((option) => {
          const Icon = option.icon;
          const bgColor = `bg-${option.color}-100`;
          const textColor = `text-${option.color}-600`;
          
          return (
            <Card key={option.title} className="p-6 transition-shadow cursor-pointer hover:shadow-md">
              <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${textColor}`} />
              </div>
              <h3 className="mb-2 text-gray-900">{option.title}</h3>
              <p className="text-sm text-gray-600">{option.detail}</p>
            </Card>
          );
        })}
      </div>

      {/* Resources */}
      <div>
        <h3 className="mb-4 text-lg text-gray-900">Resources</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {resources.map((resource) => {
            const Icon = resource.icon;
            const bgColor = `bg-${resource.color}-100`;
            const textColor = `text-${resource.color}-600`;
            
            return (
              <Card key={resource.title} className="p-4 transition-shadow cursor-pointer hover:shadow-md">
                <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${textColor}`} />
                </div>
                <h4 className="mb-1 text-sm text-gray-900">{resource.title}</h4>
                <p className="text-xs text-gray-600">{resource.description}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* FAQs */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-6 h-6 text-emerald-600" />
          <h3 className="text-lg text-gray-900">Frequently Asked Questions</h3>
        </div>
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="overflow-hidden border border-gray-200 rounded-lg">
              <button
                className="flex items-center justify-between w-full px-4 py-3 text-left transition-colors bg-gray-50 hover:bg-gray-100"
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
              >
                <span className="text-sm text-gray-900">{faq.question}</span>
                <HelpCircle className={`w-4 h-4 text-gray-400 transition-transform ${
                  expandedFaq === idx ? 'rotate-180' : ''
                }`} />
              </button>
              {expandedFaq === idx && (
                <div className="px-4 py-3 bg-white border-t border-gray-200">
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* System Status */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg text-gray-900">System Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-gray-700">Core Services</span>
            </div>
            <span className="text-sm text-emerald-600">Operational</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-gray-700">Database</span>
            </div>
            <span className="text-sm text-emerald-600">Operational</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-gray-700">API Services</span>
            </div>
            <span className="text-sm text-emerald-600">Operational</span>
          </div>
        </div>
      </Card>

      {/* Need More Help */}
      <Card className="p-6 bg-emerald-50 border-emerald-200">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-emerald-100">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2 text-lg text-gray-900">Need More Help?</h3>
            <p className="mb-4 text-sm text-gray-700">
              Can't find what you're looking for? Our support team is here to help you 24/7.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

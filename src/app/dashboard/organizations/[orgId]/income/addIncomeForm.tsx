"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { Textarea } from '@/src/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { incomeSchema } from '@/src/schema';
import FormDialog from '@/src/components/custom/formDialog';
import { toast } from 'react-toastify';

const formFields = [
  { name: 'source' as const, label: 'Income Source', type: 'text' as const, placeholder: 'e.g., Enterprise License Sale' },
  { 
    name: 'category' as const, 
    label: 'Category', 
    type: 'select' as const, 
    options: ['Sales', 'Services', 'Investment', 'Grant', 'Donation', 'Other'] 
  },
  { name: 'amount' as const, label: 'Amount', type: 'number' as const, placeholder: '0.00' },
  { name: 'currency' as const, label: 'Currency', type: 'text' as const, placeholder: 'USD' },
  { name: 'description' as const, label: 'Description', type: 'textarea' as const, placeholder: 'Detailed description' },
  { name: 'receivedDate' as const, label: 'Received Date', type: 'text' as const, placeholder: 'YYYY-MM-DD' },
  { name: 'invoiceNumber' as const, label: 'Invoice Number (Optional)', type: 'text' as const, placeholder: 'INV-2025-XXX' },
  { name: 'client' as const, label: 'Client/Payer', type: 'text' as const, placeholder: 'Client or payer name' },
];

interface AddIncomeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof incomeSchema>) => Promise<void>;
}

export default function AddIncomeForm({ open, onClose, onSubmit }: AddIncomeFormProps) {
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [incomePrompt, setIncomePrompt] = useState('');
  const [generatedData, setGeneratedData] = useState<Partial<z.infer<typeof incomeSchema>> | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);

  // When main dialog opens, show prompt first (fix: useEffect, not useState)
  useEffect(() => {
    if (open) {
      setIsPromptOpen(true);
      setIsFormOpen(false);
      setIncomePrompt('');
      setGeneratedData(undefined);
    }
  }, [open]);

  const handlePromptContinue = async () => {
    if (!incomePrompt.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setIsGenerating(true);
    setGeneratedData(undefined);
    
    try {
      const response = await fetch('/api/generateIncome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: incomePrompt })
      });

      const result = await response.json();

      if (result.success && result.data) {
        setGeneratedData(result.data);
        setIsPromptOpen(false);
        setIsFormOpen(true);
        toast.success('Form generated successfully!');
      } else {
        toast.error(result.error || 'Failed to generate form');
      }
    } catch (error) {
      console.error('Error generating income form:', error);
      toast.error('Failed to generate form. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setIsPromptOpen(false);
    setIsFormOpen(false);
    setIncomePrompt('');
    onClose();
  };

  const handleFormSubmit = async (data: z.infer<typeof incomeSchema>) => {
    await onSubmit(data);
    handleClose();
  };

  return (
    <>
      {/* Income Prompt Dialog */}
      <Dialog open={open && isPromptOpen} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] p-8">
          <DialogHeader className="space-y-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Sparkles className="w-6 h-6 text-emerald-600" />
              Describe Your Income
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              Tell us about the income you want to add. Include details like source, amount, type, frequency, etc.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <Textarea
              placeholder="Example: Monthly subscription revenue of $5,000 from Enterprise clients, received on the 1st of each month via bank transfer..."
              value={incomePrompt}
              onChange={(e) => setIncomePrompt(e.target.value)}
              rows={8}
              className="resize-none text-base p-4 min-h-[200px]"
            />
            <div className="flex gap-3 justify-end pt-4">
              <Button 
                variant="outline" 
                onClick={handleClose} 
                className="px-6 py-2 text-base"
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePromptContinue}
                disabled={!incomePrompt.trim() || isGenerating}
                className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 text-base"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Form
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Income Form Dialog */}
      <FormDialog
        open={open && isFormOpen}
        onClose={handleClose}
        onSubmit={handleFormSubmit}
        title="Add Income"
        description="Record a new income entry"
        schema={incomeSchema}
        fields={formFields}
        defaultValues={generatedData}
        submitLabel="Add Income"
      />
    </>
  );
}

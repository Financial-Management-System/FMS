'use client';

import { useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Coins, Plus, Edit, Trash2, Star, TrendingUp } from 'lucide-react';
import  FormDialog  from '@/src/components/custom/formDialog';
import { z } from 'zod';
import { currencySchema } from '@/src/schema';

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
  lastUpdated: string;
}

const mockCurrencies: Currency[] = [
  { id: '1', code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 1.0, isDefault: true, lastUpdated: '2025-12-14' },
  { id: '2', code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.92, isDefault: false, lastUpdated: '2025-12-14' },
  { id: '3', code: 'GBP', name: 'British Pound', symbol: '£', exchangeRate: 0.79, isDefault: false, lastUpdated: '2025-12-14' },
  { id: '4', code: 'JPY', name: 'Japanese Yen', symbol: '¥', exchangeRate: 149.50, isDefault: false, lastUpdated: '2025-12-14' },
  { id: '5', code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', exchangeRate: 1.35, isDefault: false, lastUpdated: '2025-12-14' },
];

const formFields = [
  { name: 'code' as const, label: 'Currency Code', type: 'text' as const, placeholder: 'e.g., USD, EUR' },
  { name: 'name' as const, label: 'Currency Name', type: 'text' as const, placeholder: 'e.g., US Dollar' },
  { name: 'symbol' as const, label: 'Currency Symbol', type: 'text' as const, placeholder: 'e.g., $, €' },
  { name: 'exchangeRate' as const, label: 'Exchange Rate (to USD)', type: 'number' as const, placeholder: '1.00' },
];

export default function OrgCurrencySettings() {
  const [currencies, setCurrencies] = useState<Currency[]>(mockCurrencies);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);

  const handleAdd = (data: z.infer<typeof currencySchema>) => {
    const newCurrency: Currency = {
      id: Date.now().toString(),
      ...data,
      isDefault: false,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setCurrencies([...currencies, newCurrency]);
    setIsAddOpen(false);
  };

  const handleEdit = (data: z.infer<typeof currencySchema>) => {
    if (!editingCurrency) return;
    setCurrencies(currencies.map(currency =>
      currency.id === editingCurrency.id
        ? { ...currency, ...data, lastUpdated: new Date().toISOString().split('T')[0] }
        : currency
    ));
    setEditingCurrency(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this currency?')) {
      setCurrencies(currencies.filter(currency => currency.id !== id));
    }
  };

  const handleSetDefault = (id: string) => {
    setCurrencies(currencies.map(currency => ({
      ...currency,
      isDefault: currency.id === id
    })));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Currency Settings</h2>
          <p className="mt-1 text-gray-600">Manage multi-currency settings and exchange rates</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Currency
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Currencies</p>
              <p className="mt-1 text-2xl">{currencies.length}</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-100">
              <Coins className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Base Currency</p>
              <p className="mt-1 text-2xl">
                {currencies.find(c => c.isDefault)?.code || 'USD'}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="mt-1 text-2xl">Today</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Exchange Rate Notice */}
      <Card className="p-4 border-blue-200 bg-blue-50">
        <div className="flex gap-3">
          <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900">
              <strong>Exchange Rate Updates:</strong> Exchange rates are updated daily at 12:00 AM UTC. 
              Manual adjustments can be made at any time.
            </p>
          </div>
        </div>
      </Card>

      {/* Currencies List */}
      <div className="space-y-3">
        {currencies.map((currency) => (
          <Card key={currency.id} className="p-6 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100">
                  <span className="text-2xl">{currency.symbol}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg text-gray-900">{currency.name}</h3>
                    {currency.isDefault && (
                      <div className="flex items-center gap-1 px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full">
                        <Star className="w-3 h-3" />
                        <span>Default</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    Code: <span className="text-gray-900">{currency.code}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Exchange Rate</p>
                  <p className="text-lg text-gray-900">{currency.exchangeRate.toFixed(4)}</p>
                  <p className="text-xs text-gray-500">Last updated: {currency.lastUpdated}</p>
                </div>

                <div className="flex gap-2">
                  {!currency.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetDefault(currency.id)}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Set Default
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingCurrency(currency)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {!currency.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(currency.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Currency Dialog */}
      <FormDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        title="Add Currency"
        description="Add a new currency to the system"
        schema={currencySchema}
        fields={formFields}
        submitLabel="Add Currency"
      />

      {/* Edit Currency Dialog */}
      {editingCurrency && (
        <FormDialog
          open={!!editingCurrency}
          onClose={() => setEditingCurrency(null)}
          onSubmit={handleEdit}
          title="Edit Currency"
          description="Update currency details and exchange rate"
          schema={currencySchema}
          fields={formFields}
          defaultValues={{
            code: editingCurrency.code,
            name: editingCurrency.name,
            symbol: editingCurrency.symbol,
            exchangeRate: editingCurrency.exchangeRate,
          }}
          submitLabel="Update Currency"
        />
      )}
    </div>
  );
}

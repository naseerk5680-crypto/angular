// src/app/app.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  // Budget & Filter settings
  monthlyBudget: number = 25000;
  selectedCategoryFilter: string = 'All';

  // Form Fields
  newTitle: string = '';
  newAmount: number | null = null;
  newCategory: string = 'Food & Dining';
  newDate: string = new Date().toISOString().split('T')[0];

  categories: string[] = [
    'Food & Dining', 
    'Rent & Bills', 
    'Shopping', 
    'Entertainment', 
    'Travel', 
    'Health', 
    'Misc'
  ];

  expenses: Expense[] = [];

  ngOnInit(): void {
    this.loadExpenses();
    if (this.expenses.length === 0) {
      this.loadSeedData();
    }
  }

  // Add Expense
  addExpense(): void {
    if (!this.newTitle.trim() || !this.newAmount || this.newAmount <= 0) {
      alert('Please enter a valid title and amount.');
      return;
    }

    const item: Expense = {
      id: Date.now().toString(),
      title: this.newTitle.trim(),
      amount: Number(this.newAmount),
      category: this.newCategory,
      date: this.newDate
    };

    this.expenses.unshift(item);
    this.saveExpenses();

    // Reset Form
    this.newTitle = '';
    this.newAmount = null;
  }

  // Delete Expense
  deleteExpense(id: string): void {
    this.expenses = this.expenses.filter(e => e.id !== id);
    this.saveExpenses();
  }

  // Local Storage Logic
  saveExpenses(): void {
    localStorage.setItem('personal_expenses', JSON.stringify(this.expenses));
  }

  loadExpenses(): void {
    const data = localStorage.getItem('personal_expenses');
    if (data) {
      this.expenses = JSON.parse(data);
    }
  }

  // Computed Properties for Dashboard
  get totalSpent(): number {
    return this.expenses.reduce((sum, e) => sum + e.amount, 0);
  }

  get budgetProgress(): number {
    const percentage = (this.totalSpent / this.monthlyBudget) * 100;
    return Math.min(percentage, 100);
  }

  get filteredExpenses(): Expense[] {
    if (this.selectedCategoryFilter === 'All') {
      return this.expenses;
    }
    return this.expenses.filter(e => e.category === this.selectedCategoryFilter);
  }

  getCategoryTotal(cat: string): number {
    return this.expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  getCategoryPercentage(cat: string): number {
    if (this.totalSpent === 0) return 0;
    return Math.round((this.getCategoryTotal(cat) / this.totalSpent) * 100);
  }

  // Export to CSV Feature
  exportToCSV(): void {
    if (this.expenses.length === 0) {
      alert('No expense data to export.');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,ID,Title,Amount (INR),Category,Date\n';
    this.expenses.forEach(e => {
      csvContent += `${e.id},"${e.title}",${e.amount},"${e.category}",${e.date}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Personal_Expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Initial Seed Data for Demo Presentation
  loadSeedData(): void {
    this.expenses = [
      { id: '1', title: 'Monthly Grocery', amount: 3500, category: 'Food & Dining', date: '2026-10-01' },
      { id: '2', title: 'House Rent', amount: 12000, category: 'Rent & Bills', date: '2026-10-02' },
      { id: '3', title: 'Electricity Bill', amount: 1800, category: 'Rent & Bills', date: '2026-10-04' },
      { id: '4', title: 'Movie Night', amount: 800, category: 'Entertainment', date: '2026-10-05' }
    ];
    this.saveExpenses();
  }
}
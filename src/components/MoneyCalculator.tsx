"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    Wallet,
    TrendingDown,
    Calendar,
    AlertTriangle,
    Lock,
    Sparkles,
    ArrowRight,
    Target,
    BarChart3,
    CheckCircle2,
    Zap,
    Users,
    CalendarDays,
    TrendingUp,
    Clock,
    Heart,
    Shield,
    Eye,
    Briefcase,
    Building2,
    Utensils,
    Car,
    Film,
    Receipt,
    MoreHorizontal,
    Save,
    ChevronDown,
    ChevronUp,
    PiggyBank,
    Lightbulb,
    Info,
    Trash,
    CreditCard
} from 'lucide-react';
import clsx from 'clsx';

// ==================== TYPES ====================
interface ExpenseCategory {
    id: string;
    name: string;
    icon: React.ElementType;
    color: string;
    amount: string;
}

interface BudgetAllocation {
    id: string;
    name: string;
    percentage: number;
    color: string;
    recommended: number;
}

interface SavedData {
    currentBalance: string;
    dailySpending: string;
    fixedExpenses: string;
    monthlyIncome: string;
    familySize: number;
    incomeDay: string;
    incomeType: 'salary' | 'business' | 'freelance' | 'none';
    expectedIncome: string;
    categories: ExpenseCategory[];
    savedAt: string;
    history?: HistoryItem[];
}

interface HistoryItem {
    date: string;
    daysRemaining: number;
    balance: number;
}

interface FinanceInput {
    currentBalance: number;
    dailySpending: number;
    fixedExpenses: number;
    familySize: number;
    incomeDay: number | null;
    incomeType: 'salary' | 'business' | 'freelance' | 'none';
    expectedIncome: number;
}

interface FinanceResult {
    daysRemaining: number;
    runOutDate: Date;
    dailyBudgetToLast30Days: number;
    savingsNeeded: number;
    riskLevel: 'critical' | 'warning' | 'safe';
    criticalDayStart: number;
    daysToIncome: number | null;
    perPersonDaily: number;
    canSurviveToIncome: boolean;
    weeklyBudget: number;
    monthlyBudget: number;
    recommendedSavings: number;
    recommendedInvestment: number;
}

interface SimulationResult {
    reduction: number;
    reductionPercent: number;
    newDaysRemaining: number;
    daysSaved: number;
    newRunOutDate: Date;
}

// ==================== CONSTANTS ====================
const STORAGE_KEY = 'para_kocu_data';

const DEFAULT_CATEGORIES: ExpenseCategory[] = [
    { id: 'food', name: 'Yemek', icon: Utensils, color: 'amber', amount: '' },
    { id: 'transport', name: 'Ulaşım', icon: Car, color: 'blue', amount: '' },
    { id: 'entertainment', name: 'Eğlence', icon: Film, color: 'pink', amount: '' },
    { id: 'bills', name: 'Faturalar', icon: Receipt, color: 'red', amount: '' },
    { id: 'other', name: 'Diğer', icon: MoreHorizontal, color: 'slate', amount: '' }
];

const DEFAULT_ALLOCATIONS: BudgetAllocation[] = [
    { id: 'living', name: 'Yaşam Giderleri', percentage: 50, color: '#f59e0b', recommended: 50 },
    { id: 'savings', name: 'Tasarruf', percentage: 20, color: '#10b981', recommended: 20 },
    { id: 'investment', name: 'Yatırım', percentage: 20, color: '#8b5cf6', recommended: 20 },
    { id: 'personal', name: 'Keyfi Harcama', percentage: 10, color: '#ec4899', recommended: 10 }
];

const incomeTypeLabels = {
    salary: { label: 'Maaşlı', icon: Briefcase, color: 'emerald' },
    business: { label: 'İş Sahibi', icon: Building2, color: 'blue' },
    freelance: { label: 'Serbest', icon: Zap, color: 'amber' },
    none: { label: 'Yok', icon: Clock, color: 'slate' }
};

// ==================== UTILITY FUNCTIONS ====================
function formatNumber(value: string): string {
    const num = value.replace(/\D/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function parseFormattedNumber(value: string): number {
    return parseFloat(value.replace(/\./g, '')) || 0;
}

function formatDate(date: Date): string {
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('tr-TR').format(Math.round(amount));
}

// ==================== CALCULATION FUNCTIONS ====================
function calculateFinances(input: FinanceInput): FinanceResult {
    const today = new Date();
    const dailyFixed = (input.fixedExpenses || 0) / 30;
    const totalDailySpend = input.dailySpending + dailyFixed;

    const perPersonDaily = input.familySize > 1 ? totalDailySpend / input.familySize : totalDailySpend;

    if (totalDailySpend <= 0) {
        return {
            daysRemaining: 999,
            runOutDate: new Date(today.getTime() + 999 * 24 * 60 * 60 * 1000),
            dailyBudgetToLast30Days: input.currentBalance / 30,
            savingsNeeded: 0,
            riskLevel: 'safe',
            criticalDayStart: 999,
            daysToIncome: null,
            perPersonDaily: 0,
            canSurviveToIncome: true,
            weeklyBudget: (input.currentBalance / 30) * 7,
            monthlyBudget: input.currentBalance,
            recommendedSavings: input.currentBalance * 0.2,
            recommendedInvestment: input.currentBalance * 0.2
        };
    }

    const daysRemaining = Math.floor(input.currentBalance / totalDailySpend);
    const runOutDate = new Date(today);
    runOutDate.setDate(runOutDate.getDate() + daysRemaining);

    const dailyBudgetToLast30Days = input.currentBalance / 30;
    const savingsNeeded = Math.max(0, totalDailySpend - dailyBudgetToLast30Days);
    const weeklyBudget = dailyBudgetToLast30Days * 7;
    const monthlyBudget = input.currentBalance;

    // Recommended savings and investment based on income
    const monthlyIncome = input.expectedIncome || input.currentBalance;
    const recommendedSavings = monthlyIncome * 0.2;
    const recommendedInvestment = monthlyIncome * 0.2;

    let riskLevel: 'critical' | 'warning' | 'safe';
    if (daysRemaining <= 7) riskLevel = 'critical';
    else if (daysRemaining <= 14) riskLevel = 'warning';
    else riskLevel = 'safe';

    const criticalThreshold = input.currentBalance * 0.2;
    const criticalDayStart = Math.floor((input.currentBalance - criticalThreshold) / totalDailySpend);

    let daysToIncome: number | null = null;
    let canSurviveToIncome = true;

    if (input.incomeDay && input.incomeType !== 'none') {
        const currentDay = today.getDate();
        if (input.incomeDay > currentDay) {
            daysToIncome = input.incomeDay - currentDay;
        } else {
            const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, input.incomeDay);
            daysToIncome = Math.ceil((nextMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        }
        canSurviveToIncome = daysRemaining >= daysToIncome;
    }

    return {
        daysRemaining,
        runOutDate,
        dailyBudgetToLast30Days,
        savingsNeeded,
        riskLevel,
        criticalDayStart,
        daysToIncome,
        perPersonDaily,
        canSurviveToIncome,
        weeklyBudget,
        monthlyBudget,
        recommendedSavings,
        recommendedInvestment
    };
}

function simulateSavings(input: FinanceInput, dailyReduction: number): SimulationResult {
    const original = calculateFinances(input);
    const newInput = { ...input, dailySpending: Math.max(0, input.dailySpending - dailyReduction) };
    const simulated = calculateFinances(newInput);

    return {
        reduction: dailyReduction,
        reductionPercent: (dailyReduction / input.dailySpending) * 100,
        newDaysRemaining: simulated.daysRemaining,
        daysSaved: simulated.daysRemaining - original.daysRemaining,
        newRunOutDate: simulated.runOutDate
    };
}

// ==================== MESSAGE FUNCTIONS ====================
function getSupportiveMessage(result: FinanceResult): string {
    if (result.riskLevel === 'critical') {
        return "Endişelenme, küçük adımlarla bu durumu değiştirebilirsin. 💪";
    } else if (result.riskLevel === 'warning') {
        return "Dikkatli olursan ayı rahatlıkla tamamlarsın. 🎯";
    }
    return "Harika gidiyorsun! Bu tempoyu koru. ✨";
}

function getSmartRecommendations(result: FinanceResult, allocations: BudgetAllocation[]): string[] {
    const recommendations: string[] = [];

    if (result.riskLevel === 'critical') {
        recommendations.push(`Günlük harcamanı ₺${formatCurrency(result.savingsNeeded)} azaltırsan risk ortadan kalkar.`);
    }

    if (result.recommendedSavings > 0) {
        recommendations.push(`Acil durum için ₺${formatCurrency(result.recommendedSavings)} kenara ayırmak güvenli olur.`);
    }

    const personalAlloc = allocations.find(a => a.id === 'personal');
    if (personalAlloc && personalAlloc.percentage > 15) {
        recommendations.push(`Keyfi harcamayı %${personalAlloc.percentage - 10}'e düşürürsen daha dengeli olur.`);
    }

    if (result.weeklyBudget > 0) {
        recommendations.push(`Haftalık bütçeni ₺${formatCurrency(result.weeklyBudget)} olarak belirlersen ayı rahat geçirirsin.`);
    }

    return recommendations.slice(0, 3);
}

// ==================== DONUT CHART COMPONENT ====================
interface DonutChartProps {
    allocations: BudgetAllocation[];
    size?: number;
    onHover?: (allocation: BudgetAllocation | null) => void;
    animated?: boolean;
}

function DonutChart({ allocations, size = 200, onHover, animated = true }: DonutChartProps) {
    const [animationProgress, setAnimationProgress] = useState(animated ? 0 : 1);

    useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => setAnimationProgress(1), 100);
            return () => clearTimeout(timer);
        }
    }, [animated]);

    const radius = size / 2 - 20;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercentage = 0;

    return (
        <svg width={size} height={size} className="transform -rotate-90">
            {allocations.map((alloc, idx) => {
                const percentage = alloc.percentage * animationProgress;
                const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercentage / 100) * circumference);
                accumulatedPercentage += alloc.percentage;

                return (
                    <circle
                        key={alloc.id}
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={alloc.color}
                        strokeWidth={24}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out cursor-pointer hover:opacity-80"
                        onMouseEnter={() => onHover?.(alloc)}
                        onMouseLeave={() => onHover?.(null)}
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                    />
                );
            })}
            {/* Center circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius - 30}
                fill="#1C1C1E"
            />
        </svg>
    );
}

// ==================== ANIMATED NUMBER ====================
function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime: number;
        const startValue = displayValue;
        const diff = value - startValue;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.round(startValue + diff * easeOut));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return <>{formatCurrency(displayValue)}</>;
}

// ==================== MONEY INPUT COMPONENT ====================
interface MoneyInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    label: string;
    icon: React.ElementType;
    iconColor: string;
    hint?: string;
    disabled?: boolean;
}

function MoneyInput({ value, onChange, placeholder, label, icon: Icon, iconColor, hint, disabled }: MoneyInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '');
        onChange(raw ? formatNumber(raw) : '');
    };

    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                <Icon size={16} className={iconColor} />
                {label}
            </label>
            <div className="relative">
                <input
                    type="text"
                    inputMode="numeric"
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full bg-[#0F1117] border border-white/10 rounded-xl pl-4 pr-14 py-4 text-white text-lg font-bold placeholder:text-slate-600 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all disabled:opacity-50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">TL</span>
            </div>
            {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
        </div>
    );
}

// ==================== MAIN COMPONENT ====================
interface MoneyCalculatorProps {
    isPremium?: boolean;
    usageCount?: number;
    maxFreeUsage?: number;
    onUpgrade?: () => void;
}

export default function MoneyCalculator({
    isPremium = false,
    usageCount = 0,
    maxFreeUsage = 3,
    onUpgrade
}: MoneyCalculatorProps) {
    // Form state
    const [currentBalance, setCurrentBalance] = useState<string>('');
    const [monthlyIncome, setMonthlyIncome] = useState<string>('');
    const [dailySpending, setDailySpending] = useState<string>('');
    const [fixedExpenses, setFixedExpenses] = useState<string>('');
    const [familySize, setFamilySize] = useState<number>(1);
    const [incomeDay, setIncomeDay] = useState<string>('');
    const [incomeType, setIncomeType] = useState<'salary' | 'business' | 'freelance' | 'none'>('salary');
    const [expectedIncome, setExpectedIncome] = useState<string>('');
    const [categories, setCategories] = useState<ExpenseCategory[]>(DEFAULT_CATEGORIES);
    const [allocations, setAllocations] = useState<BudgetAllocation[]>(DEFAULT_ALLOCATIONS);

    // UI state
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [useCategoryTotal, setUseCategoryTotal] = useState(false);
    const [showSavePrompt, setShowSavePrompt] = useState(false);
    const [hasSavedData, setHasSavedData] = useState(false);
    const [hoveredAllocation, setHoveredAllocation] = useState<BudgetAllocation | null>(null);

    // Result state
    const [result, setResult] = useState<FinanceResult | null>(null);
    const [simulations, setSimulations] = useState<SimulationResult[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);
    const [animateResult, setAnimateResult] = useState(false);

    // Interactive Simulation State
    const [simulationSpending, setSimulationSpending] = useState<number>(0);
    const [simulatedDays, setSimulatedDays] = useState<number>(0);

    // History State
    const [history, setHistory] = useState<HistoryItem[]>([]);

    const canCalculate = isPremium || usageCount < maxFreeUsage;
    const remainingCalculations = maxFreeUsage - usageCount;

    // Load saved data
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setHasSavedData(true);
        } catch { /* ignore */ }
    }, []);

    // Category total calculation
    useEffect(() => {
        if (useCategoryTotal) {
            const total = categories.reduce((sum, cat) => sum + parseFormattedNumber(cat.amount), 0);
            if (total > 0) setDailySpending(formatNumber(total.toString()));
        }
    }, [categories, useCategoryTotal]);

    const handleCategoryChange = (id: string, value: string) => {
        setCategories(prev => prev.map(cat =>
            cat.id === id ? { ...cat, amount: value ? formatNumber(value.replace(/\D/g, '')) : '' } : cat
        ));
    };

    const handleAllocationChange = (id: string, newPercentage: number) => {
        setAllocations(prev => {
            const updated = [...prev];
            const targetIdx = updated.findIndex(a => a.id === id);
            const oldPercentage = updated[targetIdx].percentage;
            const diff = newPercentage - oldPercentage;

            updated[targetIdx].percentage = newPercentage;

            // Redistribute to others proportionally
            const othersTotal = 100 - oldPercentage;
            updated.forEach((a, i) => {
                if (i !== targetIdx && othersTotal > 0) {
                    const proportion = a.percentage / othersTotal;
                    a.percentage = Math.max(0, Math.round(a.percentage - diff * proportion));
                }
            });

            // Ensure total is 100
            const total = updated.reduce((s, a) => s + a.percentage, 0);
            if (total !== 100) {
                const lastOther = updated.find((a, i) => i !== targetIdx && a.percentage > 0);
                if (lastOther) lastOther.percentage += 100 - total;
            }

            return updated;
        });
    };

    const saveData = () => {
        // Create new history item if result exists
        let newHistory = [...history];
        if (result) {
            newHistory.push({
                date: new Date().toISOString(),
                daysRemaining: result.daysRemaining,
                balance: parseFormattedNumber(currentBalance)
            });
            // Keep last 10 entries
            if (newHistory.length > 10) newHistory = newHistory.slice(-10);
            setHistory(newHistory);
        }

        const data: SavedData = {
            currentBalance, monthlyIncome, dailySpending, fixedExpenses, familySize,
            incomeDay, incomeType, expectedIncome, categories,
            savedAt: new Date().toISOString(),
            history: newHistory
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setHasSavedData(true);
        setShowSavePrompt(false);
    };

    const loadSavedData = () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data: SavedData = JSON.parse(saved);
                setCurrentBalance(data.currentBalance || '');
                setMonthlyIncome(data.monthlyIncome || '');
                setDailySpending(data.dailySpending || '');
                setFixedExpenses(data.fixedExpenses || '');
                setFamilySize(data.familySize || 1);
                setIncomeDay(data.incomeDay || '');
                setIncomeType(data.incomeType || 'salary');
                setExpectedIncome(data.expectedIncome || '');
                if (data.history) setHistory(data.history);

                // Restore categories with icons (icons are lost in JSON)
                if (data.categories && data.categories.length > 0) {
                    const restoredCategories = data.categories.map(savedCat => {
                        const defaultCat = DEFAULT_CATEGORIES.find(d => d.id === savedCat.id);
                        return {
                            ...savedCat,
                            icon: defaultCat ? defaultCat.icon : MoreHorizontal // Restore icon reference
                        };
                    });
                    setCategories(restoredCategories);

                    // If detailed categories have values, show them and use total
                    const hasCategoryValues = restoredCategories.some(c => c.amount && c.amount !== '0');
                    if (hasCategoryValues) {
                        setShowCategories(true);
                        setUseCategoryTotal(true);
                    }
                }
            }
        } catch { /* ignore */ }
    };

    const clearSavedData = () => {
        localStorage.removeItem(STORAGE_KEY);
        setHasSavedData(false);
        // Clear all form fields
        setCurrentBalance('');
        setMonthlyIncome('');
        setDailySpending('');
        setFixedExpenses('');
        setFamilySize(1);
        setIncomeDay('');
        setIncomeType('salary');
        setExpectedIncome('');
        setIncomeType('salary');
        setExpectedIncome('');
        setCategories(DEFAULT_CATEGORIES);
        setHistory([]);
    };

    const handleCalculate = async () => {
        if (!canCalculate) { onUpgrade?.(); return; }

        const balance = parseFormattedNumber(currentBalance);
        const spending = parseFormattedNumber(dailySpending);
        const fixed = parseFormattedNumber(fixedExpenses);
        const income = incomeDay ? parseInt(incomeDay) : null;
        const expectedIncomeValue = parseFormattedNumber(expectedIncome);

        if (balance <= 0 || spending <= 0) {
            alert('Lütfen eldeki para ve günlük harcama değerlerini girin.');
            return;
        }

        setIsCalculating(true);
        await new Promise(resolve => setTimeout(resolve, 1200));

        const input: FinanceInput = {
            currentBalance: balance, dailySpending: spending, fixedExpenses: fixed,
            familySize, incomeDay: income, incomeType, expectedIncome: expectedIncomeValue
        };

        const calculatedResult = calculateFinances(input);
        setResult(calculatedResult);

        if (isPremium) {
            setSimulations([
                simulateSavings(input, spending * 0.1),
                simulateSavings(input, spending * 0.2),
                simulateSavings(input, spending * 0.3),
            ]);
        }

        // Initialize simulation
        setSimulationSpending(spending);
        setSimulatedDays(calculatedResult.daysRemaining);

        setIsCalculating(false);
        setShowResult(true);
        setShowSavePrompt(true);
        setTimeout(() => setAnimateResult(true), 100);
    };

    const handleReset = () => {
        setShowResult(false);
        setAnimateResult(false);
        setResult(null);
        setSimulations([]);
        setShowSavePrompt(false);
    };

    // Helper function for save prompt text
    const getSavePromptText = (type: 'title' | 'description' | 'button') => {
        if (hasSavedData) {
            if (type === 'title') return 'Verileri Güncelle';
            if (type === 'description') return 'Yeni hesaplamayı mevcut kaydın üzerine yaz?';
            if (type === 'button') return 'Güncelle';
        } else {
            if (type === 'title') return 'Sonucu Kaydet';
            if (type === 'description') return 'Bu verileri daha sonra hatırlamak ister misin?';
            if (type === 'button') return 'Kaydet';
        }
        return ''; // Should not happen
    };

    const handleSimulationChange = (value: number) => {
        setSimulationSpending(value);
        if (!currentBalance) return;

        const balance = parseFormattedNumber(currentBalance);
        const fixed = parseFormattedNumber(fixedExpenses);
        const dailyFixed = (fixed || 0) / 30;
        const totalDaily = value + dailyFixed;

        if (totalDaily > 0) {
            const days = Math.floor(balance / totalDaily);
            setSimulatedDays(days);
        }
    };

    // ==================== BALANCE CHART ====================
    const renderBalanceChart = () => {
        if (!result) return null;

        const days = Math.min(result.daysRemaining, 30);
        const balance = parseFormattedNumber(currentBalance);
        const spending = parseFormattedNumber(dailySpending);
        const fixed = parseFormattedNumber(fixedExpenses) / 30;
        const dailyTotal = spending + fixed;

        const points: { day: number; value: number; zone: 'safe' | 'warning' | 'critical' }[] = [];
        for (let i = 0; i <= Math.min(days, 20); i++) {
            const remaining = Math.max(0, balance - (dailyTotal * i));
            const percentage = remaining / balance;
            let zone: 'safe' | 'warning' | 'critical';
            if (percentage > 0.4) zone = 'safe';
            else if (percentage > 0.2) zone = 'warning';
            else zone = 'critical';
            points.push({ day: i, value: remaining, zone });
        }

        return (
            <div className="p-5 bg-white/5 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <BarChart3 size={16} className="text-purple-400" />
                        <p className="text-sm font-bold text-white">Bakiye Projeksiyonu</p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px]">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Güvenli</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Dikkat</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Kritik</span>
                    </div>
                </div>

                {/* Chart */}
                <div className="relative h-32 flex items-end gap-1">
                    {points.map((point, i) => {
                        const height = (point.value / balance) * 100;
                        const isCriticalStart = point.zone === 'warning' && points[i - 1]?.zone === 'safe';

                        return (
                            <div key={i} className="flex-1 relative group">
                                <div
                                    className={clsx(
                                        "w-full rounded-t transition-all duration-500 ease-out",
                                        point.zone === 'safe' ? "bg-gradient-to-t from-emerald-600 to-emerald-400"
                                            : point.zone === 'warning' ? "bg-gradient-to-t from-amber-600 to-amber-400"
                                                : "bg-gradient-to-t from-red-600 to-red-400"
                                    )}
                                    style={{
                                        height: `${Math.max(height, 4)}%`,
                                        animationDelay: `${i * 40}ms`
                                    }}
                                />
                                {/* Critical marker */}
                                {isCriticalStart && (
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                        <AlertTriangle size={12} className="text-amber-400 animate-pulse" />
                                    </div>
                                )}
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    <div className="bg-black/90 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                                        Gün {point.day}: ₺{formatCurrency(point.value)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-between mt-3 text-[10px] text-slate-500">
                    <span>Bugün</span>
                    <span>{points.length - 1} gün sonra</span>
                </div>

                {/* Description */}
                <div className="mt-4 p-3 bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-400 leading-relaxed">
                        <Info size={12} className="inline mr-1 text-slate-500" />
                        Bu grafik, paran bu hızla giderse nereye varacağını gösterir. Sarı bölge dikkat, kırmızı bölge kritik dönemdir.
                    </p>
                </div>
            </div>
        );
    };

    // ==================== RESULT VIEW ====================
    if (showResult && result) {
        const recommendations = getSmartRecommendations(result, allocations);

        return (
            <div className={clsx(
                "transition-all duration-700 transform space-y-5",
                animateResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
                {/* Save Prompt - Always show after calculation */}
                {showSavePrompt && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                    <Save size={20} className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">
                                        {hasSavedData ? 'Verileri Güncelle' : 'Sonucu Kaydet'}
                                    </p>
                                    <p className="text-xs text-blue-300">
                                        {hasSavedData
                                            ? 'Yeni hesaplamayı mevcut kaydın üzerine yaz?'
                                            : 'Bu verileri daha sonra hatırlamak ister misin?'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={saveData}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                                >
                                    {hasSavedData ? 'Güncelle' : 'Kaydet'}
                                </button>
                                <button
                                    onClick={() => setShowSavePrompt(false)}
                                    className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-bold rounded-lg transition-colors"
                                >
                                    Kapat
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <BarChart3 size={16} className="text-brand-orange" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase">Finansal Analiz</p>
                            <p className="text-xs text-white font-bold">{new Date().toLocaleDateString('tr-TR')}</p>
                        </div>
                    </div>
                </div>

                {/* Main Result */}
                <div className={clsx(
                    "rounded-3xl p-6 text-center border-2",
                    result.riskLevel === 'critical' ? "bg-red-500/10 border-red-500/30"
                        : result.riskLevel === 'warning' ? "bg-amber-500/10 border-amber-500/30"
                            : "bg-emerald-500/10 border-emerald-500/30"
                )}>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">PARANIN TÜKENİŞ TARİHİ</p>
                    <div className={clsx(
                        "text-4xl sm:text-5xl font-black mb-2 tracking-tight",
                        result.riskLevel === 'critical' ? "text-red-500"
                            : result.riskLevel === 'warning' ? "text-amber-500"
                                : "text-emerald-500"
                    )}>
                        {formatDate(result.runOutDate)}
                    </div>

                    <div className="flex flex-col items-center justify-center mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Clock size={14} />
                            <span>Saat <strong>14:00</strong> civarında tamamen</span>
                        </div>
                        <p className={clsx(
                            "text-sm font-black uppercase tracking-wide",
                            result.riskLevel === 'critical' ? "text-red-400" : "text-slate-300"
                        )}>
                            SIFIRLANACAK
                        </p>
                    </div>

                    {/* Trend Indicator (History) */}
                    {history.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-2 text-xs animate-in fade-in duration-700 delay-300">
                            {result.daysRemaining > history[history.length - 1].daysRemaining ? (
                                <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
                                    <TrendingUp size={12} />
                                    <span className="font-bold">Gelişme Var!</span>
                                    <span className="opacity-75">Öncekine göre +{result.daysRemaining - history[history.length - 1].daysRemaining} gün kazandın.</span>
                                </div>
                            ) : result.daysRemaining < history[history.length - 1].daysRemaining ? (
                                <div className="flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2 py-1 rounded-lg">
                                    <TrendingDown size={12} />
                                    <span className="font-bold">Dikkat</span>
                                    <span className="opacity-75">Öncekine göre -{history[history.length - 1].daysRemaining - result.daysRemaining} gün kayıp.</span>
                                </div>
                            ) : (
                                <span className="text-slate-500">Durumun geçen seferle aynı.</span>
                            )}
                        </div>
                    )}

                    <div className="bg-white/5 rounded-xl p-3 mt-4">
                        <p className="text-sm text-slate-300">{getSupportiveMessage(result)}</p>
                    </div>
                </div>

                {/* Balance Chart */}
                {renderBalanceChart()}

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-[10px] text-slate-500 mb-1">Günlük Bütçe</p>
                        <p className="text-lg font-black text-white">₺<AnimatedNumber value={result.dailyBudgetToLast30Days} /></p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-[10px] text-slate-500 mb-1">Haftalık Bütçe</p>
                        <p className="text-lg font-black text-emerald-400">₺<AnimatedNumber value={result.weeklyBudget} /></p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-[10px] text-slate-500 mb-1">Önerilen Tasarruf</p>
                        <p className="text-lg font-black text-purple-400">₺<AnimatedNumber value={result.recommendedSavings} /></p>
                    </div>
                </div>

                {/* INTERACTIVE SIMULATOR (Priority 1) */}
                <div className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/10 shadow-xl overflow-hidden relative group">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div>
                            <h3 className="text-white font-bold text-sm flex items-center gap-2">
                                <Zap size={14} className="text-emerald-400" />
                                Kaderini Değiştir
                            </h3>
                            <p className="text-slate-400 text-xs mt-1">Harcamanı değiştirirsen ne olur?</p>
                        </div>
                        <div className="text-right">
                            <span className={clsx(
                                "text-3xl font-black transition-colors duration-300",
                                simulatedDays > (result?.daysRemaining || 0) ? "text-emerald-400" : "text-white"
                            )}>{simulatedDays}</span>
                            <span className="text-xs text-slate-500 ml-1 font-bold lowercase">gün yetecek</span>
                        </div>
                    </div>

                    <div className="relative z-10 px-1">
                        <input
                            type="range"
                            min={Math.floor(parseFormattedNumber(dailySpending) * 0.5)}
                            max={Math.floor(parseFormattedNumber(dailySpending) * 1.5)}
                            step={10}
                            value={simulationSpending}
                            onChange={(e) => handleSimulationChange(parseInt(e.target.value))}
                            className="w-full h-2 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 rounded-lg appearance-none cursor-pointer hover:h-3 transition-all"
                        />
                    </div>

                    <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-500 relative z-10">
                        <span>Daha Az</span>
                        <span className="text-white bg-white/10 px-2 py-1 rounded-md">Günlük: ₺{formatNumber(simulationSpending.toString())}</span>
                        <span>Daha Çok</span>
                    </div>

                    {/* Dynamic Feedback Text */}
                    <div className="mt-5 p-3 bg-white/5 rounded-xl border border-white/5 relative z-10">
                        <p className="text-xs text-slate-300 text-center leading-relaxed">
                            {simulationSpending < parseFormattedNumber(dailySpending)
                                ? <span>Harika! Günde <strong>₺{formatNumber((parseFormattedNumber(dailySpending) - simulationSpending).toString())}</strong> kısarak paranı <strong className="text-emerald-400">+{simulatedDays - (result?.daysRemaining || 0)} gün</strong> daha uzun kullanabilirsin. 🎉</span>
                                : simulationSpending > parseFormattedNumber(dailySpending)
                                    ? <span>Dikkat! Harcamanı artırırsan paran <strong className="text-red-400">{Math.abs(simulatedDays - (result?.daysRemaining || 0))} gün</strong> erken biter.</span>
                                    : "Simülatörü kullanarak geleceği görebilirsin."
                            }
                        </p>
                    </div>
                </div>

                {/* PREMIUM: Donut Chart */}
                {isPremium ? (
                    <div className="p-5 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-2xl border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-4">
                            <PiggyBank size={16} className="text-purple-400" />
                            <p className="text-sm font-bold text-white">Önerilen Para Dağılımı</p>
                        </div>

                        <div className="flex items-center justify-center gap-6">
                            {/* Donut Chart */}
                            <div className="relative">
                                <DonutChart
                                    allocations={allocations}
                                    size={180}
                                    onHover={setHoveredAllocation}
                                />
                                {/* Center text */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        {hoveredAllocation ? (
                                            <>
                                                <p className="text-2xl font-black text-white">%{hoveredAllocation.percentage}</p>
                                                <p className="text-[10px] text-slate-400">{hoveredAllocation.name}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-lg font-black text-white">İdeal</p>
                                                <p className="text-[10px] text-slate-400">Denge</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Legend & Sliders */}
                            <div className="space-y-3 flex-1">
                                {allocations.map(alloc => (
                                    <div key={alloc.id} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: alloc.color }} />
                                                <span className="text-xs text-slate-300">{alloc.name}</span>
                                            </div>
                                            <span className="text-xs font-bold text-white">%{alloc.percentage}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="80"
                                            value={alloc.percentage}
                                            onChange={(e) => handleAllocationChange(alloc.id, parseInt(e.target.value))}
                                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                            style={{
                                                background: `linear-gradient(to right, ${alloc.color} 0%, ${alloc.color} ${alloc.percentage}%, rgba(255,255,255,0.1) ${alloc.percentage}%, rgba(255,255,255,0.1) 100%)`
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className="text-[10px] text-slate-500 text-center mt-4">
                            💡 Bu, ideal bir denge önerisidir. Kaydırıcılarla ayarlayabilirsin.
                        </p>
                    </div>
                ) : (
                    /* Locked Donut Chart for Free */
                    <div className="relative p-5 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-2xl border border-purple-500/10 overflow-hidden cursor-pointer group" onClick={onUpgrade}>
                        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/30 flex items-center justify-center z-10">
                            <div className="text-center">
                                <Lock size={24} className="text-purple-400 mx-auto mb-2" />
                                <p className="text-sm font-bold text-white">Para Dağılım Grafiği</p>
                                <p className="text-xs text-slate-400 mt-1">Daha güvenli bir plan sunar</p>
                                <div className="mt-3 flex items-center gap-1 text-purple-400 text-xs font-bold">
                                    <span>Görmek için tıkla</span>
                                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                        <div className="opacity-30">
                            <div className="flex items-center justify-center">
                                <DonutChart allocations={allocations} size={150} animated={false} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Smart Recommendations */}
                {recommendations.length > 0 && (
                    <div className="p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/20">
                        <div className="flex items-center gap-2 mb-4">
                            <Lightbulb size={16} className="text-amber-400" />
                            <p className="text-sm font-bold text-white">Böyle Yönetmelisin</p>
                        </div>
                        <ul className="space-y-3">
                            {recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-[10px] font-bold text-amber-400">{i + 1}</span>
                                    </div>
                                    <p className="text-sm text-slate-300">{rec}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Premium Comparison */}
                {isPremium && simulations.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Target size={16} className="text-purple-400" />
                            <p className="text-sm font-bold text-white">"Bu Hızla" vs "Kısarsan"</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                                <p className="text-[10px] text-red-400 uppercase font-bold mb-1">Mevcut Tempo</p>
                                <p className="text-3xl font-black text-red-400">{result.daysRemaining}</p>
                                <p className="text-xs text-slate-500">gün</p>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                                <p className="text-[10px] text-emerald-400 uppercase font-bold mb-1">%20 Kısarsan</p>
                                <p className="text-3xl font-black text-emerald-400">{simulations[1].newDaysRemaining}</p>
                                <p className="text-xs text-slate-500">gün (+{simulations[1].daysSaved})</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Free User CTA */}
                {/* REMOVED: Soft CTA */}

                {/* Rescue Plan - Premium Upgrade CTA (Growth Hack) */}
                {!isPremium && result.riskLevel !== 'safe' && (
                    <div className="mt-4 p-1 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 animate-pulse-slow">
                        <div className="bg-[#0f1117] rounded-xl p-6 text-center">
                            <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 leading-tight">
                                🛑 BU TARİHİ DEĞİŞTİRMEK MÜMKÜN
                            </h3>
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                Finansal kaderin bu olmak zorunda değil.<br />
                                Küçük bir değişiklikle <strong>+12 gün</strong> kazanabilirsin.
                                Sadece günde <span className="text-white font-bold border-b border-brand-orange">₺{formatCurrency(result.dailyBudgetToLast30Days * 0.2)}</span> tasarruf edersen neler değişir?
                            </p>

                            <button
                                onClick={onUpgrade}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-xl hover:brightness-110 transition-all shadow-xl shadow-purple-600/20 flex items-center justify-center gap-2 text-lg active:scale-95"
                            >
                                <Sparkles size={20} className="animate-spin-slow" />
                                SİMÜLASYONU BAŞLAT
                            </button>
                            <p className="text-[10px] text-slate-500 mt-3 font-medium">Premium analiz ile finansal geleceğini yeniden yaz.</p>
                        </div>
                    </div>
                )}

                {/* Safe State CTA */}
                {!isPremium && result.riskLevel === 'safe' && (
                    <div className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 rounded-2xl p-5 border border-purple-500/20">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                <PiggyBank className="text-white" size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">Paranı Yatırıma Dönüştür</h3>
                                <p className="text-purple-300 text-xs mt-1">Artan paranı nasıl değerlendireceğini öğren</p>
                            </div>
                        </div>
                        <button
                            onClick={onUpgrade}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:brightness-110 transition-all"
                        >
                            <Sparkles size={16} className="inline mr-2" />
                            Yatırım Tavsiyelerini Gör
                        </button>
                    </div>
                )}

                {/* Reset */}
                <button
                    onClick={handleReset}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-400 font-bold rounded-xl transition-colors text-sm"
                >
                    Yeni Hesaplama Yap
                </button>
            </div>
        );
    }

    // ==================== FORM VIEW ====================
    return (
        <div className="space-y-5">
            {/* Saved Data Banner */}
            {hasSavedData && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Save size={16} className="text-emerald-400" />
                            <span className="text-sm text-emerald-300">Kayıtlı verilerin var</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={loadSavedData}
                                className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-500/30 transition-colors"
                            >
                                Yükle
                            </button>
                            <button
                                onClick={clearSavedData}
                                className="px-3 py-1.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-1"
                            >
                                <Trash size={12} />
                                Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Usage Counter */}
            {!isPremium && (
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-sm text-slate-400">Kalan hesaplama</span>
                    <div className="flex items-center gap-2">
                        {[...Array(maxFreeUsage)].map((_, i) => (
                            <div key={i} className={clsx("w-3 h-3 rounded-full", i < remainingCalculations ? "bg-emerald-500" : "bg-white/10")} />
                        ))}
                        <span className="text-sm font-bold text-white ml-1">{remainingCalculations}/{maxFreeUsage}</span>
                    </div>
                </div>
            )}

            {/* Form */}
            <div className="space-y-4">
                <MoneyInput
                    value={currentBalance}
                    onChange={setCurrentBalance}
                    placeholder="5.000"
                    label="Eldeki Para"
                    icon={Wallet}
                    iconColor="text-brand-orange"
                    hint="Şu an hesabında / cüzdanında olan para"
                />

                <MoneyInput
                    value={monthlyIncome}
                    onChange={setMonthlyIncome}
                    placeholder="25.000"
                    label="Aylık Maaş / Gelir"
                    icon={CreditCard}
                    iconColor="text-emerald-400"
                    hint="Her ay düzenli gelen gelirin"
                />

                {/* Category Toggle */}
                <button
                    onClick={() => { setShowCategories(!showCategories); if (!showCategories) setUseCategoryTotal(true); }}
                    className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                    <span className="text-sm text-slate-400">Kategori detayı gir</span>
                    {showCategories ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                </button>

                {showCategories && (
                    <div className="space-y-3 p-4 bg-white/5 rounded-xl">
                        {categories.map(cat => {
                            const Icon = cat.icon;
                            return (
                                <div key={cat.id} className="flex items-center gap-3">
                                    <Icon size={14} className="text-slate-400" />
                                    <span className="text-sm text-slate-300 w-20">{cat.name}</span>
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={cat.amount}
                                            onChange={(e) => handleCategoryChange(cat.id, e.target.value)}
                                            placeholder="0"
                                            className="w-full bg-[#0F1117] border border-white/10 rounded-lg pl-3 pr-10 py-2 text-white text-sm font-bold"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">TL</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <MoneyInput
                    value={dailySpending}
                    onChange={setDailySpending}
                    placeholder="150"
                    label="Günlük Ortalama Harcama"
                    icon={TrendingDown}
                    iconColor="text-red-400"
                    hint="Yemek, ulaşım, eğlence vs."
                    disabled={useCategoryTotal}
                />

                <MoneyInput
                    value={fixedExpenses}
                    onChange={setFixedExpenses}
                    placeholder="2.000"
                    label="Aylık Sabit Giderler (opsiyonel)"
                    icon={Calendar}
                    iconColor="text-blue-400"
                    hint="Kira, fatura, abonelikler"
                />

                {/* Advanced Toggle */}
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                    <span className="text-sm text-slate-400">Gelişmiş Seçenekler</span>
                    {showAdvanced ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                </button>

                {showAdvanced && (
                    <div className="space-y-4 p-4 bg-white/5 rounded-xl">
                        {/* Income Type */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                                <Briefcase size={16} className="text-cyan-400" />
                                Gelir Tipin
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {(['salary', 'business', 'freelance', 'none'] as const).map(type => {
                                    const info = incomeTypeLabels[type];
                                    const Icon = info.icon;
                                    return (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setIncomeType(type)}
                                            className={clsx(
                                                "flex items-center gap-2 p-3 rounded-xl text-left transition-all",
                                                incomeType === type ? "bg-white/10 border-2 border-brand-orange/50" : "bg-white/5 border-2 border-transparent"
                                            )}
                                        >
                                            <Icon size={16} className={incomeType === type ? 'text-brand-orange' : 'text-slate-500'} />
                                            <span className={clsx("text-xs font-bold", incomeType === type ? "text-white" : "text-slate-400")}>{info.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {incomeType !== 'none' && (
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                                    <CalendarDays size={16} className="text-emerald-400" />
                                    Gelir Günü
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={incomeDay}
                                    onChange={(e) => setIncomeDay(e.target.value)}
                                    placeholder="15"
                                    className="w-full bg-[#0F1117] border border-white/10 rounded-xl px-4 py-3 text-white font-bold"
                                />
                            </div>
                        )}

                        {/* Family Size */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                                <Users size={16} className="text-purple-400" />
                                Kişi Sayısı
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map(num => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => setFamilySize(num)}
                                        className={clsx(
                                            "flex-1 py-3 rounded-xl font-bold text-sm transition-all",
                                            familySize === num ? "bg-purple-500 text-white" : "bg-white/5 text-slate-400"
                                        )}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Calculate Button */}
            <button
                onClick={handleCalculate}
                disabled={isCalculating || !canCalculate}
                className={clsx(
                    "w-full py-4 rounded-xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-2",
                    canCalculate
                        ? "bg-gradient-to-r from-brand-orange to-amber-500 text-black hover:brightness-110 shadow-brand-orange/20"
                        : "bg-white/10 text-slate-500 cursor-not-allowed"
                )}
            >
                {isCalculating ? (
                    <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Hesaplanıyor...
                    </>
                ) : !canCalculate ? (
                    <><Lock size={18} /> Limit Doldu</>
                ) : (
                    <><BarChart3 size={18} /> Hesapla</>
                )}
            </button>

            {/* Trust */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Shield size={12} />
                <span>Verilerin sadece senin tarayıcında kalır</span>
            </div>
        </div>
    );
}

'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Legend,
    AreaChart,
    Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { formatCurrency } from '@/lib/utils';

interface SalesChartProps {
    data: {
        date: string;
        amount: number;
        count: number;
    }[];
    title?: string;
}

export function SalesChart({ data, title }: SalesChartProps) {
    return (
        <Card className="h-[400px]">
            <CardHeader>
                <CardTitle className="text-lg">{title || 'Günlük Satış Trendi'}</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickFormatter={(value) => `₺${value}`}
                        />
                        <Tooltip
                            cursor={{ fill: '#f1f5f9' }}
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                fontSize: '12px'
                            }}
                            formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Tutar']}
                        />
                        <Bar
                            dataKey="amount"
                            fill="var(--accent)"
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function SalesCountChart({ data, title }: SalesChartProps) {
    return (
        <Card className="h-[400px]">
            <CardHeader>
                <CardTitle className="text-lg">{title || 'Günlük İşlem Adedi'}</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                fontSize: '12px'
                            }}
                            formatter={(value: any) => [value || 0, 'Adet']}
                        />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="var(--accent)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: 'var(--accent)' }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
export function ProfitLossChart({ data, title }: { data: { month: string; profit: number; loss: number; net: number }[], title?: string }) {
    return (
        <Card className="h-[400px]">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{title || 'Aylık Kar / Zarar Durumu'}</CardTitle>
                <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded-sm bg-accent opacity-30" />
                        <span className="text-slate-500">Satış</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded-sm bg-red-500 opacity-30" />
                        <span className="text-slate-500">Alış</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickFormatter={(value) => `₺${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                fontSize: '12px'
                            }}
                            formatter={(value: any) => [formatCurrency(Number(value) || 0), '']}
                        />
                        <Area
                            type="monotone"
                            dataKey="profit"
                            name="Satış"
                            stroke="var(--accent)"
                            fillOpacity={1}
                            fill="url(#colorProfit)"
                            strokeWidth={3}
                        />
                        <Area
                            type="monotone"
                            dataKey="loss"
                            name="Alış"
                            stroke="#ef4444"
                            fillOpacity={1}
                            fill="url(#colorLoss)"
                            strokeWidth={3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

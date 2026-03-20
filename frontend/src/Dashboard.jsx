import React, { useState, useEffect } from 'react';
import {
    Users, Map, Settings, Play, Database, Box, BarChart2, Shield, Activity, Share2,
    Home, Star, LayoutGrid, Bell, HelpCircle, TrendingUp, BarChart3, LayoutDashboard, FileText, Moon, Sun, LogOut, Download
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import bornoLogo from './assets/borno-logo.png';
import { getOrganizations, getProjects, getReports } from './api';

const Dashboard = () => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const [showExportMenu, setShowExportMenu] = useState(false);
    const [stats, setStats] = useState({
        orgs: 0,
        projects: 0,
        reports: 0
    });
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [orgsRes, projectsRes, reportsRes] = await Promise.all([
                    getOrganizations(),
                    getProjects(),
                    getReports()
                ]);

                setStats({
                    orgs: orgsRes.data.length,
                    projects: projectsRes.data.length,
                    reports: reportsRes.data.length
                });

                // Prepare chart data (simple aggregation by date)
                const chartData = reportsRes.data.reduce((acc, report) => {
                    const date = report.reporting_period;
                    const existing = acc.find(d => d.date === date);
                    if (existing) {
                        existing.value += Number(report.recorded_value);
                    } else {
                        acc.push({ date, value: Number(report.recorded_value) });
                    }
                    return acc;
                }, []);

                setReportData(chartData.sort((a, b) => new Date(a.date) - new Date(b.date)));
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };
        fetchData();
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // Color definitions based on theme to pass to charts
    const chartColor = theme === 'dark' ? '#73bf69' : '#10b981';
    const chartGridColor = theme === 'dark' ? '#22252b' : '#e2e8f0';
    const chartAxisColor = theme === 'dark' ? '#8e95a1' : '#64748b';
    const chartTooltipBg = theme === 'dark' ? '#181b1f' : '#ffffff';

    return (
        <div className="layout" data-theme={theme}>
            <aside className="sidebar">
                <div className="sidebar-top">
                    <div className="sidebar-icon-brand">
                        <img src={bornoLogo} alt="Borno State Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                        <span style={{ marginLeft: '12px', fontSize: '18px', fontWeight: 'bold' }}>Borno M&E</span>
                    </div>

                    <div className="sidebar-section">
                        <div className="sidebar-item active">
                            <LayoutDashboard size={20} /> <span>Dashboard</span>
                        </div>
                        <div className="sidebar-item"><Users size={20} /> <span>Organizations</span></div>
                        <div className="sidebar-item"><FileText size={20} /> <span>Projects</span></div>
                        <div className="sidebar-item"><BarChart3 size={20} /> <span>Indicators</span></div>
                        <div className="sidebar-item"><Map size={20} /> <span>Locations</span></div>
                    </div>
                </div>

                <div className="sidebar-bottom">
                    <div className="sidebar-item"><Settings size={20} /> <span>Settings</span></div>
                </div>
            </aside>

            <main className="main">
                {/* Fixed faded watermark in the background */}
                <img src={bornoLogo} alt="" className="watermark" />

                <header className="header">
                    <div className="breadcrumbs">
                        <a href="/">Home</a> / <a href="/dashboard">Dashboard</a> / <a href="/executive-overview">Executive Overview</a>
                    </div>
                    <div className="header-actions">
                        <div className="search-bar">
                            <span className="search-icon">🔍</span>
                            <input type="text" placeholder="Search..." />
                        </div>
                        <button className="btn-icon" onClick={toggleTheme} title="Toggle Theme" style={{ marginLeft: '8px' }}>
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div style={{ position: 'relative', marginLeft: '8px' }}>
                            <button className="btn-icon" onClick={() => setShowExportMenu(!showExportMenu)} title="Export">
                                <Download size={18} />
                            </button>
                            {showExportMenu && (
                                <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '8px', backgroundColor: 'var(--panel-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid var(--panel-border)', borderRadius: '6px', padding: '4px 0', zIndex: 50, minWidth: '140px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                                    <div className="export-item" onClick={() => { alert('Exporting as CSV...'); setShowExportMenu(false); }}>Export as CSV</div>
                                    <div className="export-item" onClick={() => { alert('Exporting as PDF...'); setShowExportMenu(false); }}>Export as PDF</div>
                                    <div className="export-item" onClick={() => { alert('Exporting to Excel...'); setShowExportMenu(false); }}>Export as Excel</div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="filters-bar">
                    <div className="filter-group">
                        <label>Filter</label>
                        <select className="filter-select"><option>All Partners</option></select>
                    </div>

                    <div className="time-controls">
                        <button className="time-btn">&lt; Last 3 months &gt;</button>
                        <button className="refresh-btn">🔄 Refresh ˅</button>
                    </div>
                </div>

                <div className="dashboard-content">

                    {/* Metric Cards mapped from original content */}
                    <div className="metrics-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        <div className="panel">
                            <div className="panel-header">
                                <h3>Total Organizations</h3>
                                <button className="panel-menu">⋮</button>
                            </div>
                            <div className="big-number green-ish" style={{ fontSize: '48px', padding: '16px 0 32px' }}>{stats.orgs}</div>
                            <div style={{ textAlign: 'center', paddingBottom: '16px', color: 'var(--text-muted)' }}></div>
                        </div>
                        <div className="panel">
                            <div className="panel-header">
                                <h3>Active Projects</h3>
                                <button className="panel-menu">⋮</button>
                            </div>
                            <div className="big-number green-ish" style={{ fontSize: '48px', padding: '16px 0 32px' }}>{stats.projects}</div>
                            <div style={{ textAlign: 'center', paddingBottom: '16px', color: 'var(--text-muted)' }}>Across 12 LGAs</div>
                        </div>
                        <div className="panel">
                            <div className="panel-header">
                                <h3>Reports Collected</h3>
                                <button className="panel-menu">⋮</button>
                            </div>
                            <div className="big-number green-ish" style={{ fontSize: '48px', padding: '16px 0 32px' }}>{stats.reports}</div>
                            <div style={{ textAlign: 'center', paddingBottom: '16px', color: 'var(--text-muted)' }}>Aggregated results</div>
                        </div>
                    </div>

                    {/* Charts mapped from original content */}
                    <div className="metrics-row">
                        <div className="panel chart-card">
                            <div className="panel-header">
                                <h3>Indicator Trends</h3>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={reportData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            stroke={chartAxisColor}
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke={chartAxisColor}
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: chartTooltipBg, border: `1px solid ${chartGridColor}`, borderRadius: '4px' }}
                                            itemStyle={{ color: chartColor }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke={chartColor}
                                            strokeWidth={3}
                                            dot={{ fill: chartColor, strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="panel chart-card">
                            <div className="panel-header">
                                <h3>Partners Contributions</h3>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={reportData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            stroke={chartAxisColor}
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke={chartAxisColor}
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: chartTooltipBg, border: `1px solid ${chartGridColor}`, borderRadius: '4px' }}
                                        />
                                        <Bar dataKey="value" fill="#ffb347" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;

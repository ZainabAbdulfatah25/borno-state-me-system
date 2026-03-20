import React, { useState, useEffect } from 'react';
import { 
  Users, Map, Settings, Play, Database, Box, BarChart2, Shield, Activity, Share2, 
  Home, Star, LayoutGrid, Bell, HelpCircle, TrendingUp, BarChart3, LayoutDashboard, FileText
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getOrganizations, getProjects, getReports } from './api';

const Dashboard = () => {
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

    const currentDate = new Date().toISOString().split('T')[0];

    return (
        <div className="grafana-layout">
            <aside className="grafana-sidebar">
                <div className="sidebar-top">
                    <div className="sidebar-icon-brand">
                        <Activity color="#ffb347"/>
                    </div>
                    
                    <div className="sidebar-section">
                        <div className="sidebar-item active">
                            <LayoutDashboard size={20}/> <span>Dashboard</span>
                        </div>
                        <div className="sidebar-item"><Users size={20}/> <span>Organizations</span></div>
                        <div className="sidebar-item"><FileText size={20}/> <span>Projects</span></div>
                        <div className="sidebar-item"><BarChart3 size={20}/> <span>Indicators</span></div>
                        <div className="sidebar-item"><Map size={20}/> <span>Locations</span></div>
                    </div>
                </div>
                
                <div className="sidebar-bottom">
                    <div className="sidebar-item"><Settings size={20}/> <span>Settings</span></div>
                </div>
            </aside>

            <main className="grafana-main">
                <header className="grafana-header">
                    <div className="breadcrumbs">
                        Home &gt; Dashboards &gt; Borno State M/E &gt; <span>Executive Overview</span>
                    </div>
                    <div className="header-actions">
                        <div className="search-bar">
                            <span className="search-icon">🔍</span>
                            <input type="text" placeholder="Search..." />
                        </div>
                        <button className="btn-icon"><Share2 size={16}/></button>
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
                            <div style={{ textAlign: 'center', paddingBottom: '16px', color: '#8e95a1' }}>+2 this month</div>
                        </div>
                        <div className="panel">
                            <div className="panel-header">
                                <h3>Active Projects</h3>
                                <button className="panel-menu">⋮</button>
                            </div>
                            <div className="big-number green-ish" style={{ fontSize: '48px', padding: '16px 0 32px' }}>{stats.projects}</div>
                            <div style={{ textAlign: 'center', paddingBottom: '16px', color: '#8e95a1' }}>Across 12 LGAs</div>
                        </div>
                        <div className="panel">
                            <div className="panel-header">
                                <h3>Reports Collected</h3>
                                <button className="panel-menu">⋮</button>
                            </div>
                            <div className="big-number green-ish" style={{ fontSize: '48px', padding: '16px 0 32px' }}>{stats.reports}</div>
                            <div style={{ textAlign: 'center', paddingBottom: '16px', color: '#8e95a1' }}>Aggregated results</div>
                        </div>
                    </div>

                    {/* Charts mapped from original content */}
                    <div className="metrics-row">
                        <div className="panel chart-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                            <div className="panel-header">
                                <h3>Indicator Trends</h3>
                            </div>
                            <div className="chart-container" style={{ flex: 1, padding: '16px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={reportData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#22252b" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#8e95a1"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#8e95a1"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#181b1f', border: '1px solid #22252b', borderRadius: '4px' }}
                                            itemStyle={{ color: '#73bf69' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#73bf69"
                                            strokeWidth={3}
                                            dot={{ fill: '#73bf69', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="panel chart-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                            <div className="panel-header">
                                <h3>Partners Contributions</h3>
                            </div>
                            <div className="chart-container" style={{ flex: 1, padding: '16px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={reportData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#22252b" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#8e95a1"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#8e95a1"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#181b1f', border: '1px solid #22252b', borderRadius: '4px' }}
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

'use client';

import { useMemo, useState } from 'react';

type Article = {
  id: string;
  title: string;
  agency: string;
  content: string;
  date: string;
  tags: string[];
  hs: string;
  writer?: string;
  source?: string;
};

type TradExpressConfig = {
  name: string;
  agent: {
    label: string;
    description: string;
  };
  keyboardSettings: {
    label: string;
    description: string;
  };
  consent: {
    label: string;
    description: string;
  };
};

const articles = require('../articles.json') as Article[];
const tradexpressConfig = require('../tradexpress.json') as TradExpressConfig;

export default function Page() {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedSkillSet, setSelectedSkillSet] = useState('General');
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const bumpCount = (key: string) => {
    setClickCounts((prev) => ({ ...prev, [key]: (prev[any] ?? 0) + 1 }));
  };

  const tags = useMemo(() => {
    const allTags = Array.from(new Set(articles.flatMap((article) => article.tags)));
    return ['All', ...allTags.sort((a, b) => a.localeCompare(b))];
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesQuery =
        query.trim() === '' ||
        `${article.title} ${article.content} ${article.agency} ${article.tags.join(' ')}`
          .toLowerCase()
          .includes(query.toLowerCase());

      const matchesTag = selectedTag === 'All' || article.tags.includes(selectedTag);
      return matchesQuery && matchesTag;
    });
  }, [query, selectedTag]);

  const quickLinks = [
    { label: 'Contact', href: 'mailto:hello@tradexpress.co' },
    { label: 'Account', href: '/account' },
    { label: 'Passcode', href: '/passcode' },
    { label: 'Webauth', href: '/webauth' }
  ];

  const aiCandidates = [
    { name: 'Ava', role: 'Automation Analyst', status: 'Parked', licensedKey: 'AI-AVA-001' },
    { name: 'Miko', role: 'Knowledge Assistant', status: 'Queued', licensedKey: 'AI-MIKO-002' },
    { name: 'Rin', role: 'Media Reviewer', status: 'Review', licensedKey: 'AI-RIN-003' }
  ];

  const tradexpressItems = [
    { title: tradexpressConfig.agent.label, description: tradexpressConfig.agent.description },
    { title: tradexpressConfig.keyboardSettings.label, description: tradexpressConfig.keyboardSettings.description },
    { title: tradexpressConfig.consent.label, description: tradexpressConfig.consent.description }
  ];

  const players = [
    { name: 'Player One', role: 'Primary operator' },
    { name: 'Player Two', role: 'Support coordinator' },
    { name: 'Player Three', role: 'Review analyst' }
  ];

  const skillSets = [
    { key: 'General', label: 'General', description: 'Broad support and coordination workflows.' },
    { key: 'Operations', label: 'Operations', description: 'Execution, routing, and handoff processes.' },
    { key: 'Compliance', label: 'Compliance', description: 'Policy, auditing, and review-focused workflows.' }
  ];

  const auditEntries = useMemo(() => {
    return Object.entries(clickCounts)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({
        label: key.replace('link:', 'Link ').replace('tag:', 'Tag '),
        count
      }));
  }, [clickCounts]);

  useMemo(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#06111f', color: '#f5f7fb', padding: '24px', fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {isLoading ? (
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ padding: '24px 28px', borderRadius: '16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#dff5ff' }}>Loading local library…</div>
            <div style={{ marginTop: '8px', color: '#9cb3c8' }}>Preparing articles, directories, and audit data.</div>
          </div>
        </div>
      ) : (
      <section style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: 0, color: '#57c1ff', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: '0.82rem' }}>
              Local Library
            </p>
            <h1 style={{ margin: '6px 0 8px', fontSize: '2rem', lineHeight: 1.2 }}>TradExpress knowledge base</h1>
            <p style={{ margin: 0, color: '#9cb3c8', maxWidth: '700px', lineHeight: 1.6 }}>
              A lightweight local library for browsing customs, permits, and market intelligence articles stored on disk.
            </p>
          </div>
          <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px' }}>
            <div style={{ fontSize: '0.8rem', color: '#86a7c1', textTransform: 'uppercase', letterSpacing: '0.16em' }}>Articles</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700 }}>{filteredArticles.length}</div>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <button
            style={{
              padding: '10px 14px',
              borderRadius: '999px',
              border: '1px solid rgba(87, 193, 255, 0.32)',
              background: 'linear-gradient(135deg, #1e7dff, #3dd8ff)',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Deploy
          </button>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, agency, or topic"
            style={{ flex: '1 1 260px', minWidth: '240px', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.14)', background: '#0b1a2d', color: '#f5f7fb' }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => bumpCount(`link:${link.label}`)}
                style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#f5f7fb', textDecoration: 'none' }}
              >
                {link.label} {clickCounts[`link:${link.label}`] ? `(${clickCounts[`link:${link.label}`]})` : ''}
              </a>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'rgba(87, 193, 255, 0.12)', border: '1px solid rgba(87, 193, 255, 0.24)', color: '#dff5ff', fontWeight: 700 }}>
              ## Directory 1
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(tag);
                    bumpCount(`tag:${tag}`);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '999px',
                    border: selectedTag === tag ? '1px solid #57c1ff' : '1px solid rgba(255,255,255,0.14)',
                    background: selectedTag === tag ? 'rgba(87, 193, 255, 0.16)' : 'rgba(255,255,255,0.05)',
                    color: '#f5f7fb',
                    cursor: 'pointer'
                  }}
                >
                  {tag} {clickCounts[`tag:${tag}`] ? `(${clickCounts[`tag:${tag}`]})` : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ color: '#57c1ff', fontWeight: 700, marginBottom: '6px' }}>## Directory 2</div>
          <div style={{ color: '#9cb3c8', marginBottom: '10px' }}>Reserved node set for tracked references and follow-up actions.</div>
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(87, 193, 255, 0.1)', border: '1px solid rgba(87, 193, 255, 0.18)' }}>
            <div style={{ color: '#dff5ff', fontWeight: 700, marginBottom: '6px' }}>Auto Record Media</div>
            <div style={{ color: '#9cb3c8' }}>Video, audio, and media references can be attached here for automatic local recording and review.</div>
          </div>
          <div style={{ marginTop: '10px', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ color: '#57c1ff', fontWeight: 700, marginBottom: '6px' }}>Container</div>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(87, 193, 255, 0.1)', border: '1px solid rgba(87, 193, 255, 0.18)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Digital Container</div>
                <a href="https://tradexpress.com/#container" style={{ color: '#98deff', textDecoration: 'none' }}>tradexpress.com/#container</a>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Physical Container</div>
                <div style={{ color: '#9cb3c8' }}>Warehouse, shipment, and handling records remain here.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>SMS on TradExpress</div>
                <div style={{ color: '#9cb3c8' }}>Short message notifications and alerts can be routed through this channel.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>SNTP Settings</div>
                <div style={{ color: '#9cb3c8' }}>Time sync enabled for local device and relay coordination.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Interfaces Template</div>
                <div style={{ color: '#9cb3c8' }}>Use this template to define service interfaces, ports, handlers, and expected responses.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Agent Node Licensed</div>
                <div style={{ color: '#9cb3c8' }}>This agent node is marked as licensed and ready for controlled activation.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Kenwell IT Solution</div>
                <div style={{ color: '#9cb3c8' }}>Additional support option for IT implementation, integration, and operational assistance.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Default Privacy</div>
                <div style={{ color: '#9cb3c8' }}>Private mode keeps internal records restricted; public mode exposes approved information.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Auto</div>
                <div style={{ color: '#9cb3c8' }}>Automation flow for recurring tasks, routing, and record handling.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Auto Class ID</div>
                <div style={{ color: '#9cb3c8' }}>Identifier for the automation class used in routing and execution.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Toolbars on TradExpress</div>
                <div style={{ color: '#9cb3c8' }}>Toolbar controls and quick actions available within the TradExpress experience.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Kenny Lungay</div>
                <div style={{ color: '#9cb3c8' }}>Unlimited credit available for one active allocation.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Null / None • Kenny • True / False</div>
                <div style={{ color: '#9cb3c8' }}>Reference values for empty states, identity, and boolean flags.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Kenny Interface</div>
                <div style={{ color: '#9cb3c8' }}>A named interface entry for Kenny’s local workflow and support view.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Kenwell Sovereign Unit 01</div>
                <div style={{ color: '#9cb3c8' }}>Additional interface entry for the sovereign unit support and operations view.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Enroll Name Staff</div>
                <div style={{ color: '#9cb3c8' }}>Enrollment reference for staff names and identity registration.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>TradExpress Full Request to User</div>
                <div style={{ color: '#9cb3c8' }}>A full request message prepared for user delivery and follow-up.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>ok-ko-library</div>
                <div style={{ color: '#9cb3c8' }}>Library reference entry for the ok-ko knowledge base.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Token Blocker Update</div>
                <div style={{ color: '#9cb3c8' }}>Token blocker status updated for the current workflow.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Token Unblocker Update</div>
                <div style={{ color: '#9cb3c8' }}>Token unblocker status updated for the current workflow.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Chat Left Sidebar Acquisition</div>
                <div style={{ color: '#9cb3c8' }}>Acquisition note for the chat left sidebar experience.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Academy Add Context</div>
                <div style={{ color: '#9cb3c8' }}><a href="http://127.0.0.1:8000/#academy-add" style={{ color: '#98deff', textDecoration: 'none' }}>http://127.0.0.1:8000/#academy-add</a></div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>TX Analytics Performance</div>
                <div style={{ color: '#9cb3c8' }}>Performance analytics and monitoring reference for TX workflows.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>TX or TXBot Performance Breakdown</div>
                <div style={{ color: '#9cb3c8' }}>Performance breakdown for TX and TXBot activity, latency, and throughput.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Autocode Settings Performance</div>
                <div style={{ color: '#9cb3c8' }}>Settings and performance reference for Autocode-related workflows.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Code Example Analytics</div>
                <div style={{ color: '#9cb3c8' }}>Analytics reference for code example usage and performance.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Differentials Logic</div>
                <div style={{ color: '#9cb3c8' }}>Logic and comparison reference for identifying differentials.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Benchmark</div>
                <div style={{ color: '#9cb3c8' }}>Benchmark reference for comparing system performance and results.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>VCPU</div>
                <div style={{ color: '#9cb3c8' }}>Virtual CPU allocation and performance reference.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>VDisk</div>
                <div style={{ color: '#9cb3c8' }}>Virtual disk allocation and storage reference.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Start v0</div>
                <div style={{ color: '#9cb3c8' }}>Version marker for the initial v0 release.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>TX as Model Pioneering</div>
                <div style={{ color: '#9cb3c8' }}>TX positioned as a pioneering model for the workflow.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Categorized False Directory</div>
                <div style={{ color: '#9cb3c8' }}>False-directory category for flagged or inactive entries.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Categorized True Directory</div>
                <div style={{ color: '#9cb3c8' }}>True-directory category for confirmed or active entries.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Upgrade Is Allowed If TradExpress Or Kenwell</div>
                <div style={{ color: '#9cb3c8' }}>Upgrade is permitted when the user belongs to TradExpress or Kenwell.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Hide My Dictatorship Function As Kenny Lungay On Other Gadgets</div>
                <div style={{ color: '#9cb3c8' }}>The dictatorship function is hidden for Kenny Lungay when used on other gadgets.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Mac Address Record</div>
                <div style={{ color: '#9cb3c8' }}>Record and track the device MAC address for device-level identification.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Terminal or CLI for Kenwell IT Solution and Kenwell Enterprise</div>
                <div style={{ color: '#9cb3c8' }}>Terminal or command-line interface reference for Kenwell IT Solution and Kenwell Enterprise workflows.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Barcode for POS</div>
                <div style={{ color: '#9cb3c8' }}>Barcode support reference for point-of-sale workflows.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Greater Than As Mode</div>
                <div style={{ color: '#9cb3c8' }}>Use greater-than logic as a mode for this workflow.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Identify Bottleneck</div>
                <div style={{ color: '#9cb3c8' }}>Identify and note the limiting factor in the current workflow.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>CNAME</div>
                <div style={{ color: '#9cb3c8' }}>CNAME record reference for domain mapping and routing.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>TradExpress Registrar</div>
                <div style={{ color: '#9cb3c8' }}>Registrar reference for the TradExpress domain configuration.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Domain Attribute</div>
                <div style={{ color: '#9cb3c8' }}>Domain attribute reference for configuration and DNS-related metadata.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>TradExpress App</div>
                <div style={{ color: '#9cb3c8' }}>TradExpress application reference for the app entrypoint.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Rollback for TradExpress</div>
                <div style={{ color: '#9cb3c8' }}>Rollback reference for the TradExpress deployment or update process.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>5D Print</div>
                <div style={{ color: '#9cb3c8' }}>5D print reference for additive manufacturing or advanced printing workflows.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>FAQ on TradExpress</div>
                <div style={{ color: '#9cb3c8' }}>Frequently asked questions and guidance for TradExpress users.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>SuperTool</div>
                <div style={{ color: '#9cb3c8' }}><a href="https://mxtoolbox.com/Public/Login.aspx" style={{ color: '#98deff', textDecoration: 'none' }}>Make command login</a></div>
                <div style={{ color: '#9cb3c8', marginTop: '4px' }}>DMARC Check Tool - Check DMARC Records for Errors</div>
                <div style={{ color: '#9cb3c8' }}>Domain Name: tradexpress</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Auto Joined Kenny Lungay</div>
                <div style={{ color: '#9cb3c8' }}>Auto-join reference for Kenny Lungay in the current workflow.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Priority List</div>
                <div style={{ color: '#9cb3c8' }}><a href="https://mxtoolbox.com/c/products/deliverycenter?source=supertool-dmarc-" style={{ color: '#98deff', textDecoration: 'none' }}>https://mxtoolbox.com/c/products/deliverycenter?source=supertool-dmarc-</a></div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Upgrade Resources Origin Is Kenny</div>
                <div style={{ color: '#9cb3c8' }}>Upgrade resources are attributed to Kenny as the origin.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Assign Reader By Kenny</div>
                <div style={{ color: '#9cb3c8' }}>Reader assignment is handled by Kenny for this workflow.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Kenny Lungay as CEO is Waiting for Freddy as CEO on TradExpress.co</div>
                <div style={{ color: '#9cb3c8' }}>CEO handoff and waiting status reference for TradExpress.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Licensed Quota for TXBot</div>
                <div style={{ color: '#9cb3c8' }}>API Key: sk_37e5cf44def440858cc3c957d7b02366</div>
                <div style={{ color: '#9cb3c8', marginTop: '4px' }}>Copy</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Kenwell.ai</div>
                <div style={{ color: '#9cb3c8' }}>Kenwell AI reference entry.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>Kenwell.any</div>
                <div style={{ color: '#9cb3c8' }}>Kenwell any-reference entry.</div>
              </div>
              {tradexpressItems.map((item) => (
                <div key={item.title} style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ color: '#9cb3c8' }}>{item.description}</div>
                </div>
              ))}
              <div style={{ marginTop: '8px', padding: '8px 10px', borderRadius: '8px', background: 'rgba(87, 193, 255, 0.1)', border: '1px solid rgba(87, 193, 255, 0.18)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '6px' }}>Players</div>
                <div style={{ display: 'grid', gap: '6px' }}>
                  {players.map((player) => (
                    <div key={player.name} style={{ color: '#9cb3c8' }}>
                      <span style={{ color: '#dff5ff', fontWeight: 700 }}>{player.name}</span> — {player.role}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: '8px', padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#dff5ff', marginBottom: '6px' }}>Skill Set Selector</div>
                <div style={{ color: '#9cb3c8', marginBottom: '8px' }}>Mai-code is TradExpress and Kenwell IT Solution app maker AI.</div>
                <div style={{ color: '#9cb3c8', marginBottom: '8px' }}>Source is from local Template.</div>
                <div style={{ color: '#9cb3c8', marginBottom: '8px' }}>Prerequisite for Kenwell, TradExpress users, or visitors.</div>
                <div style={{ color: '#9cb3c8', marginBottom: '8px' }}>Agent login: find the robot.</div>
                <div style={{ color: '#9cb3c8', marginBottom: '8px' }}>Page no: 1</div>
                <div style={{ color: '#9cb3c8', marginBottom: '8px' }}>Followed link numbers: {quickLinks.length}</div>
                <div style={{ color: '#9cb3c8', marginBottom: '8px' }}>No provision to other app.</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  {skillSets.map((skillSet) => (
                    <button
                      key={skillSet.key}
                      onClick={() => setSelectedSkillSet(skillSet.key)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '999px',
                        border: selectedSkillSet === skillSet.key ? '1px solid #57c1ff' : '1px solid rgba(255,255,255,0.14)',
                        background: selectedSkillSet === skillSet.key ? 'rgba(87, 193, 255, 0.16)' : 'rgba(255,255,255,0.05)',
                        color: '#f5f7fb',
                        cursor: 'pointer'
                      }}
                    >
                      {skillSet.label}
                    </button>
                  ))}
                </div>
                <div style={{ color: '#9cb3c8' }}>
                  {skillSets.find((skillSet) => skillSet.key === selectedSkillSet)?.description}
                </div>
              </div>
            </div>
            <div style={{ color: '#57c1ff', fontWeight: 700, marginTop: '10px', marginBottom: '6px' }}>TX TradeAssistant Live Chat</div>
            <div style={{ color: '#9cb3c8', marginBottom: '8px' }}>Connected • Online • Ready to assist</div>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(87, 193, 255, 0.12)', color: '#dff5ff' }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>TX</div>
                <div>Transmission channel for outbound actions, routing, and deployment handoffs.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', color: '#dff5ff' }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>RX</div>
                <div>Reception channel for inbound signals, messages, and result feedback.</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ color: '#57c1ff', fontWeight: 700, marginBottom: '10px' }}>## AI Candidate Parking</div>
          <div style={{ display: 'grid', gap: '10px' }}>
            {aiCandidates.map((candidate) => (
              <div key={candidate.name} style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(87, 193, 255, 0.1)', border: '1px solid rgba(87, 193, 255, 0.18)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ color: '#dff5ff', fontWeight: 700 }}>{candidate.name}</div>
                    <div style={{ color: '#9cb3c8', fontSize: '0.95rem' }}>{candidate.role}</div>
                  </div>
                  <div style={{ color: '#8da2b8', fontSize: '0.9rem' }}>{candidate.status}</div>
                </div>
                <div style={{ marginTop: '6px', color: '#98deff', fontSize: '0.9rem' }}>Licensed Key: {candidate.licensedKey}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ color: '#57c1ff', fontWeight: 700, marginBottom: '10px' }}>## Defined Roles</div>
          <div style={{ display: 'grid', gap: '8px', color: '#9cb3c8' }}>
            <div><strong style={{ color: '#dff5ff' }}>Backend:</strong> server-side logic, data flow, and system operations.</div>
            <div><strong style={{ color: '#dff5ff' }}>Frontend:</strong> the visible interface, pages, and user interactions.</div>
            <div><strong style={{ color: '#dff5ff' }}>Handler:</strong> the component or flow that processes requests and actions.</div>
            <div><strong style={{ color: '#dff5ff' }}>Admin:</strong> the manager of configuration, access, and oversight.</div>
            <div><strong style={{ color: '#dff5ff' }}>Owner:</strong> the person or entity responsible for the overall asset.</div>
            <div><strong style={{ color: '#dff5ff' }}>Developer:</strong> the builder who implements and maintains the system.</div>
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ color: '#57c1ff', fontWeight: 700, marginBottom: '10px' }}>## Keeper Audit</div>
          <div style={{ display: 'grid', gap: '8px', color: '#9cb3c8' }}>
            <div>Articles tracked: {articles.length}</div>
            <div>Tags active: {tags.length - 1}</div>
            <div>Quick links used: {Object.values(clickCounts).filter((value) => value > 0).length}</div>
            <div>Latest activity: {Object.entries(clickCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none'}</div>
          </div>
          <div style={{ marginTop: '10px', display: 'grid', gap: '6px' }}>
            {auditEntries.map((entry) => (
              <div key={entry.label} style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(87, 193, 255, 0.09)', color: '#dff5ff' }}>
                {entry.label}: {entry.count}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'grid', gap: '14px' }}>
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '16px', background: 'rgba(255,255,255,0.05)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ color: '#57c1ff', fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px' }}>{article.agency}</div>
                  <h2 style={{ margin: '0 0 8px', fontSize: '1.1rem' }}>{article.title}</h2>
                </div>
                <div style={{ color: '#8da2b8', fontSize: '0.95rem', textAlign: 'right' }}>
                  <div>{article.date}</div>
                  <div>HS {article.hs}</div>
                </div>
              </div>

              <p style={{ margin: '10px 0 12px', color: '#dfe9f3', lineHeight: 1.6 }}>{article.content}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {article.tags.map((tag) => (
                  <span key={`${article.id}-${tag}`} style={{ padding: '6px 8px', borderRadius: '999px', background: 'rgba(87, 193, 255, 0.14)', color: '#98deff', fontSize: '0.8rem' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </article>
          ))}

          {filteredArticles.length === 0 && (
            <div style={{ padding: '24px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', color: '#9cb3c8', textAlign: 'center' }}>
              No articles match this search yet.
            </div>
          )}
        </div>
      </section>
      )}
    </main>
  );
}
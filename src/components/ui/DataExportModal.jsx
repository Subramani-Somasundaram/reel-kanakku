import React, { useState, useEffect, useRef } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const EXPORT_FORMATS = [
  { value: 'csv', label: 'CSV', description: 'Spreadsheet compatible', icon: 'Table' },
  { value: 'excel', label: 'Excel', description: 'Excel workbook (.xls)', icon: 'FileSpreadsheet' },
  { value: 'json', label: 'JSON', description: 'Developer friendly', icon: 'Code' },
  { value: 'pdf', label: 'PDF', description: 'Print ready report', icon: 'FileText' },
];

const DATE_RANGES = [
  { value: 'all', label: 'All Time' },
  { value: 'year', label: 'This Year' },
  { value: 'month', label: 'This Month' },
  { value: 'custom', label: 'Custom Range' },
];

const DATA_FIELDS = [
  { id: 'title', label: 'Movie Title', checked: true },
  { id: 'date', label: 'Watch Date', checked: true },
  { id: 'cost', label: 'Total Cost', checked: true },
  { id: 'venue', label: 'Venue', checked: true },
];

const DataExportModal = ({ isOpen, onClose, analyticsData = null }) => {
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [selectedRange, setSelectedRange] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [fields, setFields] = useState(DATA_FIELDS);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportDone, setExportDone] = useState(false);
  const modalRef = useRef(null);
  const firstFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setExportDone(false);
      setExportProgress(0);
      setTimeout(() => firstFocusRef?.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e?.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleField = (fieldId) => {
    setFields((prev) =>
      prev?.map((f) => (f?.id === fieldId ? { ...f, checked: !f?.checked } : f))
    );
  };

  const getFilteredData = () => {
    const data = analyticsData || [];
    const now = new Date();
    return data?.filter((entry) => {
      const dateStr = entry?.watch_date || entry?.date;
      if (!dateStr) return true;
      const entryDate = new Date(dateStr);
      if (selectedRange === 'year') {
        return entryDate?.getFullYear() === now?.getFullYear();
      }
      if (selectedRange === 'month') {
        return entryDate?.getFullYear() === now?.getFullYear() && entryDate?.getMonth() === now?.getMonth();
      }
      if (selectedRange === 'custom') {
        const start = customStart ? new Date(customStart) : null;
        const end = customEnd ? new Date(customEnd) : null;
        if (start && entryDate < start) return false;
        if (end && entryDate > end) return false;
        return true;
      }
      return true;
    });
  };

  const getFieldValue = (entry, fieldId) => {
    const dateStr = entry?.watch_date || entry?.date || '';
    const formattedDate = dateStr ? new Date(dateStr)?.toLocaleDateString() : '';
    const totalCost = parseFloat(entry?.total_cost || entry?.totalCost) || 0;
    const map = {
      title: entry?.movie_name || entry?.movieName || '',
      date: formattedDate,
      cost: totalCost?.toFixed(2),
      venue: entry?.theatre || '',
      rating: entry?.rating || '',
      genre: entry?.genre || '',
      notes: entry?.notes || '',
    };
    return map?.[fieldId] ?? '';
  };

  const generateDownload = (filteredData) => {
    const checkedFields = fields?.filter((f) => f?.checked);

    if (selectedFormat === 'csv') {
      const header = checkedFields?.map((f) => f?.label)?.join(',');
      const rows = filteredData?.map((entry) =>
        checkedFields?.map((f) => `"${String(getFieldValue(entry, f?.id))?.replace(/"/g, '""')}"`)?.join(',')
      );
      const csv = [header, ...rows]?.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'movie_history_export.csv';
      a?.click();
      URL.revokeObjectURL(url);
    } else if (selectedFormat === 'excel') {
      const tableRows = filteredData?.map((entry) =>
        `<tr>${checkedFields?.map((f) => `<td>${getFieldValue(entry, f?.id)}</td>`)?.join('')}</tr>`
      )?.join('');
      const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><meta name=ProgId content=Excel.Sheet></head>
<body><table><thead><tr>${checkedFields?.map((f) => `<th>${f?.label}</th>`)?.join('')}</tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
      const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `movie_history_export_${new Date()?.toISOString()?.slice(0, 10)}.xls`;
      a?.click();
      URL.revokeObjectURL(url);
    } else if (selectedFormat === 'json') {
      const jsonData = filteredData?.map((entry) => {
        const obj = {};
        checkedFields?.forEach((f) => { obj[f.id] = getFieldValue(entry, f?.id); });
        return obj;
      });
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'movie_history_export.json';
      a?.click();
      URL.revokeObjectURL(url);
    } else if (selectedFormat === 'pdf') {
      const rows = filteredData?.map((entry) =>
        checkedFields?.map((f) => getFieldValue(entry, f?.id))
      );
      const colWidths = checkedFields?.map(() => Math.floor(180 / checkedFields?.length));
      const tableHeader = checkedFields?.map((f) => f?.label);

      let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Movie History Export</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11px; color: #222; margin: 20px; }
        h1 { font-size: 16px; margin-bottom: 4px; }
        p { font-size: 10px; color: #666; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #1a1a2e; color: #d4af37; padding: 6px 8px; text-align: left; font-size: 10px; }
        td { padding: 5px 8px; border-bottom: 1px solid #eee; }
        tr:nth-child(even) td { background: #f9f9f9; }
      </style></head><body>
      <h1>Movie History Export</h1>
      <p>Generated on ${new Date()?.toLocaleDateString()} · ${filteredData?.length} records</p>
      <table><thead><tr>${tableHeader?.map((h) => `<th>${h}</th>`)?.join('')}</tr></thead>
      <tbody>${rows?.map((row) => `<tr>${row?.map((cell) => `<td>${cell}</td>`)?.join('')}</tr>`)?.join('')}</tbody>
      </table></body></html>`;

      const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'movie_history_export.html';
      a?.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    const filteredData = getFilteredData();
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 80));
      setExportProgress(i);
    }
    generateDownload(filteredData);
    setIsExporting(false);
    setExportDone(true);
    setTimeout(() => {
      onClose();
      setExportDone(false);
    }, 1500);
  };

  const selectedFieldCount = fields?.filter((f) => f?.checked)?.length;

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e?.target === e?.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div
        className="modal-content mx-4"
        ref={modalRef}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-md flex items-center justify-center"
              style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)' }}
            >
              <Icon name="Download" size={18} color="var(--color-primary)" strokeWidth={2} />
            </div>
            <div>
              <h2
                id="export-modal-title"
                className="text-lg font-semibold"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
              >
                Export Data
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}
              >
                Configure and download your movie tracking data
              </p>
            </div>
          </div>
          <button
            ref={firstFocusRef}
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-surface-2)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
            aria-label="Close export modal"
          >
            <Icon name="X" size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 160px)' }}>
          {/* Export Format */}
          <div>
            <label
              className="block text-sm font-medium mb-3"
              style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-primary)' }}
            >
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {EXPORT_FORMATS?.map((fmt) => (
                <button
                  key={fmt?.value}
                  onClick={() => setSelectedFormat(fmt?.value)}
                  className="flex flex-col items-center gap-2 p-3 rounded-md border transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={{
                    background:
                      selectedFormat === fmt?.value
                        ? 'rgba(212, 175, 55, 0.12)'
                        : 'var(--color-surface-2)',
                    borderColor:
                      selectedFormat === fmt?.value
                        ? 'var(--color-primary)'
                        : 'var(--color-border)',
                    boxShadow: selectedFormat === fmt?.value ? 'var(--shadow-golden)' : 'none',
                  }}
                  aria-pressed={selectedFormat === fmt?.value}
                >
                  <Icon
                    name={fmt?.icon}
                    size={20}
                    color={selectedFormat === fmt?.value ? 'var(--color-primary)' : 'var(--color-text-secondary)'}
                    strokeWidth={1.5}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{
                      fontFamily: 'var(--font-caption)',
                      color: selectedFormat === fmt?.value ? 'var(--color-primary)' : 'var(--color-text-primary)',
                    }}
                  >
                    {fmt?.label}
                  </span>
                  <span
                    className="text-xs text-center"
                    style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}
                  >
                    {fmt?.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label
              className="block text-sm font-medium mb-3"
              style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-primary)' }}
            >
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DATE_RANGES?.map((range) => (
                <button
                  key={range?.value}
                  onClick={() => setSelectedRange(range?.value)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md border text-sm transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={{
                    background:
                      selectedRange === range?.value
                        ? 'rgba(212, 175, 55, 0.12)'
                        : 'var(--color-surface-2)',
                    borderColor:
                      selectedRange === range?.value
                        ? 'var(--color-primary)'
                        : 'var(--color-border)',
                    color:
                      selectedRange === range?.value
                        ? 'var(--color-primary)'
                        : 'var(--color-text-primary)',
                    fontFamily: 'var(--font-caption)',
                  }}
                  aria-pressed={selectedRange === range?.value}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderColor:
                        selectedRange === range?.value
                          ? 'var(--color-primary)'
                          : 'var(--color-border)',
                    }}
                  >
                    {selectedRange === range?.value && (
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: 'var(--color-primary)' }}
                      />
                    )}
                  </div>
                  {range?.label}
                </button>
              ))}
            </div>

            {/* Custom date inputs */}
            {selectedRange === 'custom' && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label
                    className="block text-xs mb-1.5"
                    style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e?.target?.value)}
                    className="w-full px-3 py-2 rounded-md border text-sm transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-ring"
                    style={{
                      background: 'var(--color-surface-2)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-primary)',
                      fontFamily: 'var(--font-data)',
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs mb-1.5"
                    style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e?.target?.value)}
                    className="w-full px-3 py-2 rounded-md border text-sm transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-ring"
                    style={{
                      background: 'var(--color-surface-2)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-primary)',
                      fontFamily: 'var(--font-data)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Data Fields */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label
                className="block text-sm font-medium"
                style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-primary)' }}
              >
                Include Fields
              </label>
              <span
                className="text-xs"
                style={{ fontFamily: 'var(--font-data)', color: 'var(--color-text-secondary)' }}
              >
                {selectedFieldCount}/{fields?.length} selected
              </span>
            </div>
            <div className="space-y-2">
              {fields?.map((field) => (
                <label
                  key={field?.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-250"
                  style={{
                    background: field?.checked ? 'rgba(212, 175, 55, 0.06)' : 'var(--color-surface-2)',
                    border: `1px solid ${field?.checked ? 'rgba(212, 175, 55, 0.2)' : 'var(--color-border)'}`,
                  }}
                >
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all duration-250"
                    style={{
                      background: field?.checked ? 'var(--color-primary)' : 'transparent',
                      border: `2px solid ${field?.checked ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    }}
                  >
                    {field?.checked && (
                      <Icon name="Check" size={10} color="var(--color-primary-foreground)" strokeWidth={3} />
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={field?.checked}
                    onChange={() => toggleField(field?.id)}
                    className="sr-only"
                    aria-label={field?.label}
                  />
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: 'var(--font-caption)',
                      color: field?.checked ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    }}
                  >
                    {field?.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs"
                  style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}
                >
                  Preparing export...
                </span>
                <span
                  className="text-xs"
                  style={{ fontFamily: 'var(--font-data)', color: 'var(--color-primary)' }}
                >
                  {exportProgress}%
                </span>
              </div>
              <div
                className="w-full h-1.5 rounded-full overflow-hidden"
                style={{ background: 'var(--color-surface-2)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-250"
                  style={{
                    width: `${exportProgress}%`,
                    background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                    boxShadow: 'var(--shadow-golden)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Success state */}
          {exportDone && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-md"
              style={{ background: 'rgba(78, 205, 196, 0.12)', border: '1px solid rgba(78, 205, 196, 0.3)' }}
            >
              <Icon name="CheckCircle" size={18} color="var(--color-success)" strokeWidth={2} />
              <span
                className="text-sm font-medium"
                style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-success)' }}
              >
                Export complete! Your file is downloading.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between gap-3 px-6 py-4 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <span
            className="text-xs"
            style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}
          >
            {selectedFieldCount} fields · {DATE_RANGES?.find((r) => r?.value === selectedRange)?.label} · {selectedFormat?.toUpperCase()}
          </span>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleExport}
              disabled={isExporting || exportDone || selectedFieldCount === 0}
              loading={isExporting}
              iconName="Download"
              iconPosition="left"
              iconSize={15}
            >
              {exportDone ? 'Done!' : 'Export'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExportModal;
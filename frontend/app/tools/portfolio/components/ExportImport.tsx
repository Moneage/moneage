'use client';

import { Download, Upload, Trash2 } from 'lucide-react';
import {
    exportToJSON,
    exportToCSV,
    importFromJSON,
    clearAll,
} from '@/lib/portfolio/portfolioStorage';

interface ExportImportProps {
    onUpdate: () => void;
}

export default function ExportImport({ onUpdate }: ExportImportProps) {
    const handleExportJSON = () => {
        const json = exportToJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportCSV = () => {
        const csv = exportToCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportJSON = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            try {
                const text = await file.text();
                importFromJSON(text);
                onUpdate();
                alert('Portfolio imported successfully!');
            } catch (error) {
                alert('Failed to import portfolio. Please check the file format.');
            }
        };
        input.click();
    };

    const handleClearAll = () => {
        if (
            confirm(
                'Are you sure you want to delete all portfolio data? This action cannot be undone.'
            )
        ) {
            clearAll();
            onUpdate();
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Data Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                    onClick={handleExportJSON}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Download size={18} />
                    Export JSON
                </button>

                <button
                    onClick={handleExportCSV}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Download size={18} />
                    Export CSV
                </button>

                <button
                    onClick={handleImportJSON}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <Upload size={18} />
                    Import JSON
                </button>

                <button
                    onClick={handleClearAll}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    <Trash2 size={18} />
                    Clear All
                </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
                💡 Tip: Export your portfolio regularly to backup your data. All data is stored locally in your browser.
            </p>
        </div>
    );
}

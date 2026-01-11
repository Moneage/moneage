'use client';

import { useState } from 'react';
import { FilterCriteria, SECTORS } from '@/lib/screener/types';
import { X } from 'lucide-react';

interface FilterPanelProps {
    filters: FilterCriteria;
    onFilterChange: (filters: FilterCriteria) => void;
}

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
    const [localFilters, setLocalFilters] = useState<FilterCriteria>(filters);

    const handleApply = () => {
        onFilterChange(localFilters);
    };

    const handleReset = () => {
        setLocalFilters({});
        onFilterChange({});
    };

    const toggleSector = (sector: string) => {
        const sectors = localFilters.sectors || [];
        const newSectors = sectors.includes(sector)
            ? sectors.filter((s) => s !== sector)
            : [...sectors, sector];
        setLocalFilters({ ...localFilters, sectors: newSectors });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button
                    onClick={handleReset}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                    <X size={16} />
                    Reset
                </button>
            </div>

            <div className="space-y-6">
                {/* Search */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input
                        type="text"
                        placeholder="Symbol or name..."
                        value={localFilters.searchQuery || ''}
                        onChange={(e) => setLocalFilters({ ...localFilters, searchQuery: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Price Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={localFilters.price?.min || ''}
                            onChange={(e) =>
                                setLocalFilters({
                                    ...localFilters,
                                    price: { ...localFilters.price, min: Number(e.target.value) || 0, max: localFilters.price?.max || Infinity },
                                })
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={localFilters.price?.max === Infinity ? '' : localFilters.price?.max || ''}
                            onChange={(e) =>
                                setLocalFilters({
                                    ...localFilters,
                                    price: { min: localFilters.price?.min || 0, max: Number(e.target.value) || Infinity },
                                })
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Market Cap Range (in Billions) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Market Cap (Billions)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={localFilters.marketCap?.min || ''}
                            onChange={(e) =>
                                setLocalFilters({
                                    ...localFilters,
                                    marketCap: { ...localFilters.marketCap, min: Number(e.target.value) || 0, max: localFilters.marketCap?.max || Infinity },
                                })
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={localFilters.marketCap?.max === Infinity ? '' : localFilters.marketCap?.max || ''}
                            onChange={(e) =>
                                setLocalFilters({
                                    ...localFilters,
                                    marketCap: { min: localFilters.marketCap?.min || 0, max: Number(e.target.value) || Infinity },
                                })
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* P/E Ratio Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">P/E Ratio</label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={localFilters.peRatio?.min || ''}
                            onChange={(e) =>
                                setLocalFilters({
                                    ...localFilters,
                                    peRatio: { ...localFilters.peRatio, min: Number(e.target.value) || 0, max: localFilters.peRatio?.max || Infinity },
                                })
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={localFilters.peRatio?.max === Infinity ? '' : localFilters.peRatio?.max || ''}
                            onChange={(e) =>
                                setLocalFilters({
                                    ...localFilters,
                                    peRatio: { min: localFilters.peRatio?.min || 0, max: Number(e.target.value) || Infinity },
                                })
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Sectors */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sectors</label>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {SECTORS.map((sector) => (
                            <label key={sector} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={localFilters.sectors?.includes(sector) || false}
                                    onChange={() => toggleSector(sector)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{sector}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Apply Button */}
                <button
                    onClick={handleApply}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
}

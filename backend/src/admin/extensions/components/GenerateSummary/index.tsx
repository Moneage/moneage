import React, { useState } from 'react';
import { Button } from '@strapi/design-system';
import { Sparkle } from '@strapi/icons';

const GenerateSummary = () => {
    const [loading, setLoading] = useState(false);

    // Parse URL to get ID and ensure we are on article page
    const match = window.location.pathname.match(/collection-types\/api::article\.article\/([a-zA-Z0-9-]+)/);
    const isCreate = window.location.pathname.includes('create');

    if (!match && !isCreate) {
        return null;
    }

    const id = match ? match[1] : null;

    const handleGenerate = async () => {
        if (!id) {
            alert('Please save the article at least once before generating a summary.');
            return;
        }

        try {
            setLoading(true);

            const token = sessionStorage.getItem('jwtToken')?.replace(/"/g, '');

            if (!token) {
                alert('Authentication error. Please reload.');
                return;
            }

            // Fetch the generated summary
            const response = await fetch(`${process.env.STRAPI_ADMIN_BACKEND_URL || ''}/api/articles/${id}/generate-summary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    save: true // We force save to DB because we can't easily update UI in Strapi 5 without internal hooks
                })
            });

            const data = await response.json();

            if (data && (data.success || data.data)) {
                const summary = data.data || data.summary;
                alert(`Summary Generated Successfully!\n\nTLDR: ${summary.aiTldr}\n\nPlease refresh the page to see the changes.`);
                // Optional: window.location.reload(); 
            } else {
                alert('Failed to generate summary.');
            }

        } catch (error) {
            console.error('Error generating summary:', error);
            alert('Failed to generate summary.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="secondary"
            startIcon={<Sparkle />}
            loading={loading}
            onClick={handleGenerate}
            fullWidth
        >
            Generate AI Summary
        </Button>
    );
};

export default GenerateSummary;

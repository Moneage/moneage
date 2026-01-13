import React, { useState } from 'react';
import { Button } from '@strapi/design-system';
import { Sparkles } from '@strapi/icons';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { useFetchClient } from '@strapi/helper-plugin';

const GenerateSummary = () => {
    const { modifiedData, onChange, slug } = useCMEditViewDataManager();
    const { post } = useFetchClient();
    const [loading, setLoading] = useState(false);

    // Only show on Article content type
    if (slug !== 'api::article.article') {
        return null;
    }

    const handleGenerate = async () => {
        try {
            setLoading(true);

            // Use current draft content
            const content = modifiedData.content;
            const title = modifiedData.title;
            const id = modifiedData.id;

            if (!content || !title) {
                alert('Please add a title and content first.');
                return;
            }

            // Call API with save=false to just get the data
            const { data } = await post(`/articles/${id || 'preview'}/generate-summary`, {
                content,
                title,
                save: false
            });

            if (data && data.success && data.data) {
                // Update fields in the editor
                onChange({ target: { name: 'aiTldr', value: data.data.aiTldr } });
                onChange({ target: { name: 'aiMetaDescription', value: data.data.aiMetaDescription } });
                onChange({ target: { name: 'aiKeywords', value: data.data.aiKeywords } });

                // Use Strapi notification system if available, or simple alert for now
                // toggleNotification({ type: 'success', message: 'Summary generated!' });
            }
        } catch (error) {
            console.error('Error generating summary:', error);
            alert('Failed to generate summary. Make sure you have saved the article at least once.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="secondary"
            startIcon={<Sparkles />}
            loading={loading}
            onClick={handleGenerate}
            fullWidth
        >
            Generate AI Summary
        </Button>
    );
};

export default GenerateSummary;

export function parseFAQFromContent(content: any[]): { question: string; answer: string }[] {
    const faqs: { question: string; answer: string }[] = [];
    if (!content || !Array.isArray(content)) return faqs;

    let capturingInFAQ = false;
    let currentQuestion = "";
    let currentAnswer = "";

    for (let i = 0; i < content.length; i++) {
        const block = content[i];

        // 1. Detect Start of FAQ Section (H2 matching "FAQ" or "Frequently Asked Questions")
        if (block.type === 'heading' && block.level === 2) {
            const text = block.children.map((c: any) => c.text).join('').toLowerCase();
            if (text.includes('tax') || text.includes('frequently asked questions') || text.includes('faq')) {
                capturingInFAQ = true;
                continue; // Skip the "FAQ" header itself
            } else if (capturingInFAQ) {
                // If we hit another H2, assume FAQ section ended
                break;
            }
        }

        if (capturingInFAQ) {
            // 2. Capture Questions (H3 or H4)
            if (block.type === 'heading' && (block.level === 3 || block.level === 4)) {
                // Push previous QA pairing if exists
                if (currentQuestion && currentAnswer) {
                    faqs.push({ question: currentQuestion, answer: currentAnswer.trim() });
                    currentAnswer = "";
                }
                currentQuestion = block.children.map((c: any) => c.text).join('');
            }
            // 3. Capture Answers (Paragraphs)
            else if (block.type === 'paragraph' && currentQuestion) {
                const text = block.children.map((c: any) => c.text).join('');
                currentAnswer += text + " ";
            }
        }
    }

    // Push final QA pairing
    if (currentQuestion && currentAnswer) {
        faqs.push({ question: currentQuestion, answer: currentAnswer.trim() });
    }

    return faqs;
}

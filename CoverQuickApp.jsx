import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CoverQuickApp() {
  const [resume, setResume] = useState('');
  const [job, setJob] = useState('');
  const [letter, setLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [usedFree, setUsedFree] = useState(false);

  const generateLetter = async () => {
    if (!resume || !job) return;
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, job }),
      });

      const data = await response.json();
      setLetter(data.letter);
      if (!isPremium) setUsedFree(true);
    } catch (error) {
      console.error('Error generating letter:', error);
      setLetter('Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpgrade = () => {
    window.location.href = '/api/create-checkout-session';
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">CoverQuick</h1>
      <p className="text-center text-gray-600 mb-6">Craft your perfect cover letter in seconds using AI</p>

      <Card className="mb-4">
        <CardContent className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Your Resume or Bio</label>
            <Textarea
              rows={5}
              value={resume}
              onChange={e => setResume(e.target.value)}
              placeholder="Paste your resume or write a quick summary..."
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Job Title or Description</label>
            <Textarea
              rows={3}
              value={job}
              onChange={e => setJob(e.target.value)}
              placeholder="e.g. Frontend Developer at Google"
            />
          </div>

          <Button onClick={generateLetter} disabled={isGenerating || (usedFree && !isPremium)}>
            {isGenerating ? 'Generating...' : 'Generate Letter'}
          </Button>
        </CardContent>
      </Card>

      {letter && (
        <Card className="mt-4">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Your Cover Letter</h2>
            <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded text-sm">{letter}</pre>
            {usedFree && !isPremium && (
              <div className="mt-4 bg-yellow-100 border border-yellow-300 p-3 rounded text-center">
                <p className="mb-2 font-medium">You've used your free generation!</p>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleUpgrade}>
                  Unlock Unlimited Access – $5
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const backgrounds = {
    '默认': 'var(--background)',
    '柔和': 'linear-gradient(135deg, #ffeef8, #e6f3ff)',
    '糖果': 'linear-gradient(45deg, #ff9a9e, #fad0c4)',
    '薄荷': 'linear-gradient(135deg, #a8edea, #fed6e3)',
    '日落': 'linear-gradient(135deg, #ffecd2, #fcb69f)',
    '薰衣草': 'linear-gradient(135deg, #e0c3fc, #9bb5ff)',
    '彩虹': 'linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcf7f)',
    '粉色': 'linear-gradient(135deg, #ffcdd2, #f8bbd9, #f48fb1)',
    '蓝色': 'linear-gradient(135deg, #bbdefb, #90caf9, #64b5f6)',
    '绿色': 'linear-gradient(135deg, #c8e6c9, #a5d6a7, #81c784)',
    '紫色': 'linear-gradient(135deg, #e1bee7, #ce93d8, #ba68c8)',
    '黄色': 'linear-gradient(135deg, #fff9c4, #fff59d, #fff176)',
    '橙色': 'linear-gradient(135deg, #ffe0b2, #ffcc02, #ffb74d)',
    '深蓝': 'linear-gradient(135deg, #001f3f, #003366)',
    '纯白': '#ffffff',
    '浅灰': '#f5f5f5',
    '深灰': '#333333'
};

export function BackgroundSelector() {
    const [selectedBg, setSelectedBg] = useState('默认');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const savedBg = localStorage.getItem('app-background') || '默认';
        setSelectedBg(savedBg);
        
        const bgValue = backgrounds[savedBg as keyof typeof backgrounds];
        if (savedBg === '默认') {
             document.body.style.background = '';
        } else {
             document.body.style.background = bgValue;
        }

    }, []);

    const handleBgChange = (name: string) => {
        setSelectedBg(name);
        localStorage.setItem('app-background', name);
        const bgValue = backgrounds[name as keyof typeof backgrounds];
        if (name === '默认') {
            document.body.style.background = ''; // Revert to CSS default
        } else {
            document.body.style.background = bgValue;
        }
    };

    if (!isClient) {
        return null;
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg"
                >
                    <Paintbrush className="h-6 w-6" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" side="top" align="end">
                <div className="space-y-2">
                    <p className="text-sm font-medium">选择背景</p>
                    <ScrollArea className="h-48">
                        <div className="grid grid-cols-3 gap-2 p-1">
                            {Object.entries(backgrounds).map(([name, value]) => (
                                <button
                                    key={name}
                                    onClick={() => handleBgChange(name)}
                                    className={cn(
                                        "h-12 w-full rounded-md border text-xs transition-transform hover:scale-105",
                                        selectedBg === name && "ring-2 ring-primary ring-offset-2"
                                    )}
                                    style={{ background: value }}
                                    title={name}
                                >
                                    {name === '纯白' || name === '浅灰' ? <span className="text-black">{name}</span> : 
                                     name === '深灰' || name === '深蓝' ? <span className="text-white">{name}</span> : null}
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </PopoverContent>
        </Popover>
    );
}
